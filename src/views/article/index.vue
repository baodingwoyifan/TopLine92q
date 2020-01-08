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
            <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 时间区域 -->
            <!--value-format="yyyy-MM-dd" 设置时间格式 -->
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
  </div>
</template>

<script>
export default {
  name: 'Article',
  // 监听器设置
  watch: {
    // newV数据变化后的样子
    // oldV数据变化前的样子
    timetotime: function (newV, oldV) {
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  created () {
    this.getChannelList()
  },
  data () {
    return {
      channelList: [],
      // 搜索表单数据对象
      searchForm: {
        // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        status: '',
        // 频道id
        channel_id: '',
        // 开始时间
        begin_pubdate: '',
        // 结束时间
        end_pubdate: ''
      },
      timetotime: '' // 临时接收时间范围信息
    }
  },
  methods: {
    // 获取频道列表方法
    getChannelList () {
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        methdo: 'GET'
      })
      pro
        .then(result => {
          console.log(result)
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得文章频道错误：' + err)
        })
    }
  }
}
</script>
