<template>
  <div>
    <!-- 搜索 -->
    <el-card style="height: 75px">
      <el-form inline class="search-form">
        <el-form-item label="角色名称">
          <el-input
            v-model="searchKeyWord"
            placeholder="请输入搜索的角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" :disabled="!searchKeyWord" type="primary">
            搜索
          </el-button>
          <el-button @click="reset" style="color: #409eff">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 内容 -->
    <el-card style="margin: 10px 0">
      <el-button type="primary" icon="Plus" @click="addRole">
        添加角色
      </el-button>

      <!-- 角色列表表格 -->
      <el-table :data="roleList" border style="margin: 10px 0">
        <el-table-column
          type="index"
          width="80px"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column
          width="80px"
          prop="id"
          align="center"
          label="id"
        ></el-table-column>
        <el-table-column
          min-width="150px"
          prop="roleName"
          align="center"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          width="165px"
          prop="createTime"
          align="center"
          label="创建时间"
        ></el-table-column>
        <el-table-column
          width="165px"
          prop="updateTime"
          align="center"
          label="更新时间"
        ></el-table-column>
        <el-table-column
          fixed="right"
          width="270px"
          align="center"
          label="操作"
        >
          <template #default="scope">
            <el-button
              icon="User"
              size="small"
              type="primary"
              @click="setPermission(scope.row)"
            >
              分配权限
            </el-button>
            <el-button
              icon="Edit"
              size="small"
              type="warning"
              @click="updateRole(scope.row)"
            >
              编辑
            </el-button>
            <el-popconfirm title="确认删除吗?" @confirm="deleteRole(scope.row)">
              <template #reference>
                <el-button icon="Delete" size="small" type="danger">
                  删除
                </el-button>
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

    <!-- 添加角色对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      v-model="addOrUpdateDialogVisible"
      :title="roleParams.id ? '修改角色' : '添加角色'"
      @close="addOrUpdateDialogClose"
    >
      <el-form
        ref="addOrUpdateFormRef"
        :model="roleParams"
        :rules="roleParamsRules"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input
            v-model="roleParams.roleName"
            placeholder="请输入角色名称"
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

    <!-- 分配角色抽屉 -->
    <el-drawer
      @close="permissionDrawerClose"
      v-model="permissionDrawerVisible"
      size="35%"
      direction="rtl"
    >
      <template #header>
        <h4>分配权限</h4>
      </template>
      <template #default>
        <el-tree
          v-loading="permissionTreeLoading"
          ref="treeRef"
          :data="permissionList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckedPermissionIdList"
          :props="defaultProps"
        />
      </template>
      <template #footer>
        <el-button @click="setPermissionCancel">取消</el-button>
        <el-button type="primary" @click="setPermissionSave">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import {
  reqGetRoleList,
  reqAddOrUpdateRole,
  reqGetPermission,
  reqAssignPermission,
  reqRemoveRole,
} from '@/api/acl/role'
import type {
  IRole,
  IRoleListResponse,
  IPermission,
  IGetPermissionResponse,
} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { CodeStatus } from '@/utils/common'

defineOptions({
  name: 'Role',
})

// layout 设置仓库
const settingStore = useLayoutSettingStore()

// 添加或修改角色表单实例
const addOrUpdateFormRef = ref<any>(null)

// 分配权限树形控件实例
const treeRef = ref<any>(null)

// 分页数据
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// 搜索关键字
let searchKeyWord = ref<string>('')

// 角色列表
let roleList = ref<IRole[]>([])

// 添加或修改角色对话框是否显示
let addOrUpdateDialogVisible = ref<boolean>(false)

// 添加或修改角色的表单参数
let roleParams = reactive<IRole>({})

// 表单校验规则
let roleParamsRules = reactive<FormRules<IRole>>({
  roleName: [{ required: true, message: '请输入角色名称' }],
})

// 分配角色抽屉是否可见
const permissionDrawerVisible = ref<boolean>(false)

const defaultProps = {
  children: 'children',
  label: 'name',
}

