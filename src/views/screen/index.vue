<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screenRef">
      <div class="top">顶部</div>
      <div class="bottom">
        <div class="left">左侧</div>
        <div class="center">中间</div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'Screen',
})

let screenRef = ref<any>(null)

const getScale = (w = 1920, h = 1080): number => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h

  return ww < wh ? ww : wh
}

const resizeScreen = () => {
  screenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}

onMounted(() => {
  resizeScreen()
  window.onresize = resizeScreen
})

onUnmounted(() => {
  window.onresize = null
})

onMounted
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url('./images/bg.png') no-repeat center center;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    top: 50%;
    left: 50%;
    transform-origin: left top;
    background-color: red;

    .top {
      width: 100%;
    }

    .bottom {
      display: flex;

      .left {
        flex: 1;
      }

      .center {
        flex: 2;
      }

      .right {
        flex: 1;
      }
    }
  }
}
</style>
