<template>
  <el-button size="small" icon="Refresh" circle @click="refresh"></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <!-- 用户头像 -->
  <img
    :src="(userStore.userInfo?.avatar as string) || '@/../public/logo.png'"
    style="
      width: 25px;
      height: 25px;
      object-fix: cover;
      margin: 0 10px;
      border-radius: 50%;
    "
  />
  <!-- 退出登录下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.userInfo?.name as string }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '../../../store/modules/setting'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'

defineOptions({
  name: 'Setting',
})

// 用户仓库
const userStore = useUserStore()

// 布局设置仓库
const layoutSettingStore = useLayoutSettingStore()

// 路由
const $router = useRouter()
const $route = useRoute()

// 刷新
const refresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

// 全屏
const fullScreen = () => {
  // document.fullscreenElement 可以判断当前是否为全屏状态
  let full = document.fullscreenElement
  if (full) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

// 退出登录
const logout = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<style scoped></style>
