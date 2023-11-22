<template>
  <div>
    <!-- 分类选择器 -->
    <Category
      :scene="scene"
      v-model:addBtnDisabled="addBtnDisabled"
      @category-change="categoryChange"
    />
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          @click="addAttr"
          type="primary"
          :disabled="addBtnDisabled"
          icon="Plus"
        >
          添加平台属性
        </el-button>
        <el-table :data="attrList" border style="margin: 10px 0">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="200px"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="attrValueList" label="属性值名称">
            <template #default="scope">
              <el-tag
                v-for="item in scope.row.attrValueList"
                :key="item.id"
                style="margin: 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template #default="scope">
              <el-button type="primary" icon="Edit" @click="updateAttr">
                编辑
              </el-button>
              <el-button type="danger" icon="Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              v-model="attrName"
              placeholder="请输入属性名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Plus">添加属性值</el-button>
        <el-button @click="addCancel">取消</el-button>
        <el-table border style="margin: 10px 0">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值" align="center"></el-table-column>
          <el-table-column
            label="操作"
            width="200px"
            align="center"
          ></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="addCancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reqAttrList } from '@/api/product/attr'
import {
  IAttrListParams,
  IAttr,
  IAttrListResponse,
} from '@/api/product/attr/type'
import { CodeStatus } from '@/utils/common'
import { ref } from 'vue'

defineOptions({
  name: 'Sku',
})

const attrList = ref<IAttr[]>([])
const scene = ref<number>(0)
const addBtnDisabled = ref<boolean>(true)

const categoryChange = async (val: IAttrListParams) => {
  // 重置添加按钮的禁用状态
  addBtnDisabled.value = false
  // 重置平台属性列表
  attrList.value = []
  // 获取平台属性列表
  const res: IAttrListResponse = await reqAttrList(val)
  if (res.code === CodeStatus.SUCCESS) {
    attrList.value = res.data
  }
}

// 添加平台属性
const addAttr = () => {
  scene.value = 1
}

// 编辑平台属性
const updateAttr = () => {
  scene.value = 1
}

// 取消添加
const addCancel = () => {
  scene.value = 0
}
</script>

<style scoped></style>
