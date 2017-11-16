import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
// import Home from '@/components/home'
import Shop from '@/components/addShop'
import ShopDetail from '@/components/shopDetail'
import Test from '@/components/BScroll_test'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path:'/shop',
      name:'shop',
      component:Shop
    },
    {
      path:'/shopDetail',
      name:'shopDetail',
      component:ShopDetail
    },
    {
      path:'/test',
      name:'BScroll',
      component:Test
    }
  ]
})
