import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/article',
    component: Layout,
    name: 'Articles',
    redirect: '/article/list',
    meta: {
      title: '文章管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        name: 'ArticleList',
        component: () => import('@/views/article'),
        meta: { title: '所有文章', icon: 'table' }
      },
      {
        path: 'edit',
        name: 'ArticleAdd',
        component: () => import('@/views/article/edit'),
        meta: { title: '添加文章', icon: 'table' }
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    name: 'Category',
    redirect: '/category/list',
    meta: {
      title: '分类管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        name: 'CategoryList',
        component: () => import('@/views/category'),
        hidden: true,
        meta: { title: '所有分类', icon: 'table' }
      }
    ]
  },
  {
    path: '/tag',
    component: Layout,
    name: 'Tags',
    redirect: '/tag/list',
    meta: {
      title: '标签管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        name: 'TagList',
        component: () => import('@/views/tag'),
        hidden: true,
        meta: { title: '所有标签', icon: 'table' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'Users',
    redirect: '/user/tabs',
    meta: {
      title: '用户管理',
      icon: 'form'
    },
    children: [
      {
        path: 'tabs',
        name: 'UserTabs',
        component: () => import('@/views/user'),
        redirect: '/user/tabs/admin',
        hidden: true,
        meta: { title: '权限', icon: 'table' },
        children: [
          {
            path: 'admin',
            name: 'admin',
            component: () => import('@/views/user/admin'),
            hidden: true,
            meta: { title: '管理员', icon: 'table' }
          },
          {
            path: 'editor',
            name: 'editor',
            component: () => import('@/views/user/editor'),
            hidden: true,
            meta: { title: '作者', icon: 'table' }
          },
          {
            path: 'normal',
            name: 'normal',
            component: () => import('@/views/user/normal'),
            hidden: true,
            meta: { title: '普通用户', icon: 'table' }
          }
        ]
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    name: 'comment',
    redirect: '/comment/list',
    meta: {
      title: '评论管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        name: 'commentList',
        component: () => import('@/views/comment'),
        hidden: true,
        meta: { title: '所有评论', icon: 'table' }
      }
    ]
  },
  {
    path: '/file',
    component: Layout,
    name: 'file',
    redirect: '/file/list',
    meta: {
      title: '文件管理',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        name: 'fileList',
        component: () => import('@/views/file'),
        hidden: true,
        meta: { title: '所有文件', icon: 'table' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
