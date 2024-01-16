<template>
  <div class="line-container">
    <div class="top">
      <p class="title">未来30天游客量趋势图</p>
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

// echarts 组件实例
const chartsRef = ref<HTMLElement | undefined>(undefined)

onMounted(() => {
  let myChart = echarts.init(chartsRef.value)
  myChart.setOption({
    grid: {
      left: 50,
      right: 0,
      top: 50,
      bottom: 20,
    },
    title: {
      show: true,
      text: '(访问量)',
      textStyle: {
        color: '#ffffff',
        fontSize: 16,
      },
    },
    xAxis: {
      type: 'category',
      data: [
        '05/04',
        '05/05',
        '05/06',
        '05/07',
        '05/08',
        '05/09',
        '05/10',
        '05/11',
        '05/12',
        '05/13',
        '05/14',
        '05/15',
        '05/16',
        '05/17',
        '05/18',
        '05/19',
        '05/20',
        '05/21',
        '05/22',
        '05/23',
      ],
      boundaryGap: false,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
    },
    series: [
      {
        data: [
          120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210,
          120, 132, 101, 134, 90, 230,
        ],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#726337', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#ffffff00', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.line-container {
  margin: 20px 35px 10px 35px;
  width: calc(100% - 70px);
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat center;
  background-size: 100% 100%;

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
  }

  .content {
    padding: 35px 20px 15px 20px;
    margin-right: 20px;
    .charts {
      width: 100%;
      height: 210px;
    }
  }
}
</style>
