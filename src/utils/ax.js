// 导入vue，最终运行的时候系统会识别成一个vue模块
import Vue from 'vue'
// 引入路由
import router from '@/router'
// 引入axios
import axios from 'axios'
// 设置根路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置axios为vue成员
Vue.prototype.$http = axios
// 配置拦截器
// axios.interceptors.request.use(function (config) {
//   var userinfo = JSON.parse(window.sessionStorage.getItem('userinfo'))
//   if (userinfo && userinfo.token) {
//     // 配置请求头 config.headers.Authorization
//     config.headers.Authorization = `Bearer ${userinfo.token}`
//   }

//   return config
// }, function (error) {
//   return Promise.reject(error)
// })
// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // userinfo并不是始终存在的，要做判断使用
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 判断token是否存在
  if (userinfo) {
    // 拿到token信息
    let token = JSON.parse(userinfo).token
    // 给axios请求头配置token
    config.headers.Authorization = 'Bearer ' + token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})
// 把axios变为vue成员
Vue.prototype.$http = axios
// 响应拦截器----------------------------------
axios.interceptors.response.use(function (response) {
  // 正常响应处理
  return response
}, function (error) {
  // 响应失败处理
  // 判断响应状态码如果登录401，就强制登录
  // error对象
  // error.response.status======401
  // console.dir(error)
  if (error.response.status === 401) {
    // 如果error.response.status======401，那抹就表示token已经失效了，需要跳转页面，使用户强制登录
    // 调用路由对象的push方法跳转页面
    router.push({ name: 'login' })
  }
  return Promise.reject(error)
})
