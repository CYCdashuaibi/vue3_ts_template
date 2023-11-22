<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { watch, ref, nextTick } from 'vue'

defineOptions({
  name: 'MyMain',
})

// 控制组件销毁重建
const flag = ref<boolean>(true)

watch(
  () => useLayoutSettingStore().refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>
