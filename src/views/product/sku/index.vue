<template>
  <div>
    <!-- 分类选择器 -->
    <Category
      :scene="scene"
      v-model:addBtnDisabled="addBtnDisabled"
      @category-change="categoryChange"
    />

    <el-card style="margin: 10px 0">
      <el-button type="primary" :disabled="addBtnDisabled" icon="Plus">
        添加SPU
      </el-button>
      <el-table border style="margin: 10px 0">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="名称"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="描述"
          width="250px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="默认图片"
          width="150px"
          align="center"
        ></el-table-column>
        <el-table-column label="重量(g)" align="center"></el-table-column>
        <el-table-column label="价格(元)" align="center"></el-table-column>
        <el-table-column label="价格(元)" align="center"></el-table-column>
        <el-table-column
          width="205px"
          label="操作"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              icon="Plus"
              type="primary"
              title="添加SKU"
              size="small"
            ></el-button>
            <el-button
              icon="Edit"
              type="warning"
              title="修改SPU"
              size="small"
            ></el-button>
            <el-button
              icon="InfoFilled"
              type="info"
              title="查看SKU列表"
              size="small"
            ></el-button>
            <el-popconfirm title="确认删除吗?">
              <template #reference>
                <el-button
                  icon="Delete"
                  type="danger"
                  title="删除SPU"
                  size="small"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20]"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        :small="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'SKU',
})

let scene = ref<number>(0)
let addBtnDisabled = ref<boolean>(true)

let pageNo = ref<number>(0)
let pageSize = ref<number>(5)
let total = ref<number>(0)

const categoryChange = async () => {
  // 重置添加按钮的禁用状态
  addBtnDisabled.value = false
}

// 每页显示数据数变化
const handleSizeChange = () => {}

// 当前页数变化
const handleCurrentChange = (pager: number) => {
  console.log(pager)
}
</script>

<style scoped></style>
