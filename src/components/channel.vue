// 子组件用来存放公共的组件
<template>
<!-- 频道下拉列表的独立组件 -->
 <el-select v-model="nowid" placeholder="请选择" clearable  >
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"

              ></el-option>
            </el-select>
</template>
<script>
export default {
  props: {

    chid: {
      default: ''
    }
  },
  watch: {
    nowid (newV) {
      this.$emit('slt', newV)
    },
    chid (newV) {
      this.nowid = newV
    }
  },
  created () {
    //   调用获取真实列表信息方法
    this.getChannelList()
  },
  data () {
    return {
      channelList: [], // 频道列表
      nowid: '' // 频道列表双向绑定的id
    }
  },
  methods: {
    // 获取频道列表方法
    getChannelList () {
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        method: 'get'
      })
      pro
        .then(result => {
          // data接收频道数据
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败：' + err)
        })
    },
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