// 角色权限列表
const permissionList = ref<IPermission[]>([])

// 分配权限参数
const permissionParams = ref<IRole>({})

// 默认勾选的角色权限 id 列表
const defaultCheckedPermissionIdList = ref<number[]>([])

// 分配权限树形控件的加载状态
const permissionTreeLoading = ref<boolean>(false)

// 每页显示数据数变化
const handleSizeChange = () => {
  getRoleList()
}

// 当前页数变化
const handleCurrentChange = (pager: number) => {
  getRoleList(pager)
}

// 获取角色列表
const getRoleList = async (pager: number = 1) => {
  pageNo.value = pager

  const res: IRoleListResponse = await reqGetRoleList(
    pageNo.value,
    pageSize.value,
    searchKeyWord.value,
  )
  if (res.code === CodeStatus.SUCCESS) {
    roleList.value = res.data.records
    total.value = res.data.total
  }
}

// 添加角色
const addRole = () => {
  addOrUpdateDialogVisible.value = true
}

// 编辑角色
const updateRole = (row: IRole) => {
  Object.assign(roleParams, {
    id: row.id,
    roleName: row.roleName,
  })

  addOrUpdateDialogVisible.value = true
}

// 删除角色
const deleteRole = async (row: IRole) => {
  const res = await reqRemoveRole(row.id as number)
  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('删除成功')
    getRoleList(roleList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// 添加或修改确定
const addOrUpdateSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await reqAddOrUpdateRole(roleParams)
      if (res.code === CodeStatus.SUCCESS) {
        addOrUpdateDialogVisible.value = false
        ElMessage.success(roleParams.id ? '修改成功' : '添加成功')
        getRoleList(roleParams.id ? pageNo.value : 1)
      } else {
        ElMessage.success(roleParams.id ? '修改失败' : '添加失败')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 添加或修改取消
const addOrUpdateCancel = () => {
  addOrUpdateDialogVisible.value = false
}

// 初始化参数
const initParams = () => {
  for (const key in roleParams) {
    if (Object.hasOwnProperty.call(roleParams, key)) {
      delete (roleParams as { [key: string]: any })[key]
    }
  }
}

// 添加或修改对话框关闭
const addOrUpdateDialogClose = () => {
  initParams()

  addOrUpdateFormRef.value.resetFields()
}

// 分配权限
const setPermission = async (role: IRole) => {
  permissionParams.value = role
  permissionDrawerVisible.value = true

  // 开启局部加载效果
  permissionTreeLoading.value = true

  try {
    const res: IGetPermissionResponse = await reqGetPermission(
      role.id as number,
    )
    if (res.code === CodeStatus.SUCCESS) {
      permissionList.value = res.data
      defaultCheckedPermissionIdList.value = filterDefaultChecked(res.data, [])
    }
  } catch (error) {
    console.error('Error loading permissions:', error)
    ElMessage.error('加载权限数据失败')
  } finally {
    // 关闭局部加载效果
    permissionTreeLoading.value = false
  }
}
// 过滤默认选择的权限列表
const filterDefaultChecked = (
  permissionList: IPermission[],
  initList: number[],
) => {
  permissionList.forEach((item: IPermission) => {
    if (item.select && item.level === 4) {
      initList.push(item.id)
    }

    if (item.children && item.children.length) {
      filterDefaultChecked(item.children, initList)
    }
  })
  return initList
}

// 分配权限取消
const setPermissionCancel = () => {
  permissionDrawerVisible.value = false
}

// 分配权限确定
const setPermissionSave = async () => {
  const res = await reqAssignPermission(permissionParams.value.id as number, [
    ...treeRef.value.getCheckedKeys(),
    ...treeRef.value.getHalfCheckedKeys(),
  ])

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('分配权限成功')
    permissionDrawerVisible.value = false
    window.location.reload()
  }
}

// 分配权限抽屉关闭
const permissionDrawerClose = () => {}

// 重置
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

// 搜索
const search = () => {
  getRoleList()
}

onMounted(() => {
  getRoleList()
})
</script>

<style scoped lang="scss">
.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
