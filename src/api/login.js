import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/LoginController/login',
    method: 'post',
    params: {
      'username' : username,
      'password' : password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/LoginController/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
