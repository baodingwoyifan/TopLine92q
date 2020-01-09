
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
        <el-form ref="accountFormRef" :model="accountForm" :rules='accountFormRules' label-width="100px">
          <el-form-item label="用户名：" prop='name'>
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop='mobile'>
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop='email'>
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介：" prop='intro'>
            <el-input type="textarea" v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item label="简介：">
            <el-button type="primary" @click="editAccount()">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div id="rt">头像展示区域</div>
    </div>
  </el-card>
</template>

<script>
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
            params: this.accountForm
          })
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                // 提示成功
                this.$message.success('修改账号信息成功')
                // eslint-disable-next-line indent
}
            })
            .catch(err => {
              return this.$message.error('修改失败：' + err)
            })
        }
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
    background-color: pink;
  }
  #rt {
    width: 30%;
    background-color: lightgreen;
  }
}
</style>
