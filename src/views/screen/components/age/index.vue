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

  myChart.setOption({})
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
}
</style>
