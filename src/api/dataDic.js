import request from '@/utils/request'

export function queryList(query) {
  return request({
    url: '/DataDicController/getDataDic',
    method: 'get',
    params: query
  })
}
