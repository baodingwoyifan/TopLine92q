<template>
  <div class="login-container">

<div class="login-box">

    <el-form ref="loginFromRef" :model="loginFrom" :rules='loginFromRoules'>
        <!-- 手机号 -->
    <img src="./logo_index.png" alt="">
  <el-form-item prop='mobile'>
    <el-input v-model="loginFrom.mobile" placeholder="请输入手机号码"></el-input>
  </el-form-item>
  <!-- 验证码 -->
   <el-form-item prop='code'>
    <el-input v-model="loginFrom.code" placeholder="请输入验证码"></el-input>
  </el-form-item>
<!-- 复选框 -->
<!-- 协议自定义 -->
<el-form-item style="text-align:left" prop='xeiyi'>
  <el-checkbox v-model="loginFrom.xeiyi" style="margin-right: 10px" ></el-checkbox>
<span>我以阅读并同意<a href="https://game.qq.com/contract.shtml">隐私条款</a></span>
</el-form-item>
<!-- 登录按钮-->
 <el-form-item>
<el-button type='primary' style="width:100%" @click='login()'>登陆</el-button>
 </el-form-item>
    </el-form>
</div>

  </div>
</template>

<script>
import './gt.js'
export default {
  data () {
    // 局部函数，实现校验 协议自定义
    var xeiyiTest = function (rule, value, callback) {
      //   rule:校验规则
      // value：被校验的数据
      // vallback：回调函数
    //   if (value) {
    //     callback()
    //   } else {
    //     callback()
    //   }
      value ? callback() : callback(new Error('请遵守协议'))
    }
    return {
      loginFrom: {
        mobile: '',
        code: '',
        xieyi: false

      },
      // 手机号码及验证码校验
      loginFromRoules: {
        mobile: [
          //  手机号码验证必填
          { required: true, message: '手机号码必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [
          // 验证码验证必填
          { required: true, message: '验证码必填' }
        ],
        xeiyi: [
          { validator: xeiyiTest }
        ]
      }
    }
  },
  methods: {
    //   登陆方法
    login () {
      // 表单校验
      // validate 饿了么提供的表单校验方法
      // 获得组件对象 el-from( this.$refs.loginFromRef这就是组件对象，固定写法)
      // this.$refs.loginFromRef.validate(回调函数)
      this.$refs.loginFromRef.validate(valid => {
        if (!valid) { return false }
        let pro = this.$http({
          url: '/mp/v1_0/captchas/' + this.loginFrom.mobile,
          method: 'GET'
        })
        pro
          .then(result => {
            // 从result中结构赋值下面的data
            let { data } = result.data
            window.initGeetest({
            // 以下配置参数来自服务端 SDK
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind'
              // 设置窗口样式
            }, captchaObj => {
            // 这里可以调用验证实例 captchaObj 的实例方法
              captchaObj.onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify()// 显示验证码
              }).onSuccess(() => {
                // 校验正确的处理
                this.loginAct()
              }).onError(() => {
                // your code
              })
            })
          })
          .catch(err => {
            return this.$message.error('获取失败' + err)
          })

        // this.$router.push({ name: 'home' })
      })
    //   this.$router.push({ name: 'home' })// 编程式导航
    },
    loginAct () {
      // 使用axios发送请求,验证用户账号密码真实性
      let pro = this.$http({
        url: '/mp/v1_0/authorizations',
        method: 'POST',
        data: this.loginFrom
      })
      pro
        .then(result => {
          //   账号校验成功，跳转后台页面
          // 客户端把服务端返回的密钥信息存储
          window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
          // ----------------------------->
          this.$router.push({ name: 'home' })
        })
      // eslint-disable-next-line handle-callback-err
        .catch(err => {
          //   失败提示 饿了么组件库提供
          this.$message.error('登陆失败')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
    background-color: gray;
    height: 100%;
    display: flex;
    justify-content:center;
    align-items: center;
    background-image: url('./login.jpg');
    background-size: cover;
     text-align: center;
    .login-box{
        width: 410px;
        height:345px ;
        background-color: #fff;
        display: flex;
        justify-content:center;
        align-items: center;
        img{
              width: 50%;
              margin: 20px  auto;
            }
        .el-from{
            width: 75%;

        }
    }
}
</style>
