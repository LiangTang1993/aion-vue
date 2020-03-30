import request from '@/utils/request'

export function getgood(data) {
  return request({
    baseURL: 'http://132.232.32.8:9090/',
    url: 'goods/',
    method: 'get',
    data
  })
}
