#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package.json')
const fetch = require('../lib/fetch')

function random(number, list) {
  const min = 0
  const max = list.length
  const rand = () => {
    const r = Math.round(Math.random() * max)
    if (r < min || r > max) {
      return rand()
    }
    return r
  }
  const res = []
  const randI = []
  for (let i = 0; i < number; i++) {
    let r = rand()
    randI.push(r)
    res.push(list[r])
  }
  return res
}

function hasKeyword(keyword, source) {
  if (!keyword || !source) { return false }
  return source.indexOf(keyword) !== -1
}

/**
 * 75_action -h // 帮助说明
 * 75_action -v // version
 * 75_action -d // debug
 * 75_action // 随机1篇文章（暂未实现）
 * 7t_action // 帮助说明
 * 75_action random [number] // 随机n篇文章
 * 75_action fetch // 抓取全部文章
 */

program.version(`75_action ${packageJson.version}`)
       .usage('[<command> [options]]')

program.command('random [number]')
       .description('随机获取n篇文章链接')
       .option('-d, --debug', '开启debug模式')
       .action((number, options) => {
         number = number || 1
         if (options.debug) {
           console.log(number, options)
         }
         fetch({ save: 'home', progress: true }).then(({ collections, articles }) => {
           const selected = random(number, articles)
           console.log(JSON.stringify(selected, null, 2))
           process.exit()
         }).catch((e) => {
           console.log(e)
           process.exit(1)
         })
       })

program.command('fetch')
       .description('重新抓取文章链接')
       .option('-d, --debug', '开启debug模式')
       .action((options) => {
          if (options.debug) {
            console.log(options)
          }
          fetch({ save: 'home', progress: true, reload: true }).then(({ collections, articles }) => {
            console.log(`抓取完成，总共${collections.length}个集合，${articles.length}篇文章`)
            process.exit()
          })
       })

program.command('issue [number]')
       .description('返回最新周刊内文章')
       .option('-d, --debug', '开启debug模式')
       .action((number, options) => {
          number = number || 1
          if (options.debug) {
            console.log(number, options)
          }
          fetch({ save: 'home', progress: true }).then(({ collections, articles }) => {
            let dates = new Set()
            let datesArr = []

            articles.forEach((article) => {
              dates.add(article.date)
            })
            // TODO: 减少遍历次数优化性能
            datesArr = [...dates].sort((a, b) => b.localeCompare(a))

            number = number > datesArr.length ? datesArr.length : number
            number = number <= 0 ? 1 : number
            dates = new Set(datesArr.slice(0, number))

            if (options.debug) {
              console.log(dates, datesArr)
            }

            const selected = articles.filter(({ date }) => dates.has(date))
            if (options.debug) {
              console.log(collections, articles)
            }
            if (!selected.length) {
              console.log('所选期刊无文章')
            } else {
              console.log(JSON.stringify(selected, null, 2))
            }
            process.exit()
          }).catch((e) => {
            console.log(e)
            process.exit(1)
          })
       })

program.command('search')
       .description('搜索文章')
       .option('-d, --debug', '开启debug模式')
       .option('-k, --keyword <keyword>', '搜索关键词：文章标题、简介、链接')
       .option('-t, --date <date>', '文章所在日期，例如：2022-01-07、2022-01、2022等')
       .action((options) => {
        if (options.debug) {
          console.log(options)
        }
        fetch({ save: 'home', progress: true }).then(({ collections, articles }) => {
          const keyword = options.keyword
          const selected = articles.filter(({ title, desc, url, date }) => {
            const matched = hasKeyword(keyword, title) || hasKeyword(keyword, desc) || hasKeyword(keyword, url)
            if (options.date) {
              return hasKeyword(options.date, date) && matched
            }
            return matched
          })
          if (options.debug) {
            console.log(selected)
          }
          if (!selected.length) {
            console.log('未搜索到文章')
          } else {
            console.log(JSON.stringify(selected, null, 2))
          }
          process.exit()
        }).catch((e) => {
          console.log(e)
          process.exit(1)
        })
      })

program.parse(process.argv)
       