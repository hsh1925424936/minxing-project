import Vue from 'vue'
import Router from 'vue-router'
import login from '@/page/login'
import Index from '@/page/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      // children:[
      // 	{
      // 		path:'/index',
      // 		name:'Index',
      // 		component:Index
      // 	}
      // ]
    },
    {
      path:'/index',
      name:'Index',
      component:Index
    }
  ],
  //mode:'history'
})
