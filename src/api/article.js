import request from '@/utils/request'

export function getArticles(uid, parentCategoryId, childCategoryId, page, pageSize) {
  return request({
    url: '/admin/articles',
    method: 'get',
    params: {
      uid,
      parentCategoryId,
      childCategoryId,
      page,
      pageSize
    }
  })
}

export function addArticle(article) {
  return request({
    url: '/admin/articles',
    method: 'post',
    params: {
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
      categoryIdParent: article.categoryIdParent,
      categoryIdChild: article.categoryIdChild,
      tagIds: article.tagIds.join(','),
      img: article.img,
      status: article.status,
      userId: article.userId
    }
  })
}

export function deleteArticle(id) {
  return request.delete(`/admin/articles/${id}`)
}

export function updateArticle(article) {
  return request({
    url: '/admin/articles',
    method: 'put',
    params: {
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
      categoryIdParent: article.categoryIdParent,
      categoryIdChild: article.categoryIdChild,
      tagIds: article.tagIds.join(','),
      img: article.img,
      status: article.status,
      userId: article.userId
    }
  })
}

export function getArticle(id) {
  return request({
    url: `/admin/articles/${id}`,
    method: 'get'
  })
}

export function recommendArticle(id, status) {
  return request({
    url: '/admin/recommend',
    method: 'post',
    params: {
      id, status
    }
  })
}
