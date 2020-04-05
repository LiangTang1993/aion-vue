import request from '@/utils/request'

export function getgood(data) {
  return request({
    baseURL: 'http://132.232.32.8:9090/',
    url: 'goods/',
    method: 'get',
    data
  })
}

export function insertGoods(data) {
  return request({
    url: 'goods/',
    method: 'post',
    data
  })
}

export function selectGoods(data) {
  return request({
    url: 'goods/',
    method: 'get',
    params: data
  })
}

export function getGoodsItem(id) {
  return request({
    url: 'goods/' + id,
    method: 'get'
  })
}

export function updateGoods(data) {
  return request({
    url: 'goods/' + data.id + '/',
    method: 'put',
    data: data
  })
}

export function InsertGoodsImage(data) {
  return request({
    url: 'goodsImage/',
    method: 'post',
    data: data
  })
}
