<template>
  <div class="sex-container">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="content">
      <div class="sex">
        <div class="man sex-item">
          <p>男士</p>
          <img src="../../images/man.png" />
        </div>
        <div class="woman sex-item">
          <p>女士</p>
          <img src="../../images/woman.png" />
        </div>
      </div>
      <div class="rate">
        <p>男士 {{ manRate }}%</p>
        <p>女士 {{ 100 - manRate }}%</p>
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

const manRate = ref<number>(60)

onMounted(() => {
  let myChart = echarts.init(chartsRef.value)

  myChart.setOption({
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    xAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: 100,
    },
    yAxis: {
      type: 'category',
      show: false,
    },
    series: [
      {
        type: 'bar',
        data: [60],
        barWidth: 30,
        z: 9,
        itemStyle: {
          color: '#0473fb',
          borderRadius: 15,
        },
      },
      {
        type: 'bar',
        data: [100],
        barGap: '-100%',
        barWidth: 30,
        itemStyle: {
          color: '#ff6077',
          borderRadius: 15,
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.sex-container {
  background: url(../../images/dataScreen-main-lb.png) no-repeat center center;
  background-size: 100% 100%;
  margin-top: 20px;

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
    padding: 45px 60px 20px 60px;

    .sex {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .sex-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 111px;
        height: 116px;
        background-size: 100% 100%;

        p {
          color: #ffffff;
          font-size: 16px;
          margin-top: 2px;
        }

        img {
          margin-top: 20px;
        }
      }

      .man {
        background: url(../../images/man-bg.png) no-repeat center center;
      }

      .woman {
        background: url(../../images/woman-bg.png) no-repeat center center;
      }
    }

    .rate {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;

      p {
        color: #ffffff;
        font-size: 14px;
      }
    }

    .charts {
      width: 100%;
      height: 30px;
      margin-top: 8px;
    }
  }
}
</style>
