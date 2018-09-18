import request from '@/utils/request'

export function getUserPages(data) {
  debugger
  return request({
    url: '/UserController/getUserPages',
    method: 'post',
    params: {
      "pageNum":data.pageNum,
      "pageSize":data.pageSize
    }
  })
}
