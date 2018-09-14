import request from '@/utils/request'

export function login() {
  return request({
    url: 'localhost:8080/springboot-mybatis/UserController/getUserPages',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
