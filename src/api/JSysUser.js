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

export function setUser(data) {
  debugger
  return request({
    url: '/UserController/insertJSysUser',
    method: 'post',
    params:  data
  })
}

export function updateUser(data) {
  debugger
  return request({
    url: '/UserController/updateJSysUser',
    method: 'post',
    params:  data
  })
}
