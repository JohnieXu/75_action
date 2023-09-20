const { createClient } = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient('https://pbtzzoszvsfppvaxidyr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidHp6b3N6dnNmcHB2YXhpZHlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NTIwNjE2NiwiZXhwIjoyMDEwNzgyMTY2fQ.NFroBY8WeYmm8XaXRL7k4FKIxYME-ZRkzon4kyy-DMQ')

module.exports = {
  supabase,
  /**
   * 根据文章标题获取文章记录，若找不到则返回null
   * @param {string} title 文章标题
   * @returns {Promise<null | import('../types').IDataItem>}
   */
  async getArticle(title) {
    const res = await supabase
      .from('article')
      .select()
      .eq('title', title)
    if (res.error) {
      throw res.error
    }
    return res.data[0] || null
  },
  /**
   * 保存更新文章记录，若成功则返回更新后的文章记录对象
   * @typedef {import('../types').ISupabaseArticleItem} ISupabaseArticleItem
   * @param {ISupabaseArticleItem} article 文章记录
   * @returns {Promise<ISupabaseArticleItem>}
   */
  async saveArticle(article) {
    const res = await supabase
      .from('article')
      .upsert(article)
      .select()
      .eq('id', article.id)
    if (res.error) {
      throw res.error
    }
    if (!res.data || !res.data[0] || !res.data[0].id) {
      throw new Error('保存文章失败')
    }
    return res.data[0]
  }
}
