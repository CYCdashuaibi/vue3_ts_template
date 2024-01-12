<!-- 添加 SKU 的组件 -->
<template>
  <el-form label-position="right" label-width="100px">
    <el-form-item label="SKU名称">
      <el-input
        v-model="skuParams.skuName"
        placeholder="请输入SKU名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        v-model.number="skuParams.price"
        placeholder="请输入价格"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        v-model.number="skuParams.weight"
        placeholder="请输入重量"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        v-model="skuParams.skuDesc"
        type="textarea"
        placeholder="请输入SKU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form label-position="right" label-width="100px" inline>
        <el-form-item
          v-for="attr in attrList"
          :key="attr.id"
          :label="attr.attrName"
        >
          <el-select v-model="attr.attrIdAndValueId">
            <el-option
              v-for="attrValue in attr.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline label-position="right" label-width="100px">
        <el-form-item
          v-for="saleAttr in spuSaleAttrList"
          :key="saleAttr.id"
          :label="saleAttr.saleAttrName"
        >
          <el-select v-model="saleAttr.saleIdAndsaleValueId">
            <el-option
              v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="商品图片">
      <el-table ref="imgTabelRef" :data="spuImageList" border>
        <el-table-column
          type="selection"
          width="60px"
          align="center"
        ></el-table-column>
        <el-table-column prop="imgUrl" align="center" label="图片">
          <template #default="scope">
            <el-image
              style="height: 100px"
              :src="scope.row.imgUrl"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="spuImageList.map((item) => item.imgUrl)"
              :initial-index="scope.$index"
              placeholder="图片加载中..."
              preview-teleported
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="imgName"
          align="center"
          label="名称"
        ></el-table-column>
        <el-table-column align="center" width="120px" label="操作">
          <template #default="scope">
            <el-button
              :type="
                scope.row.imgUrl === skuParams.skuDefaultImg
                  ? 'success'
                  : 'warning'
              "
              @click="setDefaultImg(scope.row)"
            >
              {{
                scope.row.imgUrl === skuParams.skuDefaultImg
                  ? '默认图片'
                  : '设置默认'
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type {
  ISpuData,
  ISpuSaleAttrResponseData,
  ISpuImgResponseData,
  ISpuSaleAttr,
  ISpuImg,
  ISkuData,
} from '@/api/product/spu/type'
import type { IAttrListResponse, IAttr } from '@/api/product/attr/type'
import { reqAttrList } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuSaleAttrList,
  reqSaveSku,
} from '@/api/product/spu'
import { CodeStatus } from '@/utils/common'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'SkuForm',
})

// 图片表格实例
const imgTabelRef = ref<any>(null)

// 平台属性
let attrList = ref<IAttr[]>([])
// 销售属性
let spuSaleAttrList = ref<ISpuSaleAttr[]>([])
// 照片墙数据
let spuImageList = ref<ISpuImg[]>([])

// sku参数
const skuParams = reactive<ISkuData>({
  // 父组件传参
  category3Id: null,
  spuId: null,
  tmId: null,

  skuName: '',
  price: null,
  weight: null,
  skuDesc: '',
  skuDefaultImg: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
})

const $emit = defineEmits(['changeScene'])

const cancel = () => {
  $emit('changeScene', { scene: 0, model: 'cancel' })
}

const initParams = () => {
  Object.assign(skuParams, {
    // 父组件传参
    category3Id: null,
    spuId: null,
    tmId: null,

    skuName: '',
    price: null,
    weight: null,
    skuDesc: '',
    skuDefaultImg: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
  })

  attrList.value = []
  spuSaleAttrList.value = []
  spuImageList.value = []
}

// 获取添加 SKU 需要的数据
const getAddSkuData = async (attrIdObj: any, spu: ISpuData) => {
  initParams()

  skuParams.category3Id = attrIdObj.category3Id
  skuParams.spuId = spu.id as number
  skuParams.tmId = spu.tmId

  const attrListRes: IAttrListResponse = await reqAttrList(attrIdObj)
  if (attrListRes.code === CodeStatus.SUCCESS) {
    attrList.value = attrListRes.data
  }

  const spuImageListRes: ISpuImgResponseData = await reqSpuImageList(
    spu.id as number,
  )
  if (spuImageListRes.code === CodeStatus.SUCCESS) {
    spuImageList.value = spuImageListRes.data
  }

  const spuSaleAttrListRes: ISpuSaleAttrResponseData = await reqSpuSaleAttrList(
    spu.id as number,
  )
  if (spuSaleAttrListRes.code === CodeStatus.SUCCESS) {
    spuSaleAttrList.value = spuSaleAttrListRes.data
  }
}

// 设置默认图片
const setDefaultImg = (row: ISpuImg) => {
  // 清除其他复选框勾选
  imgTabelRef.value.clearSelection()
  // 复选框选中
  imgTabelRef.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl as string
}

// 保存
const save = async () => {
  skuParams.skuAttrValueList = attrList.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])

  skuParams.skuSaleAttrValueList = spuSaleAttrList.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndsaleValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndsaleValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    [],
  )

  const res = await reqSaveSku(skuParams)

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('添加成功')
    $emit('changeScene', { scene: 0, model: 'cancel' })
  } else {
    ElMessage.error('添加失败')
  }
}

defineExpose({ getAddSkuData })
</script>

<style scoped></style>
