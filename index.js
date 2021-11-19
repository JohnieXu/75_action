const path = require('path')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const cliProgress = require('cli-progress')

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

getCollections().then(collections => {
  const totalLen = collections.length
  let doneLen = 0
  const doneUrls = []
  let all = []

  bar1.start(collections.length, 0)
  
  collections.map((i, { title, url, date }) => {
    getArticleDoc(url).then(getArticles).then(list => {
      all = [...all, ...list]
    }).catch(e => {
      console.error(e)
    }).finally(() => {
      doneLen++
      doneUrls.push(url)

      // 调试用
      // Promise.resolve().then(() => {
      //   if (doneLen >= 420) {
      //     console.log(JSON.stringify(doneUrls), doneUrls.length, totalLen)
      //   }
      // })

      bar1.update(doneLen)
      
      if (doneLen >= totalLen) {
        bar1.stop()
        console.log(`抓取完成，总共${collections.length}个集合，${all.length}篇文章`)
        console.log(JSON.stringify(all))
      }
    })
  })
})
