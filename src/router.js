import Vue from 'vue'
import Router from 'vue-router'
// import Home from './components/tabbar/Home.vue'
// import Classify from './components/tabbar/Classify.vue'
// import Rank from './components/tabbar/Rank.vue'
// import Bookrack from './components/tabbar/Bookrack.vue'
// import Book from './components/book/Book.vue'
// import Read from './components/read/Read.vue'
// import Mvlu from './components/read/Mvlu.vue'
// import List from './components/read/List.vue'
// import Clylist from './components/read/Clylist.vue'
// import Search from './components/read/Search-list.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: resolve => require(['./components/tabbar/Home'], resolve)
    },
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['./components/tabbar/Home'], resolve),
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/bookrack', // 书架
      name: 'bookrack',
      component: resolve => require(['./components/tabbar/Bookrack'], resolve)
    },
    {
      path: '/book:id', // 小说详情
      name: 'book',
      component: resolve => require(['./components/book/Book'], resolve),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/list:id', // 分类列表
      name: 'list',
      component: resolve => require(['./components/read/list'], resolve)
    },
    {
      path: '/read:id',
      name: 'read',
      component: resolve => require(['./components/read/read'], resolve)
    },
    {
      path: '/search',
      name: 'search',
      component: resolve => require(['./components/read/search'], resolve)

    }

  ],
  linkActiveClass: 'gaoliang'
})
