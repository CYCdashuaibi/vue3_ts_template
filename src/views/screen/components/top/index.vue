<template>
  <div class="top-container">
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

// 路由器对象
const $router = useRouter()

let time = ref<string>(moment().format('YYYY年MM月DD日 HH:mm:ss'))
let timer = ref<any>(null)

const goHome = () => {
  $router.push('/home')
}

onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 HH:mm:ss')
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped lang="scss">
.top-container {
  width: 100%;
  height: 40px;
  display: flex;

  .left {
    flex: 1;
    background: url('../../images/dataScreen-header-left-bg.png');
    background-size: 100% 100%;

    .lbtn {
      float: right;
      min-width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-l.png');
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }
  }

  .center {
    flex: 1;

    .title {
      height: 74px;
      width: 100%;
      text-align: center;
      line-height: 74px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat
        center center;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 30px;
    }
  }

  .right {
    flex: 1;
    background: url('../../images/dataScreen-header-left-bg.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      min-width: 150px;
      height: 40px;
      background: url('../../images/dataScreen-header-btn-bg-r.png');
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }

    .time {
      color: #29fcff;
      width: 100%;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
