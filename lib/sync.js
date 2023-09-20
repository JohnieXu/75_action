const cliProgress = require('cli-progress')
const { getHomeFileJson } = require('./file')
const { getArticle, saveArticle } = require('./supabase')

/**
 * 同步抓取到的所有文章记录到Supabase数据库
 * @typedef {import('../types').IDataItem} IDataItem
 * @param {IDataItem[]} all 文章记录列表
 * @param {boolean} progress 是否展示进度条
 * @param {*} bar
 */
function syncToSupabase(all, progress, bar) {
  const len = all.length
  progress && bar.start(len, 0)
  let doneCount = 0
  let okCount = 0
  let failCount = 0
  all.map(article => {
    getArticle(article.title).then(oarticle => {
      if (oarticle && oarticle.id) {
        // 使用ID去更新文章记录
        return saveArticle({
          id: oarticle.id,
          ...article,
        })
      } else {
        // 新增文章记录
        return saveArticle(article)
      }
    }).then(() => {
      okCount += 1
      progress && bar.update(doneCount)
    }).catch(e => {
      failCount += 1
      // console.log(e)
    }).finally(() => {
      doneCount += 1
      console.log(doneCount, okCount, failCount, len)
      if (doneCount >= len) {
        progress && bar.stop()
        console.log(`同步记录到 Supabase 结果：总记录数 ${len} 条，成功 ${okCount} 条，失败 ${failCount} 条`)
      }
    })
  })
}

function syncLocalData({ progress }) {
  const data = getHomeFileJson()
  if (!data || !data.length) {
    return Promise.resolve()
  }
  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
  progress && bar1.start(data.length, 0)
  return syncToSupabase(data, progress, bar1)
}

module.exports = {
  syncToSupabase,
  syncLocalData,
}
