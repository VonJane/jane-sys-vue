import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/ArticleController/getArticlePages',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/ArticleController/getArticleById',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/ArticleController/createArticle',
    method: 'post',
    params:data
  })
}

export function updateArticle(data) {
  return request({
    url: '/ArticleController/updateArticle',
    method: 'post',
    params:data
  })
}
