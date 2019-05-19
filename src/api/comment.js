import request from '@/utils/request'

export function getComments(page, pageSize) {
  return request({
    url: '/admin/comments',
    method: 'get',
    params: {
      page, pageSize
    }
  })
}

export function deleteComment(id) {
  return request.delete(`/admin/comments/${id}`)
}
