<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <el-icon style="margin-right: 10px" @click="foldMenu">
        <component
          :is="layoutSettingStore.fold ? 'Expand' : 'Fold'"
        ></component>
      </el-icon>
      <!-- 面包屑 -->
      <Breadcrumb />
    </div>
    <div class="tabbar-right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
import useLayoutSettingStore from '@/store/modules/setting'

defineOptions({
  name: 'Tabbar',
})

const layoutSettingStore = useLayoutSettingStore()

const foldMenu = () => {
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background: linear-gradient(to right, #ffffff, #f2f2f2, #e4e4f2);
  border-bottom: 1px solid #8b8b8b;
  box-sizing: border-box;

  .tabbar-left {
    display: flex;
    align-items: center;
  }

  .tabbar-right {
    display: flex;
    align-items: center;
  }
}
</style>
