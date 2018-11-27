import request from '@/utils/request'

export function upload(param) {
  return request({
    url: '/FileUploadController/upload',
    method: 'post',
    data: param
  })
}