import request from '@/utils/request'

export function getTags(page, pageSize) {
  return request({
    url: '/tags',
    method: 'get',
    params: {
      page,
      pageSize
    }
  })
}

export function getTag(id) {
  return request({
    url: '/tags',
    method: 'get',
    params: {
      id
    }
  })
}

export function addTag(tag) {
  return request({
    url: '/tags',
    method: 'post',
    params: {
      name: tag.name,
      description: tag.description
    }
  })
}

export function deleteTag(id) {
  return request.delete(`/tags/${id}`)
}

export function updateTag(tag) {
  return request({
    url: '/tags',
    method: 'put',
    params: {
      id: tag.id,
      name: tag.name,
      description: tag.description
    }
  })
}
