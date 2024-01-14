<template>
  <el-button size="small" icon="Refresh" circle @click="refresh"></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <!-- 设置按钮 -->
  <el-popover
    :visible="popoverVisible"
    placement="bottom"
    title="主题设置"
    :width="300"
  >
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          size="small"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          @change="changeColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          size="small"
          active-icon="Moon"
          inactive-icon="Sunny"
          inline-prompt
          style="--el-switch-on-color: #141414"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button
        size="small"
        icon="Setting"
        @click="popoverVisible = !popoverVisible"
        circle
      ></el-button>
    </template>
  </el-popover>
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
import { onMounted, ref } from 'vue'

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

const popoverVisible = ref(false)

// 是否开启暗黑模式
const dark = ref<boolean>(layoutSettingStore.dark)

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

// 模式切换
const changeDark = () => {
  localStorage.setItem('dark', dark.value ? '1' : '0')
  layoutSettingStore.updateDark(dark.value)
  let html: HTMLElement = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}

const changeColor = (color: string) => {
  const el = document.documentElement

  // 获取 css 变量
  getComputedStyle(el).getPropertyValue(`--el-color-primary`)
  // 设置 css 变量
  el.style.setProperty('--el-color-primary', color)
}

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

onMounted(() => {
  changeDark()
})
</script>

<style scoped></style>
