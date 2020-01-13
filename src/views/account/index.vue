
<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item cardbody">
      <div id="lt">
        <!-- 设置表单验证 -->
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          :rules="accountFormRules"
          label-width="100px"
        >
          <el-form-item label="用户名：" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="mobile">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：" prop="intro">
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="rt">
        <!--
          class="avatar-uploader" // 自定义组件样式
          action="https://jsonplaceholder.typicode.com/posts/" // 上传附件服务器端地址
          :show-file-list="false" // 图片是否以列表展示
          :on-success="handleAvatarSuccess" // 图片上传成功后的回调处理
          :before-upload="beforeAvatarUpload" // 图片上传前的回调处理
          :http-request="httpRequest" // 自定义上传行为，默认发生post请求，:http-request可以自定义上传发生请求，此时action和on-success无效了，action是必须项目，留空即可
        -->
        <el-upload action='' :show-file-list="false" :http-request="httpRequest">
          <!--判断是否有图像并展示，否则展示+号-->
          <!--accountForm.photo展示当前账户头像信息 -->
          <img
            v-if="accountForm.photo"
            :src="accountForm.photo"
            class="avatar"
            width="400"
            height="400"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
// 导入公共bus的vue对象
import bus from '@/utils/bus.js'
export default {
  name: 'Account',
  created () {
    this.getAccountForm()
    this.editAccount()
  },
  data () {
    return {
      accountForm: {
        // 各个成员来自api参考【2.4 编辑用户资料】
        id: '', // id
        name: '', // 名称
        mobile: '', // 手机号码
        email: '', // 邮箱
        intro: '' // 简介
      },
      accountFormRules: {
        //   表单校验
        name: [
          { required: 'true', message: '名字必填' },
          { min: 1, max: 7, message: '用户名长度介于1-7之间' }
        ],
        email: [
          { required: 'true', message: '邮箱必填' },
          { type: 'email', massage: '邮箱格式不正确' }
        ]
      }
    }
  },
  methods: {
    //   获得账户基本信息
    getAccountForm () {
      let pro = this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'get'
      })
      pro
        .then(result => {
          this.accountForm = result.data.data
        })
        .catch(err => {
          return this.$message.error('获取个人信息失败' + err)
        })
    },
    // 更新账户，收集并存储数据到服务器端
    editAccount () {
      // 表单校验
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          // axios行动了
          // get/post/put/delete
          // put: 修改，修改全部表单
          // patch：修改，修改部分项目
          let pro = this.$http({
            url: '/mp/v1_0/user/profile',
            method: 'patch',
            data: this.accountForm
          })
          pro
            .then(result => {
              console.log(result)

              if (result.data.message === 'OK') {
                // 提示成功
                this.$message.success('修改账号信息成功')
                this.getAccountForm()
                // 兄弟组件传值修改账户名称
                bus.$emit('upAccountName', this.accountForm.name)
                // eslint-disable-next-line indent
              }
            })
            .catch(err => {
              return this.$message.error('修改失败：' + err)
            })
        }
      })
    },
    // 自定义上传头像行为
    // resource参数：被上传的头像文件资源信息(resource.file)
    // file代表被上传的图片内容
    httpRequest (resource) {
      // 1. FormData表单数据对象收集表单信息，即上传附件信息
      let fd = new FormData()
      // 把图片的信息添加给fd对象
      // fd.append(名称(看接口文当)，值（图片的信息）)
      fd.append('photo', resource.file) // 文件已经被fd保存好了

      // 2. axios带着附件(fd)到达服务器端存储
      let pro = this.$http.patch('/mp/v1_0/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把服务器端返回的新的头像获得到，并更新给accountForm.photo成员里边
            // result.data.data.photo:头像完整请求地址信息
            // this.accountForm.photo = result.data.data.photo,把上传好的图片信息
            // 在页面中更新显示出来
            this.accountForm.photo = result.data.data.photo
            this.$message.success('头像更新成功！')
            // 兄弟组件传值修改账户图片
            bus.$emit('upAccountPhoto', this.accountForm.photo)
          }
        })
        .catch(err => {
          return this.$message.error('头像更新失败：' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
// 给表单 和 头像区域做布局样式设计
.cardbody {
  display: flex;
  justify-content: space-between;
  #lt {
    width: 40%;
  }
  #rt {
    width: 30%;
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 400px;
      height: 400px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>
