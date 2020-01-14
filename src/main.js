import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element-ui组件库
// import ElementUI from 'element-ui'
// 引入axios
import './utils/ax'
// 引入初始化css样式
// import '@/assets/css/global.css'

// 按需引入
import '@/utils/element.js'
// 注册组件
// Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
