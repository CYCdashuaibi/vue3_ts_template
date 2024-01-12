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
        添加SKU
      </el-button>
      <el-table :data="skuList" border style="margin: 10px 0">
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="skuName"
          label="名称"
          width="200px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="skuDesc"
          label="描述"
          width="250px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="skuDefaultImg"
          label="默认图片"
          width="150px"
          align="center"
        >
          <template #default="scope">
            <el-image
              style="width: 130px"
              :src="scope.row.skuDefaultImg"
              :preview-src-list="[scope.row.skuDefaultImg]"
              placeholder="图片加载中..."
              :preview-teleported="true"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量(g)"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格(元)"
          align="center"
        ></el-table-column>
        <el-table-column
          width="205px"
          label="操作"
          fixed="right"
          align="center"
        >
          <template #default="scope">
            <el-button
              :icon="scope.row.isSale ? 'Bottom' : 'Top'"
              :plain="scope.row.isSale === 1"
              :type="scope.row.isSale ? 'danger' : 'success'"
              :title="scope.row.isSale ? '下架商品' : '上架商品'"
              size="small"
              @click="updateSale(scope.row)"
            ></el-button>
            <el-button
              icon="Edit"
              type="warning"
              title="修改SPU"
              size="small"
              @click="updateSku(scope.row)"
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
import { onMounted, ref } from 'vue'
import { reqGetSkuList, reqCancelSale, reqOnSale } from '@/api/product/sku'
import { ISkuListResponse, ISkuData } from '@/api/product/sku/type'
import { CodeStatus } from '@/utils/common'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'SKU',
})

let scene = ref<number>(0)
let addBtnDisabled = ref<boolean>(true)

let pageNo = ref<number>(0)
let pageSize = ref<number>(5)
let total = ref<number>(0)

// sku 列表
let skuList = ref<ISkuData[]>([])

const categoryChange = async () => {
  // 重置添加按钮的禁用状态
  addBtnDisabled.value = false
}

// 每页显示数据数变化
const handleSizeChange = () => {
  getSkuList()
}

// 当前页数变化
const handleCurrentChange = (pager: number) => {
  getSkuList(pager)
}

// 获取 SKU 列表
const getSkuList = async (pager: number = 1) => {
  pageNo.value = pager
  const res: ISkuListResponse = await reqGetSkuList(pager, pageSize.value)

  if (res.code === CodeStatus.SUCCESS) {
    total.value = res.data.total
    skuList.value = res.data.records
  }
}

// 更新商品上下架状态
const updateSale = async (row: ISkuData) => {
  let res: any = null
  if (row.isSale) {
    res = await reqCancelSale(row.id as number)
  } else {
    res = await reqOnSale(row.id as number)
  }

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success(row.isSale ? '下架成功' : '上架成功')
    getSkuList(pageNo.value)
  } else {
    ElMessage.success(row.isSale ? '下架失败' : '上架失败')
  }
}

// 修改 SKU
const updateSku = (row: ISkuData) => {
  ElMessage.success('制作中...')
  console.log(row)
}

onMounted(() => {
  getSkuList()
})
</script>

<style scoped></style>
