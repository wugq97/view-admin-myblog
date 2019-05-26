import request from '@/utils/request'

export function getPublicFiles(page, pageSize) {
  return request({
    url: '/admin/files/public',
    method: 'get',
    params: {
      page, pageSize
    }
  })
}
export function getPrivateFiles(page, pageSize) {
  return request({
    url: '/admin/files/private',
    method: 'get',
    params: {
      page, pageSize
    }
  })
}

export function updateFile(id, status) {
  return request({
    url: 'admin/files',
    method: 'put',
    params: {
      id, status
    }
  })
}

export function deleteFile(id) {
  return request.delete(`/admin/files/${id}`)
}
