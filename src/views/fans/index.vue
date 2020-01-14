<template>
  <!--卡片区-->
  <el-card class="box-card">
    <!--命名插槽，头部内容设置-->
    <div slot="header" class="clearfix">
      <span>粉丝统计</span>
    </div>
    <!--匿名插槽，卡片主体内容-->
    <div class="text item">
      <div id="main" style="width:600px;height:400px"></div>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import echarts from 'echarts'

export default {
  name: 'Fans',
  // 此时页面容器已经挂载好和渲染完成了
  mounted () {
    this.paintPic()
  },
  data () {
    return {
      myChart: null// 接收echarts图表对象
    }
  },
  methods: {
    // 绘制图表
    paintPic () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      this.myChart.setOption({
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],

            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      // 绘制图表
      this.myChart.setOption(Option)
      // 二次获取数据对图表进行修饰
      this.getFansStat()
    },
    // 获得对象的成员名称的集合的方法
    getkeys (obj) {
      var keys1 = []
      for (var p1 in obj) {
        if (obj.hasOwnProperty(p1)) {
          keys1.push(p1)
        }
      }
      return keys1
    },
    // 动态获取真实数据
    getFansStat () {
      let pro = this.$http({
        url: '/mp/v1_0/statistics/followers',
        method: 'get'
      })
      pro
        .then(result => {
          console.log(result)
          // 把粉丝数据封装成option的样子
          // 把legend的data通过result组织
          let ages = result.data.data.age
          let keys = this.getkeys(result.data.data.age)
          let dataObj = []
          for (var k in ages) {
            // 把成员的key和value获得出来填充到dataObj中
            dataObj.push({ value: ages[k], name: k })
          }
          // 把series的data通过result组织
          // age是一个对象里面有我们需要的数据
          let opt = {
            legend: {
              data: keys// keys就是组织后的数据
            },
            series: [
              {
                data: dataObj
              }
            ]
          }
          // echarts对象调用setOption方法，把获取到的数据传进去
          this.myChart.setOption(opt)
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
