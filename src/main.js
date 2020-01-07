import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-ui组件库
import ElementUI from 'element-ui'
// 引入axios
import axios from 'axios'
// 引入初始化css样式
import '@/assets/css/global.css'
// 设置根路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置axios为vue成员
Vue.prototype.$http = axios
// 注册组件
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
