<template>
  <div class="age-container">
    <div class="top">
      <p class="title">年龄比例</p>
      <p class="bg"></p>
    </div>
    <div class="content">
      <div class="charts" ref="chartsRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

// echarts 组件实例
const chartsRef = ref<HTMLElement | undefined>(undefined)

onMounted(() => {
  let myChart = echarts.init(chartsRef.value)

  myChart.setOption({
    title: {
      show: true,
      text: '本日总数',
      textStyle: {
        color: '#ffffff',
        fontSize: 14,
      },
      x: '20%',
      y: 'center',
    },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '0',
      left: '65%',
      orient: 'vertical',
      textStyle: {
        color: '#fff',
        fontSize: 16,
      },
      itemGap: 15,
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '95%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: '#ffffff',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '10岁以下' },
          { value: 735, name: '10 - 18岁' },
          { value: 580, name: '18 - 30岁' },
          { value: 484, name: '30 - 40岁' },
          { value: 300, name: '40 - 60岁' },
          { value: 300, name: '60岁以上' },
        ],
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.age-container {
  background: url(../../images/dataScreen-main-lb.png) no-repeat center center;
  background-size: 100% 100%;
  margin-top: 20px;
  margin-bottom: 10px;

  .top {
    .title {
      color: #ffffff;
      font-size: 22px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 15px;
    }

    .right {
      float: right;
      margin-right: 15px;
      color: #ffffff;

      span {
        color: #ff8100;
      }
    }
  }

  .content {
    padding: 30px 20px 20px 20px;

    .charts {
      width: 100%;
      height: 210px;
    }
  }
}
</style>
