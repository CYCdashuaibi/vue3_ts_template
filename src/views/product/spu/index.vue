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
          @click="addSpu"
          :disabled="addBtnDisabled"
          type="primary"
          icon="Plus"
        >
          添加SPU
        </el-button>
        <!-- 表格 -->
        <el-table border :data="spuList" style="margin: 10px 0">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="SPU名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="SPU描述"
            align="center"
          ></el-table-column>
          <el-table-column width="205px" label="操作" align="center">
            <template #default="scope">
              <el-button
                icon="Plus"
                type="primary"
                title="添加SKU"
                size="small"
                @click="addSku(scope.row)"
              ></el-button>
              <el-button
                @click="updateSpu(scope.row)"
                icon="Edit"
                type="warning"
                title="修改SPU"
                size="small"
              ></el-button>
              <el-button
                @click="getSkuList(scope.row)"
                icon="InfoFilled"
                type="info"
                title="查看SKU列表"
                size="small"
              ></el-button>
              <el-popconfirm
                title="确认删除吗?"
                @confirm="deleteSpu(scope.row)"
              >
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
      </div>
      <!-- 添加 SKU 的组件 -->
      <spuForm
        ref="spuFormRef"
        v-show="scene === 1"
        @changeScene="changeScene"
      />
      <!-- 添加 SPU | 修改 SPU 的组件 -->
      <skuForm
        ref="skuFormRef"
        v-show="scene === 2"
        @changeScene="changeScene"
      />
      <!-- 展示 sku 列表的对话框 -->
      <el-dialog v-model="isShowSkuList" title="SKU列表">
        <el-table border :data="skuList">
          <el-table-column label="SKU名字" align="center" prop="skuName" />
          <el-table-column label="SKU价格" align="center" prop="price" />
          <el-table-column label="SKU重量" align="center" prop="weight" />
          <el-table-column label="SKU图片" align="center" prop="skuDefaultImg">
            <template #default="scope">
              <el-image
                style="height: 80px"
                :src="scope.row.skuDefaultImg"
                :preview-src-list="[scope.row.skuDefaultImg]"
                placeholder="图片加载中..."
                preview-teleported
                fit="contain"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  reqGetSpuList,
  reqGetSkuListBySpuId,
  reqDeleteSpu,
} from '@/api/product/spu'
import type { ISpuData, ISkuData } from '@/api/product/spu/type'
import type { IAttrListParams } from '@/api/product/attr/type'
import { ISpuListResponseData, IRecords } from '@/api/product/spu/type'
import { CodeStatus } from '@/utils/common'
import skuForm from './skuForm.vue'
import spuForm from './spuForm.vue'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'SPU',
})

let scene = ref<number>(0) // 0: 显示SPU列表  1: 添加或修改已有的SPU  2: 添加SKU的结构
let addBtnDisabled = ref<boolean>(true)
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(5)
// 总数据数
let total = ref<number>(0)

// 当前选择的分类三个级别的分类id
let attrIdObj = ref<IAttrListParams>({
  category1Id: null,
  category2Id: null,
  category3Id: null,
})

// Spu 列表
let spuList = ref<IRecords>([])

// spuForm 实例
let spuFormRef = ref<any>(null)
// skuForm 实例
let skuFormRef = ref<any>(null)

// Sku 列表
let skuList = ref<ISkuData[]>([])
// sku 列表对话框是否显示
let isShowSkuList = ref<boolean>(false)

const categoryChange = async (val: IAttrListParams) => {
  // 重置添加按钮的禁用状态
  addBtnDisabled.value = false
  attrIdObj.value = val
  getSpuList()
}

// 每页显示数据数变化
const handleSizeChange = () => {
  if (attrIdObj.value.category3Id) {
    getSpuList()
  }
}

// 当前页数变化
const handleCurrentChange = (pager: number) => {
  if (attrIdObj.value.category3Id) {
    getSpuList(pager)
  }
}

// const 获取某个三级分类下全部的已有的 SPU
const getSpuList = async (pager: number = 1) => {
  if (!attrIdObj.value.category3Id) {
    return
  }

  pageNo.value = pager

  const res: ISpuListResponseData = await reqGetSpuList(
    pageNo.value,
    pageSize.value,
    attrIdObj.value.category3Id as number,
  )

  if (res.code === CodeStatus.SUCCESS) {
    spuList.value = res.data.records
    total.value = res.data.total
  }
}

// 添加 SPU
const addSpu = () => {
  // 展示 spuForm
  scene.value = 1

  spuFormRef.value.getAddSpuData(attrIdObj.value.category3Id)
}

// 添加 SKU
const addSku = (row: ISpuData) => {
  scene.value = 2

  skuFormRef.value.getAddSkuData(attrIdObj.value, row)
}

const updateSpu = (row: ISpuData) => {
  // 展示 spuForm
  scene.value = 1

  spuFormRef.value.getSpuData(row)
}

// 查看 Sku 列表
const getSkuList = async (row: ISpuData) => {
  const res = await reqGetSkuListBySpuId(row.id as number)
  if (res.code === CodeStatus.SUCCESS) {
    skuList.value = res.data
    isShowSkuList.value = true
  }
}

const deleteSpu = async (row: ISpuData) => {
  const res = await reqDeleteSpu(row.id as number)
  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('删除成功')
    getSpuList(spuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}

// spuForm 取消
const changeScene = (options: any) => {
  // 展示 SPU 列表
  scene.value = options.scene

  if (options.model == 'update' || options.model == 'cancel') {
    getSpuList(pageNo.value)
  } else if (options.model == 'add') {
    getSpuList()
  }
}
</script>

<style scoped></style>
