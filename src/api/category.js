import request from '@/utils/request'

export function getCategories(page, pageSize) {
  return request({
    url: '/admin/categories',
    method: 'get',
    params: {
      page,
      pageSize
    }
  })
}

export function getParentCategories() {
  return request({
    url: '/admin/categories/parent',
    method: 'get'
  })
}

export function addCategory(category) {
  return request({
    url: '/admin/categories',
    method: 'post',
    params: {
      pid: category.pid,
      name: category.name,
      description: category.description
    }
  })
}

export function deleteCategory(id) {
  return request.delete(`/admin/categories/${id}`)
}

export function updateCategory(category) {
  return request({
    url: '/admin/categories',
    method: 'put',
    params: {
      id: category.id,
      pid: category.pid,
      name: category.name,
      description: category.description
    }
  })
}
