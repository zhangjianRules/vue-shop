<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main"
           style="width: 750px;height:400px;"></div>

    </el-card>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      // 指定图表的配置项和数据, 需要合并的数据
      option: {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }

    }
  },
  created () {
  },
  // 执行到该函数 说明dom元素已经渲染完毕
  async mounted () {
    var myChart = echarts.init(document.getElementById('main'))
    const response = await this.$http.get('/v1/reports/type/1')
    if (response.data.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败')
    }
    const result = _.merge(response.data.data, this.option)
    myChart.setOption(result)
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
</style>
