<template>
  <div class="not-found-container">
    <div class="content">
      <h1>很抱歉</h1>
      <p>你输入的地址错误或页面找不到了</p>
      <router-link to="/" class="link">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'NotFound',
})
</script>

<style scoped lang="scss">
.not-found-container {
  width: 100vw;
  height: 100vh;
  // 隐藏滚动条
  overflow: hidden;
  background: url(@/assets/images/error_images/404.png) no-repeat center center;
  background-size: contain;
  position: relative;

  .content {
    position: absolute;
    top: 30%;
    left: 65%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      color: #279cf9;
      font-size: 40px;
      font-weight: 700;
    }

    p {
      color: #279cf9;
      font-size: 20px;
      margin-top: 20px;
    }

    .link {
      padding: 10px 20px;
      text-decoration: none;
      color: #279cf9;
      border: 1px solid #279cf9;
      border-radius: 5px;
      margin-top: 20px;
    }
  }
}
</style>
