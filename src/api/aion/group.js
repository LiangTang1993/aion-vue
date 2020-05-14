import request from '@/utils/request'

export function getGroup(data) {
  return request({
    url: 'group/',
    method: 'get',
    params: data
  })
}

export function getGroupItem(id) {
  return request({
    url: 'group/' + id,
    method: 'get'
  })
}

export function insertGroup(data) {
  return request({
    url: 'group/',
    method: 'post',
    data: data
  })
}

export function insertPerson(data) {
  return request({
    url: 'groupPerson/',
    method: 'post',
    data: data
  })
}

export function deleteGroup(id) {
  return request({
    url: 'group/' + id + '/',
    method: 'delete'
  })
}

export function deletePerson(id) {
  return request({
    url: 'groupPerson/' + id + '/',
    method: 'delete'
  })
}

