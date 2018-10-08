import request from '@/utils/request'

export function queryList(query) {
  return request({
    url: '/DataDicController/getDataDic',
    method: 'get',
    params: query
  })
}

export function queryKeyList(query) {
  debugger
  return request({
    url: '/DataDicController/getKeyDicPage',
    method: 'post',
    params: query
  })
}

export function insertDataDic(data) {
  return request({
    url: '/DataDicController/insertDataDic',
    method: 'post',
    params: data
  })
}
