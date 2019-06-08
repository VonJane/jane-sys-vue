import request from '@/utils/request'

export function userSearch(name) {
  return request({
    url: '/UserController/getJSysUser',
    method: 'get',
    params: { "jUserName":name }
  })
}


export function articleCategorySearch(name) {
  return request({
    url: '/ArticleCategoryController/queryArticleCategoryList',
    method: 'get',
    params: { "categoryName":name }
  })
}