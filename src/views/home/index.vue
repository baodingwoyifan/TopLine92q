<template>
  <el-container>
    <!-- 左侧导航 -->
    <el-aside :width="isCollapse?'65px':'200px'">
      <!-- router开启路由导航功能模式 -->
      <el-menu router
      background-color="#323745"
       text-color="#fff"
        active-text-color="#ffd04b"
        :collapse='isCollapse'
         :collapse-transition='false'>
        <el-menu-item index="/welcome" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <!-- el-submenu拥有子集菜单 -->
        <!-- :style="{width:isCollapse?'65px':'200px'}"宽度自适应改变 -->
        <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="2-1">发布文章</el-menu-item>
          <!-- index 描点信息 -->
          <!-- index="2-3"区分子集菜单 -->
          <el-menu-item index="/article">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <!-- 命名插槽 -->
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <!-- el-menu-item顶级菜单，index属性用于区分彼此的 -->
        <el-menu-item index="4" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">账户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 顶部导航 -->
      <el-header>
        <!-- 左侧导航 -->
        <div id="lt">
          <!-- 折叠展开，图标发生改变 -->
          <i :class="isCollapse? 'el-icon-s-fold':'el-icon-s-unfold'"  @click="isCollapse=!isCollapse"></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <!-- 右侧导航 -->
        <div id="rt">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width:200px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span style="margin:0 10px">信息</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <!-- 通过属性绑定，获得计算属性获得的name和photo -->
              <img :src="photo" alt width="40" height="40" />
             {{name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <!-- 下拉菜单组件 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>github地址</el-dropdown-item>
              <!-- 组件是由许许多多的html标签组成的,给组件添加事件,它不知道具体是给那个html标签
              添加的,他就不会执行事件,使用native可以准确的使得事件作用到内部的html标签中去
              native事件修饰符 使得事件作用到内部的html标签中去 -->
              <el-dropdown-item @click.native='lougout ()'>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 设置子组件的占位符 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false// 折叠true展开false
    }
  },
  methods: {
    // 退出系统
    lougout () {
      // 弹框提示是否退出
      this.$confirm('确定要退出吗', { confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' }).then(() => {
        // 退出成功清除本地存储的信息并跳转到登陆页面
        window.sessionStorage.clear()
        this.$router.push('./login')
      }).catch(() => {
        // 退出失败
        alert('退出失败🙄')
      })
    }
  },
  // 计算属性 合成name和photo
  computed: {
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  }
}

</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-header {
    background-color: white;
    display: flex;
    justify-content: space-between;
    padding: 0 10px 0 9px;
    min-width: 950px;
    #lt {
      height: 100%;
      width: 40%;
      background-color: white;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    #rt {
      height: 100%;
      width: 50%;
      background-color: white;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-dropdown-link {
        display: flex;
        align-items: center;
        font-size: 16px;
        img{
border-radius: 50px
        }
      }
    }
  }
  .el-main {
    background-color: #f2f3f5;
  }
}
</style>
