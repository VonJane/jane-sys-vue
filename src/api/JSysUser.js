import request from '@/utils/request'

export function getUserPages(data) {
  debugger
  return request({
    url: '/UserController/getUserPages',
    method: 'post',
    params: data
  })
}

export function setUser(data,url) {
  debugger
  return request({
    url: url,
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
