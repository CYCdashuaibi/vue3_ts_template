<template>
  <div class="tourist-container">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>111</span>
        人
      </p>
    </div>
    <div class="content">
      <div class="number">
        <span v-for="(item, index) in people.toString()" :key="index">
          {{ item }}
        </span>
        <span>人</span>
      </div>
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

let people = ref<number>(216908)

onMounted(() => {
  let myChart = echarts.init(chartsRef.value)

  myChart.setOption({
    series: [
      {
        type: 'liquidFill',
        data: [
          0.6,
          {
            value: 0.6,
            direction: 'left', // 波浪方向
          },
          {
            value: 0.6,
            direction: 'right', // 波浪方向
          },
        ], // 这里的数据代表水位高度
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              // 渐变
              {
                offset: 0,
                color: '#28a39d', // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: '#1db2bc', // 50% 处的颜色
              },
              {
                offset: 1,
                color: '#1597b6', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        ],
        radius: '90%',
        animationEasing: 'linear', // 动画缓动效果
        waveAnimation: true, // 开启波浪动画
        animationDuration: 2000, // 动画持续时间
        label: {
          formatter: '预约量',
          fontSize: 16,
          position: ['50%', '30%'],
          color: '#ffffff',
        },
        outline: {
          show: true,
          borderDistance: 8,
          itemStyle: {
            color: 'none',
            borderColor: '#294D99',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)',
          },
        },
        backgroundStyle: {
          color: 'rgba(0, 0, 0, 0)',
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.tourist-container {
  background: url(../../images/dataScreen-main-lb.png) no-repeat center center;
  background-size: 100% 100%;
  margin-top: 10px;

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
    margin-top: 30px;
    padding: 10px;
  }

  .number {
    display: flex;

    span {
      flex: 1;
      height: 55px;
      text-align: center;
      line-height: 55px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 28px;
      font-weight: bold;
    }
  }

  .charts {
    width: 100%;
    height: 220px;
  }
}
</style>
