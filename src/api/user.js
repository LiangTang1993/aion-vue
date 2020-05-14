import request from '@/utils/request'

export function login(data) {
  return request({
    // baseURL: 'http://132.232.32.8:9090/',
    url: 'login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'getUserInfo/',
    method: 'get',
    params: { token }
  })
}

export function code(data) {
  return request({
    url: 'code/',
    method: 'post',
    data: data
  })
}

export function createUser(data) {
  return request({
    // baseURL: 'http://132.232.32.8:9090/',
    url: 'users/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    // baseURL: 'http://132.232.32.8:9090/',
    url: 'logoutview/',
    method: 'get'
  })
}

export function upDateUserInfo(data) {
  return request({
    // baseURL: 'http://132.232.32.8:9090/',
    url: 'getUserInfo/',
    method: 'post',
    data: data
  })
}
