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
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
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
    path: '/system',
    component: Layout,
    redirect: '/system/userManage',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'userManage',
        name: 'userManage',
        component: () => import('@/views/table/index'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '菜单管理', icon: 'tree' }
      },
      {
        path: 'dataDic',
        name: 'Dic',
        component: () => import('@/views/dataDic/index'),
        meta: { title: '字典管理', icon: 'dic' }
      }
    ]
  },

  {
    path: '/Article',
    component: Layout,
    redirect: '/article/create',
    name: '文章管理',
    meta: {
      title: '文章管理',
      icon: 'article'
    },
    children: [
      {
        path: 'CreateArticle',
        name: 'CreateArticle',
        component: () => import('@/views/article/create'),
        meta: {title:'创建文章',icon:'article_add'  }
      },{
        path: 'ArticleList',
        name: 'ArticleList',
        component: () => import('@/views/article/list'),
        meta: {title:'文章列表',icon:'article_list'  }
      },
      {
        path: 'EditArticle/:id(\\d+)',
        component: () => import('@/views/article/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
    ]
  },

  {
    path: '/picture',
    component: Layout,
    redirect: '/picture/index',
    name: 'Picture',
    meta: {
      title: '图片管理',
      icon: 'picture'
    },
    children: [
      {
        path: 'uploadPicture',
        component: () => import('@/views/picture/index'), // Parent router-view
        name: 'pictureUpload',
        meta: { title: '图片上传', icon:'picture_upload' }
      },{
        path: 'pictureManage',
        component: () => import('@/views/picture/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: '轮播图管理', icon:'picture' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://vonjane.github.io/jane.github.io/',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },

  //{ path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
