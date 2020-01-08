import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由创建
const routes = [
  // {path:"/login",component()=>import()}箭头函数形式
  // import()import的函数调用方式，是一种按需导入，节省资源
  // （"@/views/login"）中@代表目录中的绝对路径
  // index.vue是默认索引文件不用设置，自动会寻找，代码更节省
  // name属性的作用，编程式导航
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    // 设置重定向
    redirect: '/welcome',
    children: [
      // 配置子路由
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') }
    ] }

]

const router = new VueRouter({
  routes
})
// 配置全局前置路由首位
router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 登陆状态
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})
export default router
