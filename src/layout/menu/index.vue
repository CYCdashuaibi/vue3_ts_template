<template>
  <!-- <div>{{ menuList }}</div> -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 只处理 Layout 页面的子路由（一级路由） -->
    <el-menu-item
      v-if="levelOneRoute(item)"
      :index="item.children[0].path"
      @click="goRoute"
    >
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 有二级路由 -->
    <el-sub-menu v-if="levelTwoRoute(item)" :index="item.path">
      <template #title>
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <MyMenu :menuList="item.children" />
    </el-sub-menu>
    <!-- 没有子路由 -->
    <el-menu-item
      v-if="levelOtherRoute(item)"
      :index="item.path"
      @click="goRoute"
    >
      <el-icon><component :is="item.meta.icon"></component></el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
defineOptions({
  name: 'MyMenu',
})

// 显式指定 "item" 的类型
type MenuItem = {
  path: string
  children: any[]
  name: string
  meta: {
    show: boolean
    icon: string
    title: string
  }
}

defineProps({
  menuList: {
    type: Array<any>,
    default: () => [],
  },
})

const $router = useRouter()

// Layout 子路由，即只有一个一级路由
const levelOneRoute = (item: MenuItem): boolean => {
  return item.children && item.children.length === 1 && item.name === 'Layout'
}

// 有二级路由
const levelTwoRoute = (item: MenuItem): boolean => {
  if (item.children) {
    const showChildren = item.children.filter((child: MenuItem) => {
      return child.meta.show
    })
    return showChildren.length > 0 && item.meta.show && item.name !== 'Layout'
  }
  return false
}

// 没有二级路由，且不是 Layout 页面
const levelOtherRoute = (item: MenuItem): boolean => {
  return !item.children && item.name !== 'Layout' && item.meta.show
}

// 路由点击处理函数
const goRoute = (route: any) => {
  $router.push(route.index)
}
</script>
<style scoped></style>
