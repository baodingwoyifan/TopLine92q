// 导入vue，最终运行的时候系统会识别成一个vue模块
import Vue from 'vue'
// 引入json-bigint
import JSONbig from 'json-bigint'
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
// 配置请求拦截器----------------------------------------
axios.interceptors.request.use(function (config) {
  //  拿到我们之前在前面存在本地存储中的userinfo，而userinfo并不是始终存在的，要做判断使用
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 如果userinfo存在，拿到关键信息token
  if (userinfo) {
    // 拿到token信息
    let token = JSON.parse(userinfo).token
    // 借助config给axios请求头配置token，headers就是请求头，Authorization是由接口文档提供的
    config.headers.Authorization = 'Bearer ' + token
  }
  // config是一个对象
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
// axios配置"数据转换器"
axios.defaults.transformResponse = [function (data) {
  // 服务器端返回给客户端的data数据主要就两种类型
  // 1) 实体字符串 需要转换，return JSONbig.parse(data)
  // 2) 空字符串   ''，直接return出去
  // 在此处要利用JSONbig对返回的信息加以处理，如果不处理，系统默认是通过JSON.parse()给处理的
  // 这样大数字就错误了
  // 原始数据就是data
  if (data) {
    return JSONbig.parse(data)// 只针对大整型数据进行处理，其他的不处理
  } else {
    return data
  }
}]
