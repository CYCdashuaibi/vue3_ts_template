<template>
  <div>
    <!-- 表格 -->
    <el-table :data="permissionList" border row-key="id">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="权限值" align="center" />
      <el-table-column prop="updateTime" label="修改时间" align="center" />
      <el-table-column label="操作" align="center" width="270px">
        <template #default="scope">
          <el-button
            icon="User"
            size="small"
            type="primary"
            :disabled="scope.row.level === 4"
            @click="addPermission(scope.row)"
          >
            {{ scope.row.level === 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            icon="Edit"
            size="small"
            type="warning"
            :disabled="scope.row.level === 1"
            @click="updatePermission(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            title="确认删除吗?"
            @confirm="deletePermission(scope.row)"
          >
            <template #reference>
              <el-button
                :disabled="scope.row.level === 1"
                icon="Delete"
                size="small"
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      v-model="addOrUpdateDialogVisible"
      :title="permissionParams.id ? '修改菜单' : '添加菜单'"
      @close="addOrUpdateDialogClose"
    >
      <el-form
        ref="addOrUpdateFormRef"
        :model="permissionParams"
        :rules="permissionParamsRules"
        label-width="70px"
      >
        <el-form-item prop="name" label="名称">
          <el-input v-model="permissionParams.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item prop="code" label="权限值">
          <el-input
            v-model="permissionParams.code"
            placeholder="请输入权限值"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addOrUpdateCancel">取消</el-button>
          <el-button
            type="primary"
            @click="addOrUpdateSave(addOrUpdateFormRef)"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { CodeStatus } from '@/utils/common'
import {
  reqGetPermissionList,
  reqAddOrUpdatePermission,
  reqRemovePermission,
} from '@/api/acl/permission'
import { type FormRules, type FormInstance, ElMessage } from 'element-plus'
import type {
  IPermission,
  IGetPermissionResponse,
  IPermissionParams,
} from '@/api/acl/permission/type'

defineOptions({
  name: 'Permission',
})

// 添加或编辑菜单表单实例
const addOrUpdateFormRef = ref<any>(null)

// 菜单列表
let permissionList = ref<IPermission[]>([])

// 添加或修改菜单对话框是否可见
const addOrUpdateDialogVisible = ref<boolean>(false)

// 添加或修改菜单的参数
const permissionParams = reactive<IPermissionParams>({
  code: '',
  level: null,
  name: '',
  pid: null,
})

// 表单验证
const permissionParamsRules = reactive<FormRules<IPermissionParams>>({
  name: [{ required: true, message: '请输入名称' }],
  code: [{ required: true, message: '请输入权限值' }],
})

// 获取菜单列表
const getPermissionList = async () => {
  const res: IGetPermissionResponse = await reqGetPermissionList()
  if (res.code === CodeStatus.SUCCESS) {
    permissionList.value = res.data
  }
}

// 添加菜单
const addPermission = (permission: IPermission) => {
  permissionParams.level = permission.level + 1
  permissionParams.pid = permission.id

  addOrUpdateDialogVisible.value = true
}

// 编辑菜单
const updatePermission = (permission: IPermission) => {
  permissionParams.id = permission.id
  permissionParams.name = permission.name
  permissionParams.code = permission.code

  addOrUpdateDialogVisible.value = true
}

// 添加或编辑菜单取消
const addOrUpdateCancel = () => {
  addOrUpdateDialogVisible.value = false
}

// 添加或编辑菜单确定
const addOrUpdateSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await reqAddOrUpdatePermission(permissionParams)

      if (res.code === CodeStatus.SUCCESS) {
        ElMessage.success(permissionParams.id ? '修改成功' : '添加成功')
        addOrUpdateDialogVisible.value = false
        getPermissionList()
      } else {
        ElMessage.error(permissionParams.id ? '修改失败' : '添加失败')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 初始化参数
const initParams = () => {
  for (const key in permissionParams) {
    if (Object.hasOwnProperty.call(permissionParams, key)) {
      delete (permissionParams as { [key: string]: any })[key]
    }
  }
}

// 添加或编辑菜单对话框关闭
const addOrUpdateDialogClose = () => {
  initParams()
  addOrUpdateFormRef.value.resetFields()
}

// 删除菜单
const deletePermission = async (permission: IPermission) => {
  const res = await reqRemovePermission(permission.id as number)
  if (res.code == CodeStatus.SUCCESS) {
    ElMessage.success('删除成功')
    getPermissionList()
  } else {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  getPermissionList()
})
</script>

<style scoped></style>
