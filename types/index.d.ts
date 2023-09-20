import type { CheerioAPI } from 'cheerio'

export type Date = string

export interface ICollection {
  title: string
  href: string
  datetime: Date
}

export interface IArticle {
  title: string
  url: string
  desc: string
}

// 本地保存的数据结构
export interface IDataItem {
  title: string
  url: string
  desc: string
  issue: string
  date: string
}
// {
//   "title": "算法工程师深度解构 ChatGPT 技术",
//   "url": "https://mp.weixin.qq.com/s/QA8ZOtCDP1X2EKzpZCY0RA",
//   "desc": "本文用专业视野带你由浅入深了解 ChatGPT 技术全貌。它经历了什么训练过程？成功关键技术是什么？将如何带动行业的变革？开发者如何借鉴 ChatGPT 思路和技术，投入到日常工作中？期望本文能给你新的灵感。",
//   "issue": "奇舞周刊第 478 期",
//   "date": "2023-1-06"
// }

// Supabase中article表结构
export interface ISupabaseArticleItem extends IDataItem {
  id: number
  created_at: string
}
