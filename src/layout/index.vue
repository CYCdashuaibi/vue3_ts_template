<template>
  <div class="layout-container">
    <div class="layout-header" :class="{ fold: layoutSettingStore.fold }">
      <Tabbar />
    </div>
    <div class="layout-aside" :class="{ fold: layoutSettingStore.fold }">
      <Logo />
      <!-- 菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#001529"
          text-color="#ffffff"
          :default-active="$route.path"
          :collapse="layoutSettingStore.fold"
        >
          <!-- 动态生成路由 -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout-main" :class="{ fold: layoutSettingStore.fold }">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import useUserStore from '@/store/modules/user'
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'

defineOptions({
  name: 'Layout',
})

// 用户仓库
const userStore = useUserStore()

// 布局设置仓库
const layoutSettingStore = useLayoutSettingStore()

// 路由实例
const $route = useRoute()
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;

  .layout-aside {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-bg;
    transition: all 0.3s;

    &.fold {
      width: $base-menu-fold-width;
    }

    .scrollbar {
      width: 100%;
      height: calc(100vh - #{$base-header-height});

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout-header {
    width: calc(100% - #{$base-menu-width});
    height: $base-header-height;
    background: $base-header-bg;
    position: fixed;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100% - #{$base-menu-fold-width});
      left: $base-menu-fold-width;
    }
  }

  .layout-main {
    position: absolute;
    width: calc(100% - #{$base-menu-width});
    height: calc(100vh - #{$base-header-height});
    left: $base-menu-width;
    top: $base-header-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100% - #{$base-menu-fold-width});
      left: $base-menu-fold-width;
    }
  }
}
</style>
