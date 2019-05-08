import request from '@/utils/request'

export function getUsers(authority, currentPage, pageSize) {
  return request({
    url: '/admin/users',
    method: 'get',
    params: {
      authority,
      currentPage,
      pageSize
    }
  })
}

export function deleteUser(id) {
  return request.delete(`/admin/users/${id}`)
}

export function updateAuth(id, auth) {
  return request.put(`/admin/users/${id}?auth=${auth}`)
}

