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

program.parse(process.argv)
       