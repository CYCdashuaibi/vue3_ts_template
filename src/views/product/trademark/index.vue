<template>
  <el-card class="box-card" ref="card">
    <el-button type="primary" size="default" icon="Plus" @click="addTradeMark">
      添加品牌
    </el-button>
    <!-- 表格 -->
    <el-table :data="trademarkList" border style="margin: 10px 0">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌LOGO"
        align="center"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-image
            :src="scope.row.logoUrl"
            style="width: 100px; height: auto"
            fit="contain"
            :preview-src-list="[scope.row.logoUrl]"
            :preview-teleported="true"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template #default="scope">
          <el-button type="primary" icon="Edit" @click="editTrademark(scope)">
            编辑
          </el-button>
          <el-button
            type="danger"
            icon="Delete"
            @click="deleteTrademark(scope)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="pageSizes"
        :background="true"
        layout="prev, pager, next, jumper, -> ,sizes, total"
        :total="total"
        @size-change="sizeChange"
        @current-change="getTrademarkList"
      />
    </div>
    <!-- 添加或修改品牌的对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="trademarkForm.id ? '编辑品牌' : '添加品牌'"
      width="60%"
    >
      <el-form
        :model="trademarkForm"
        :rules="trademarkFormRules"
        ref="trademarkFormRef"
        style="width: 80%"
        label-width="100px"
      >
        <el-form-item prop="tmName" label="品牌名称" required>
          <el-input
            v-model="trademarkForm.tmName"
            placeholder="请输入品牌名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="logoUrl" label="品牌LOGO" required>
          <el-upload
            drag
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
          >
            <el-image
              :src="trademarkForm.logoUrl"
              style="width: 100px; height: auto"
              fit="contain"
              v-if="trademarkForm.logoUrl"
            ></el-image>
            <el-icon class="el-icon--upload" v-else><upload-filled /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogCancel">取消</el-button>
          <el-button type="primary" @click="dialogConfirm(trademarkFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  reqTrademarkList,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import { onMounted } from 'vue'
import { CodeStatus } from '@/utils/common'
import type { UploadProps, FormRules, FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type {
  ITrademark,
  ITrademarkListResponse,
  IAddOrUpdateTrademarkParams,
} from '@/api/product/trademark/type'

defineOptions({
  name: 'Trademark',
})

// 当前页码
let page = ref<number>(1)
// 每页展示条数
const limit = ref<number>(10)
// 分页器尺寸
const pageSizes = ref<Array<number>>([5, 10, 20, 30])
// 总条数
const total = ref<number>(0)
// 品牌列表
const trademarkList = ref<Array<ITrademark>>([])

// 添加或修改品牌的对话框
const dialogVisible = ref<boolean>(false)

// 品牌表单
const trademarkForm = reactive<IAddOrUpdateTrademarkParams>({
  tmName: '',
  logoUrl: '',
})

// 品牌表单验证规则
const trademarkFormRules = reactive<FormRules<IAddOrUpdateTrademarkParams>>({
  tmName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    {
      min: 2,
      max: 8,
      message: '品牌名称长度 2 到 8 个字符',
      trigger: 'blur',
    },
  ],
  logoUrl: [{ required: true, message: '请上传品牌LOGO' }],
})

// 品牌表单 ref
const trademarkFormRef = ref<FormInstance>()

// 获取品牌列表
const getTrademarkList = async (pager: number = 1) => {
  page.value = pager
  const params = {
    page: page.value,
    limit: limit.value,
  }
  const res: ITrademarkListResponse = await reqTrademarkList(params)

  if (res.code === CodeStatus.SUCCESS) {
    total.value = res.data.total

    trademarkList.value = res.data.records

    // 补全图片缺失的 http://
    trademarkList.value.forEach((item: any) => {
      if (!item.logoUrl?.startsWith('http')) {
        item.logoUrl = 'http://' + item.logoUrl
      }
    })
  }
}

// 图片上传前的钩子
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 图片类型
  const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
  if (!isImage.includes(rawFile.type)) {
    ElMessage.error(`请上传jpeg、png、jpg、gif格式的图片!`)
    return false
  } else if (rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('图片大小不能超过4MB!')
    return false
  }
  return true
}

// 文件上传成功的钩子
const onSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === CodeStatus.SUCCESS) {
    trademarkForm.logoUrl = response.data
    trademarkFormRef.value && trademarkFormRef.value.clearValidate(['logoUrl'])
  } else {
    ElMessage.error(response.message)
  }
}

// 分页器尺寸改变
const sizeChange = () => {
  getTrademarkList()
}

// 编辑品牌
const editTrademark = (scope: any) => {
  // 清除表单验证
  trademarkFormRef.value && trademarkFormRef.value.clearValidate()
  trademarkForm.tmName = scope.row.tmName
  trademarkForm.logoUrl = scope.row.logoUrl
  trademarkForm.id = scope.row.id
  dialogVisible.value = true
}

// 删除品牌
const deleteTrademark = (scope: any) => {
  // console.log('删除品牌', scope)
  ElMessageBox.confirm('确定删除品牌吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await reqDeleteTrademark(scope.row.id)
      if (res.code === CodeStatus.SUCCESS) {
        getTrademarkList(
          trademarkList.value.length > 1 ? page.value : page.value - 1,
        )
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      } else {
        ElMessage({
          type: 'error',
          message: `删除失败：${res.data}`,
        })
      }
    })
    .catch(() => {})
}

// 添加品牌
const addTradeMark = () => {
  // 清空表单
  trademarkForm.tmName = ''
  trademarkForm.logoUrl = ''
  delete trademarkForm.id
  dialogVisible.value = true
  // 清除表单验证
  trademarkFormRef.value && trademarkFormRef.value.clearValidate()
}

// 对话框取消
const dialogCancel = () => {
  dialogVisible.value = false
}

// 对话框确定
const dialogConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await reqAddOrUpdateTrademark(trademarkForm)
      if (res.code === CodeStatus.SUCCESS) {
        ElMessage.success(trademarkForm.id ? '编辑品牌成功' : '添加品牌成功')
        dialogVisible.value = false
        getTrademarkList(trademarkForm.id ? page.value : 1)
      } else {
        ElMessage.error(trademarkForm.id ? '编辑品牌失败' : '添加品牌失败')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  getTrademarkList()
})
</script>

<style scoped lang="scss">
::v-deep .el-upload-dragger {
  padding: 5px 10px;
}
</style>
