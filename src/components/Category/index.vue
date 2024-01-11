<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene !== 0"
          v-model="category1Id"
          @change="category1Change"
        >
          <el-option
            v-for="item in category1List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene !== 0"
          v-model="category2Id"
          @change="category2Change"
        >
          <el-option
            v-for="item in category2List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene !== 0"
          v-model="category3Id"
          @change="category3Change"
        >
          <el-option
            v-for="item in category3List"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CodeStatus } from '@/utils/common'
import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/product/attr'
import type {
  ICategory1,
  ICategory2,
  ICategory3,
} from '@/api/product/attr/type'

defineOptions({
  name: 'Category',
})

defineProps({
  scene: {
    type: Number,
    default: 0,
  },
  addBtnDisabled: {
    type: Boolean,
    default: false,
  },
})

const category1List = ref<ICategory1[]>([])
const category2List = ref<ICategory2[]>([])
const category3List = ref<ICategory3[]>([])

const category1Id = ref<number | null>(null)
const category2Id = ref<number | null>(null)
const category3Id = ref<number | null>(null)

// 自定义事件
const $emit = defineEmits(['categoryChange', 'update:addBtnDisabled'])

// 一级分类改变
const category1Change = async () => {
  // 重置二级分类和三级分类
  category2Id.value = null
  category3Id.value = null
  // 禁用父组件的添加按钮
  $emit('update:addBtnDisabled', true)
  const res = await reqCategory2(category1Id.value as number)
  if (res.code === CodeStatus.SUCCESS) {
    category2List.value = res.data
  }
}

// 二级分类改变
const category2Change = async () => {
  // 重置三级分类
  category3Id.value = null
  // 禁用父组件的添加按钮
  $emit('update:addBtnDisabled', true)
  const res = await reqCategory3(category2Id.value as number)
  if (res.code === CodeStatus.SUCCESS) {
    category3List.value = res.data
  }
}

// 三级分类改变
const category3Change = async () => {
  // 通知父组件请求数据
  $emit('categoryChange', {
    category1Id: category1Id.value,
    category2Id: category2Id.value,
    category3Id: category3Id.value,
  })
}

onMounted(async () => {
  const res = await reqCategory1()
  if (res.code === CodeStatus.SUCCESS) {
    category1List.value = res.data
  }
})
</script>

<style scoped></style>
