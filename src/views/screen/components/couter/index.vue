<template>
  <div class="couter-container">
    <div class="top">
      <p class="title">预约渠道数据统计</p>
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

  myChart.setOption({})
})
</script>

<style lang="scss" scoped>
.couter-container {
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
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 30px 15px 15px 15px;
    box-sizing: border-box;

    .charts {
      width: 100%;
      height: 217px;
    }
  }
}
</style>
