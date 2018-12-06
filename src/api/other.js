import request from '@/utils/request'

export function getYiYan() {
  let api = 'https://v1.hitokoto.cn/';
  return request({
      url: api,
      method: 'get'
  })
}