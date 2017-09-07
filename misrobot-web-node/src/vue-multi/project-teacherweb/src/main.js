// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import $ from 'jquery'
import '../../sourse/js/jquery.cookie'
import echarts from 'echarts'
window.jQuery=window.$=$
console.log('main................................................lllllllllllllllllllllllllllllllllllllllllllllllllllllllll')
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$bus = new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:x => x(App)
}).$mount('#app')

