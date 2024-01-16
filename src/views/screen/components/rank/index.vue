<template>
  <div class="rank-container">
    <div class="top">
      <p class="title">热门景区排行</p>
      <p class="bg"></p>
    </div>
    <div class="content">
      <div class="columns-header">
        <div class="column-item">排名</div>
        <div class="column-item">景区</div>
        <div class="column-item">预约数量</div>
      </div>
      <div class="columns-content">
        <div class="column-item ranks">
          <div class="rank">NO.1</div>
          <div class="rank">NO.2</div>
          <div class="rank">NO.3</div>
          <div class="rank">NO.4</div>
          <div class="rank">NO.5</div>
        </div>
        <div class="column-item">峨眉山</div>
        <div class="column-item">
          <div class="charts" ref="chartsRef"></div>
        </div>
      </div>
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
    xAxis: {
      type: 'value',
      show: false,
    },
    yAxis: {
      type: 'category',
      show: false,
      data: ['峨眉山', '历程亚丁', '', 'NO.4', 'NO.5'],
    },
  })
})
</script>

<style scoped lang="scss">
.rank-container {
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
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 40px 15px 15px 15px;
    box-sizing: border-box;

    .columns-header {
      display: flex;

      .column-item {
        text-align: center;
        color: #d6a048;
        font-size: 18px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        background: url(../../images/rankingChart-bg.png) no-repeat center
          center;
        background-size: 100% 100%;

        &:nth-child(1) {
          flex: 1;
        }

        &:nth-child(2) {
          flex: 1;
        }

        &:nth-child(3) {
          flex: 3;
        }
      }
    }

    .columns-content {
      display: flex;
      height: 232px;

      .column-item {
        text-align: center;
        color: #d6a048;
        font-size: 18px;
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;

        &:nth-child(1) {
          flex: 1;
        }

        &:nth-child(2) {
          flex: 1;
        }

        &:nth-child(3) {
          flex: 3;
        }

        .charts {
          width: 100%;
          height: 212px;
        }

        .rank {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
