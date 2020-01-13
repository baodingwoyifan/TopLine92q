/* eslint-disable no-undef */
// /* eslint-disable no-tabs */
// /* eslint-disable no-tabs */
// /* eslint-disable vue/no-unused-vars */
<template>
  <div>
    <!--搜索卡片区未完结------------------------->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!--匿名插槽，内容主体-->
      <div class="text item">
        <!--el-form搜索表单区域-->
        <!-- 不需要表单校验 -->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <!-- 单选按钮组件 -->
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
          </el-form-item>
          <!-- 频道列表 -->
          <!-- clearable表示选中后可以进行删除操作 -->
          <el-form-item label="频道列表：">
            <!-- 应用子组件 -->
              <channel></channel>
          </el-form-item>
          <!-- 时间区域 -->
          <!--value-format="yyyy-MM-dd" 设置时间格式 -->
          <!-- v-model="timetotime"双向绑定接收时间信息 -->
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- -----------头部--------------样式----------------- -->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条内容</span>
      </div>
      <el-table :data="articleList" style="width: 100%">
        <!-- 普通列 -->
        <el-table-column prop="cover.images[0]" label="图标" width="180">
          <!-- row 是一个记录每个文章信息的一个对象 作用域插槽的使用-->
          <img slot-scope="stData" :src="stData.row.cover.images[0]" alt width="150" height="100" />
        </el-table-column>

        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="180">
          <!-- 获得当前文章对像的status的状态数据，进行判断进而显示对应的内容效果 -->
          <!-- 作用域插槽要被使用，与获取图标原理一致 -->
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status=='0'">草稿</el-tag>
            <el-tag v-else-if="stData.row.status=='1'" type="success">待审核</el-tag>
            <el-tag v-else-if="stData.row.status=='2'" type="info">审核通过</el-tag>
            <el-tag v-else-if="stData.row.status=='3'" type="warning">审核失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="stData">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="$router.push('/articleedit/'+ stData.row.id)"
            >修改</el-button>
            <!-- 删除未完 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete-solid"
              @click="del(stData.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
    <!-- // 通过el-table表格组件绘制数据表格 -->
  </div>
</template>

<script>
import Channel from '@/components/channel'
export default {
  name: 'Article',
  // 注册组件
  components: {
    Channel
  },
  // 监听器设置
  watch: {
    // newV数据变化后的样子
    // oldV数据变化前的样子
    // 被检测的一般是data成员，下面data中有的在监听器中都可以监听到
    timetotime: function (newV, oldV) {
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    },
    // 深度监听
    searchForm: {
      handler: function (newV, oldV) {
        // 根据变化后的筛选条件，重新获取文章列表
        this.getArticleList()
      },
      deep: true
    }
  },
  created () {
    this.getArticleList()
  },
  data () {
    return {
      // 存储文章列表
      articleList: [],
      // 存储文章总数
      tot: '',
      // 搜索表单数据对象
      searchForm: {
        // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        status: '',
        // 频道id
        channel_id: '',
        // 开始时间
        begin_pubdate: '',
        // 结束时间
        end_pubdate: '',
        // 页码
        page: 1,
        // 每页条数
        per_page: 10
      },
      timetotime: '' // 临时接收时间范围信息
    }
  },
  methods: {
    // 删除方法需要设置数据转换，在ax.js中配置
    // 服务端返回的真实的id信息的长度超过了js中的最大的整型范围，在使用的时候会发生变形
    // 而我们拿着变形后的“id ”去后端删除数据的话，后端没有我们传递的id，就会返回删除失败
    // 处理方式：
    // jsongigint 方法来进行大数字处理
    del (id) {
      this.$confirm('确认要删除该数据么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let pro = this.$http({
            url: '/mp/v1_0/articles/' + id,
            method: 'delete'
          })
          pro
            .then(result => {
              this.$message.success('文章删除成功!')
              this.getArticleList()
            })
            .catch(err => {
              return this.$message.error('删除文章错误：' + err)
            })
        })
        .catch(() => {})
    },
    // 获取文章列表方法
    getArticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i] || this.searchForm === 0) {
          // 不能用tuis
          searchData[i] = this.searchForm[i]
        }
      }

      let pro = this.$http({
        url: '/mp/v1_0/articles',
        method: 'get',
        params: searchData
      })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 把文章赋予给articleList成员
            this.articleList = result.data.data.results
            // 接收总条数
            this.tot = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('获得文章列表错误:' + err)
        })
    },
    // 页面变化时的处理
    // val随意设置，代表的是变化后的页码
    handleCurrentChange (val) {
      // 更新页码
      this.searchForm.page = val
      // 根据变化后的页码更新页面的数据
      // this.getArticleList()
    },
    // 每页条数发生变化时的处理
    // val随意设置，代表的是变化后的每页条数
    handleSizeChange (val) {
      this.searchForm.per_page = val
      // this.getArticleList()
    }
  }
}
</script>
<style lang="less" scope>
.box-card {
  margin-bottom: 20px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 25px;
}
</style>
