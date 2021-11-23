const fetch = require('./lib/fetch')

fetch({ save: true, progress: true, reload: true }).then(({ collections, articles }) => {
  console.log(`抓取完成，总共${collections.length}个集合，${articles.length}篇文章`)
  process.exit()
})
