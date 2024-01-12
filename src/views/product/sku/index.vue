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
              title="查看商品详情"
              size="small"
              @click="showDetail(scope.row)"
            ></el-button>
            <el-popconfirm title="确认删除吗?" @confirm="deleteSku(scope.row)">
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

    <!-- 商品详情抽屉 -->
    <el-drawer v-model="isShowDetail" size="45%" direction="rtl">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <div class="deteail-item">
          <div class="label">名称</div>
          <div class="content">{{ spuDetail.skuName }}</div>
        </div>
        <div class="deteail-item">
          <div class="label">描述</div>
          <div class="content">{{ spuDetail.skuDesc }}</div>
        </div>
        <div class="deteail-item">
          <div class="label">价格</div>
          <div class="content">￥{{ spuDetail.price }}</div>
        </div>
        <div class="deteail-item">
          <div class="label">平台属性</div>
          <div class="content">
            <el-tag
              type="warning"
              v-for="skuAttrValue in spuDetail.skuAttrValueList"
              :key="skuAttrValue.id"
              style="margin: 2px"
            >
              {{ skuAttrValue.valueName }}
            </el-tag>
          </div>
        </div>
        <div class="deteail-item">
          <div class="label">销售属性</div>
          <div class="content">
            <el-tag
              type="success"
              v-for="saleAttrValue in spuDetail.skuSaleAttrValueList"
              :key="saleAttrValue.id"
              style="margin: 2px"
            >
              {{ saleAttrValue.saleAttrName }}
            </el-tag>
          </div>
        </div>
        <div class="deteail-item">
          <div class="label">商品图片</div>
          <div class="content">
            <el-carousel :interval="5000">
              <el-carousel-item
                v-for="(skuImage, index) in spuDetail.skuImageList"
                :key="skuImage.id"
              >
                <el-image
                  style="height: 100%; width: 100%"
                  :src="skuImage.imgUrl"
                  :preview-src-list="
                    spuDetail?.skuImageList?.map((item) => item.imgUrl)
                  "
                  :initial-index="index"
                  preview-teleported
                  fit="contain"
                />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  reqGetSkuList,
  reqCancelSale,
  reqOnSale,
  reqGetSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku'
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

// 商品详情抽屉是否显示
let isShowDetail = ref<boolean>(false)
// 商品详情数据
let spuDetail = ref<ISkuData>({
  category3Id: null,
  spuId: null,
  tmId: null,
  skuName: '',
  isSale: null,
  price: null,
  weight: null,
  skuDesc: '',
  skuDefaultImg: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
})

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

// 展示商品详情
const showDetail = async (row: ISkuData) => {
  const res = await reqGetSkuInfo(row.id as number)

  if (res.code === CodeStatus.SUCCESS) {
    isShowDetail.value = true
    spuDetail.value = res.data
  } else {
    ElMessage.error('获取商品详情数据失败')
  }
}

// 删除商品
const deleteSku = async (row: ISkuData) => {
  const res = await reqDeleteSku(row.id as number)

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('删除成功')
    getSkuList(skuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  getSkuList()
})
</script>

<style scoped lang="scss">
.deteail-item {
  display: flex;
  margin-top: 15px;
  align-items: center;

  .label {
    width: 70px;
    text-align: right;
    margin-right: 15px;
    color: #606266;
  }

  .content {
    flex: 1;
  }
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
