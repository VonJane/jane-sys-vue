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

export function insertDataDic(data,url) {
  return request({
    url: url,
    method: 'post',
    params: data
  })
}

export function deleteDataDic(data,url) {
  debugger
  return request({
    url: url,
    method: 'post',
    params: data
  })
}
