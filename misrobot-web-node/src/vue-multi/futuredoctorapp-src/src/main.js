/**
 * Created by liuchuanyang on 2017/3/10
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueResource from 'vue-resource'
import router from './router/router'
import routerInit from './router/router-actions'
import $ from 'jquery'

import infiniteScroll from './directives/infiniteScroll'

window.jQuery = window.$ = $;
import * as filters from './filters/filters'
import App from './App'

Vue.use(VueRouter);
routerInit(router);

// Directive
Vue.directive('infiniteScroll', infiniteScroll)
// Vue.directive('fancybox', fancybox)
/*Vue.directive('popover', popover)
Vue.directive('mcheck', mcheck)
Vue.directive('maxlength', maxlength)*/

// Filters
Vue.filter('substr', filters.substr)
Vue.filter('substring', filters.substring)

$.ajaxSetup({
    cache: false
});

new Vue({
  router,
  ...App
}).$mount('#app');

// window.router = router
