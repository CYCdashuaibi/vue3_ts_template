<!-- 添加 SPU | 修改 SPU 的组件 -->
<template>
  <el-form label-position="right" label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        v-model="spuParams.spuName"
        placeholder="请输入SPU名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="spuParams.tmId" placeholder="请选择SPU品牌">
        <el-option
          v-for="item in trademarkList"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="spuParams.description"
        type="textarea"
        placeholder="请输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        accept="image/*"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleBeforeUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="selectSaleAttrId"
        :placeholder="
          unSelectSaleAttr.length
            ? `还有${unSelectSaleAttr.length}个属性未选择`
            : `全部属性都已选择`
        "
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        type="primary"
        :disabled="!selectSaleAttrId"
        icon="Plus"
        style="margin-left: 10px"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- 展示销售属性与属性值 -->
      <el-table :data="saleAttrList" border style="margin: 10px 0">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="saleAttrName"
          label="属性名"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column prop="spuSaleAttrValueList" label="属性值">
          <template #default="{ row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              :key="index"
              class="mx-1"
              closable
              :disable-transitions="false"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              ref="saleAttrValueIptRef"
              v-model.trim="row.saleAttrValue"
              @blur="toLook(row)"
              v-if="row.isEdit"
              placeholder="请输入属性值"
              size="small"
              style="width: 85px; margin-right: 5px; margin-bottom: 5px"
            ></el-input>
            <el-button
              v-else
              size="small"
              type="success"
              icon="Plus"
              @click="toEdit(row)"
              style="margin-bottom: 5px"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80px">
          <el-button
            type="danger"
            size="small"
            icon="Delete"
            @click="saleAttrList.splice($index, 1)"
          ></el-button>
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
import { computed, ref, nextTick } from 'vue'
import { CodeStatus } from '@/utils/common'
import type {
  ISpuData,
  ISaleAttrResponseData,
  IAllTrademarkResponseData,
  ISpuImgResponseData,
  ISpuSaleAttrResponseData,
  ITrademark,
  ISpuImg,
  ISpuSaleAttr,
  ISaleAttr,
  ISpuSaleAttrValue,
} from '@/api/product/spu/type'
import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuSaleAttrList,
  reqAllSaleAttrList,
  reqSaveOrUpdateSpu,
} from '@/api/product/spu'
import { ElMessage, type UploadProps, type UploadRawFile } from 'element-plus'

defineOptions({
  name: 'SpuForm',
})

// 照片扩展类型

// 全部品牌数据
let trademarkList = ref<ITrademark[]>([])
let imgList = ref<ISpuImg[]>([])
let saleAttrList = ref<ISpuSaleAttr[]>([])
let allSaleAttrList = ref<ISaleAttr[]>([])

// 已有的SPU对象
let spuParams = ref<ISpuData>({
  category3Id: '',
  spuName: '', // spu的名字
  description: '', // spu的描述
  tmId: null,
  spuImageList: [], // 品牌的id
  spuSaleAttrList: [],
})

// 预览图片Url
const dialogImageUrl = ref('')
// 预览对话框显示
const dialogVisible = ref(false)

// 收集销售属性下拉菜单的id和属性名
let selectSaleAttrId = ref<number | null>(null)

// 属性值输入框实例
const saleAttrValueIptRef = ref<any>(null)

// 当前未选择的销售属性
let unSelectSaleAttr = computed(() => {
  const selectedSaleAttr = saleAttrList.value.map((item) => item.saleAttrName)
  return allSaleAttrList.value.filter((item) => {
    return !selectedSaleAttr.includes(item.name)
  })
})

let $emit = defineEmits(['changeScene', 'save'])

const cancel = () => {
  $emit('changeScene', { scene: 0, model: 'cancel' })
}

// 保存
const save = async () => {
  // 照片墙数据
  spuParams.value.spuImageList = imgList.value.map((item) => ({
    imgName: item.name,
    imgUrl: item.response?.data || item.url,
  }))

  // 销售属性数据
  spuParams.value.spuSaleAttrList = saleAttrList.value

  const res = await reqSaveOrUpdateSpu(spuParams.value)
  if (res.code == CodeStatus.SUCCESS) {
    ElMessage.success(spuParams.value.id ? '修改成功' : '添加成功')
    $emit('changeScene', {
      scene: 0,
      model: spuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage.error(spuParams.value.id ? '修改失败' : '添加失败')
  }
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleBeforeUpload = (rawFile: UploadRawFile) => {
  const isImage = rawFile.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片')
    return false
  }

  if (rawFile.size / 1024 / 1024 > 3) {
    ElMessage.error('上传的图片最大为3M')
    return false
  }
  return true
}

const getSpuData = async (spu: ISpuData) => {
  spuParams.value = spu

  const allSaleAttrListRes: ISaleAttrResponseData = await reqAllSaleAttrList()
  const allTradmarkRes: IAllTrademarkResponseData = await reqAllTrademark()
  const spuImageListRes: ISpuImgResponseData = await reqSpuImageList(
    spu.id as number,
  )
  const spuSaleAttrListRes: ISpuSaleAttrResponseData = await reqSpuSaleAttrList(
    spu.id as number,
  )

  trademarkList.value = allTradmarkRes.data
  imgList.value = spuImageListRes.data.map((item) => ({
    name: item.imgName,
    url: item.imgUrl,
  }))
  saleAttrList.value = spuSaleAttrListRes.data
  allSaleAttrList.value = allSaleAttrListRes.data
}

// 添加销售属性
const addSaleAttr = () => {
  const selectSaleAttr = unSelectSaleAttr.value.find(
    (item) => item.id === selectSaleAttrId.value,
  )

  let newSaleAttr = {
    baseSaleAttrId: selectSaleAttr?.id ?? 0,
    saleAttrName: selectSaleAttr?.name ?? '',
    spuSaleAttrValueList: [],
  }

  saleAttrList.value.push(newSaleAttr)

  selectSaleAttrId.value = null
}

// 点击添加属性值按钮
const toEdit = (row: ISpuSaleAttr) => {
  row.isEdit = true
  row.saleAttrValue = ''

  // 获取焦点
  nextTick(() => {
    if (saleAttrValueIptRef.value) {
      saleAttrValueIptRef.value.focus()
    }
  })
}

// 添加属性值输入框失去焦点
const toLook = (row: ISpuSaleAttr) => {
  if (!row.saleAttrValue.trim()) {
    ElMessage.error('属性值不能为空')
    nextTick(() => {
      if (saleAttrValueIptRef.value) {
        saleAttrValueIptRef.value.focus()
      }
    })
    return
  }

  let repeat = row.spuSaleAttrValueList.find(
    (item) => item.saleAttrValueName == row.saleAttrValue,
  )

  if (repeat) {
    ElMessage.error('属性值不能为重复')
    nextTick(() => {
      if (saleAttrValueIptRef.value) {
        saleAttrValueIptRef.value.focus()
      }
    })
    return
  }

  const newSaleAttrValue: ISpuSaleAttrValue = {
    baseSaleAttrId: row.baseSaleAttrId,
    saleAttrValueName: row.saleAttrValue as string,
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)

  row.isEdit = false
}

// 初始化参数
const initParams = () => {
  Object.assign(spuParams.value, {
    category3Id: '',
    spuName: '', // spu的名字
    description: '', // spu的描述
    tmId: null,
    spuImageList: [], // 品牌的id
    spuSaleAttrList: [],
  })

  imgList.value = []

  saleAttrList.value = []

  selectSaleAttrId.value = ''

  delete spuParams.value.id
}

// 获取添加 SPU 的下拉表单数据
const getAddSpuData = async (category3Id: number) => {
  initParams()

  spuParams.value.category3Id = category3Id
  const allSaleAttrListRes: ISaleAttrResponseData = await reqAllSaleAttrList()
  const allTradmarkRes: IAllTrademarkResponseData = await reqAllTrademark()

  trademarkList.value = allTradmarkRes.data
  allSaleAttrList.value = allSaleAttrListRes.data
}

// 向外暴露
defineExpose({ getSpuData, getAddSpuData })
</script>

<style scoped></style>
