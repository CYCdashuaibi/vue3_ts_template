<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item
      :to="item.path"
      v-for="(item, index) in $router.matched"
      :key="index"
      v-show="item.meta.title !== 'Layout'"
    >
      <el-icon style="margin: 5px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const $router = useRoute()

defineOptions({
  name: 'Breadcrumb',
})
</script>

<style scoped lang="scss">
::v-deep .el-breadcrumb__inner {
  display: flex;
  align-items: center;
}
</style>
