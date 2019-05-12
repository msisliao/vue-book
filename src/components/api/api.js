import axios from 'axios'

// 首页书籍
export function bootd(id) {
  return axios.get(`/api/recommendPage/books/${id}`)
}
// 书籍信息 全面的 
export function books(id) {
  return axios.get(`/api/book/${id}`)
}
// 评论
export function bookpl(id, limit) {
  return axios.get(`/api/post/review/best-by-book?book=${id}&limit=${limit}`)
}
// 同类书籍推荐
export function bookrecommend(id) {
  return axios.get(`/api/book/${id}/recommend`)
}
// 小说源
export function bookhy(id) {
  return axios.get(`/api/atoc/?view=summary&book=${id}`)
}
// 书籍目录
export function bookmulu(id) {
  return axios.get(`/api/btoc/${id}?view=chapters&channel=mweb`)
}
// 书籍章节内容
export function bookcontent(link) {
  return axios.get(`/content/chapter/${link}`)
}
// 书籍信息 简要的 （总章数 源）
export function book(id) {
  return axios.get(`/api/btoc?view=summary&book=${id}`)
}

// 小说搜索
export function booksearch(key) {
  return axios.get(`/api/book/fuzzy-search?query=${key}`)
}
