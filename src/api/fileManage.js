import request from '@/utils/request'

export function uploadFile(param,config) {
    return request({
      url: '/FileUploadController/upload',
      method: 'post',
      'file':param.file,
      params: param,
      config:config
    })
}