const cheerio = require('cheerio')
const _fetch = require('node-fetch')
const https = require('https')
const cliProgress = require('cli-progress')
const { writeFile, writeFileToHome, getHomeFileJson, isCacheOutDate } = require('./file')

const fetch = (...args) => _fetch(...args, {
  agent: https.Agent({
    keepAlive: true,
    rejectUnauthorized: false,
  })
})
const homeUrl = 'https://weekly.75.team'

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

function getArticleDoc(url) {
  return fetch(homeUrl + url)
  .then(res => res.text())
  .then(res => {
    if (!res) {
      return Promise.reject(new Error("获取网页内容失败"))
    }
    return cheerio.load(res)
  })
}

function getArticles(doc) {
  const $ = doc
  const el = $('ul > li.article')
  const list = el.map((i, l) => {
    return {
      title: $(l).find('h3.title > a').text(),
      url: $(l).find('h3.title > a').attr('href'),
      desc: $(l).find('.desc').text()
    }
  })
  // console.log(list)
  return list
}

function getCollections() {
  return fetch(homeUrl)
  .then(res => res.text())
  .then(res => {
    if (!res) {
      return Promise.reject(new Error('获取网页内容失败'))
    }
    return cheerio.load(res)
  })
  .then($ => {
    const list = $('ol.issue-list > li')
    const collections = list.map((i, l) => {
      const title = $(l).find('a').attr('title')
      const url = $(l).find('a').attr('href')
      const date = $(l).find('.date').attr('datetime')
      return { title, url, date }
    })
    return collections
  })
}

module.exports = ({ save = true, progress = true, reload = false, timeout } = {}) => {
  const TIMEOUT = timeout || 1000 * 60 * 5 // 5分钟超时

  return new Promise((resolve, reject) => {

    if (!reload && !isCacheOutDate()) {
      const articles = getHomeFileJson()
      resolve({ collections: [], articles})
      return
    }

    setTimeout(() => {
      reject(new Error('抓取文章超时'))
    }, TIMEOUT)

    getCollections().then(collections => {
      const totalLen = collections.length
      let doneLen = 0
      const doneUrls = []
      let all = []
    
      progress && bar1.start(collections.length, 0)
      
      collections.map((i, { title, url, date }) => {
        getArticleDoc(url).then(getArticles).then(list => list.map((_, item) => ({ ...item, issue: title, date }))).then(list => {
          all = [...all, ...list]
        }).catch(e => {
          console.error(e)
        }).finally(() => {
          doneLen++
          doneUrls.push(url)
    
          progress && bar1.update(doneLen)
          
          if (doneLen >= totalLen) {
            progress && bar1.stop()
            all = all.sort((a, b) => b.date.localeCompare(a.date)) // date倒序排列
            if (save === true) {
              writeFile(all)
              resolve({ collections, articles: all })
            } else if (save === 'home') {
              writeFileToHome(all).then(() => {
                resolve({ collections, articles: all })
              })
            }
          }
        })
      })
    })
  })
}

