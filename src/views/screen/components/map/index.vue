<template>
  <div class="map-container">
    <div class="top">
      <p class="title">平台高峰预警信息（2条）</p>
    </div>

    <div class="content">
      <div class="sub-title">
        <p>景区实时客流量</p>
      </div>
      <div class="charts" ref="mapRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
import chinaJson from './china.json'

const mapRef = ref<HTMLElement | undefined>(undefined)

// 注册地图
echarts.registerMap('china', chinaJson as any)

onMounted(() => {
  let myChart = echarts.init(mapRef.value)

  myChart.setOption({
    geo: {
      map: 'china',
      roam: true,
      left: 0,
      right: 0,
      top: 0,
      bottom: -120,
      label: {
        show: true, // 文字显示
        color: '#fff',
        fontSize: 14,
      },
      itemStyle: {
        color: {
          type: 'linear',
          // 上到下
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#00387c', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#0c1854', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        label: {
          show: true,
          color: '#fff',
        },
        shadowColor: 'rgba(128, 217, 248, 0.3)',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 15,
      },
      emphasis: {
        borderWidth: 0,
        label: {
          show: true,
          textStyle: {
            color: '#fff',
            fontSize: 20,
          },
        },
        itemStyle: {
          color: {
            type: 'linear',
            // 上到下
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#255493', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#0c1854', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines', // 航线
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
          },
        ],
        lineStyle: {
          color: '#fff',
          width: 1,
          opacity: 0.6,
          curveness: 0.2, // 弧线
        },
        effect: {
          show: true,
          color: '#ffffff',
          period: 6, // 箭头指向速度，值越小速度越快
          trailLength: 0.01, // 特效尾迹长度[0,1]值越大，尾迹越长重
          symbol:
            'path://M896 672l0-80L576 384 576 158.4c0-35.366-29.64-62.4-64-62.4-34.358 0-64 27.036-64 62.4L448 384 128 592l0 80 320-96 0 227.204-96 62.398L352 928l160-32 160 32 0-62.398-96-62.398L576 576 896 672z',
          symbolSize: 20, // 图标大小
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .top {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    background: url(../../images/dataScreen-header-warn-bg.png) center center
      no-repeat;
    background-size: 100% 100%;
    width: 500px;
    height: 36px;

    .title {
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 36px;
    }
  }

  .content {
    width: 100%;
    position: relative;
    margin-top: 10px;
    padding: 0 100px;
    box-sizing: border-box;

    .sub-title {
      color: #fff;
      position: absolute;
      left: 0;
      margin-left: 35px;
      background: url(../../images/map-title-bg.png) center center no-repeat;
      background-size: 100% 100%;
      width: 260px;
      height: 25px;

      p {
        padding-left: 30px;
        line-height: 25px;
        font-size: 14px;
      }
    }

    .charts {
      width: 100%;
      height: 630px;
    }
  }
}
</style>
