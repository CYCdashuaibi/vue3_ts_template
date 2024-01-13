<template>
  <div class="container">
    <!-- 搜索 -->
    <el-card style="height: 75px">
      <el-form inline class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchKeyWord"
            placeholder="请输入搜索的用户姓名"
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
      <el-button type="primary" icon="Plus" @click="addUser">
        添加用户
      </el-button>
      <el-button
        type="danger"
        @click="batchRemoveUser"
        :disabled="!selectUserList.length"
      >
        批量删除
      </el-button>

      <!-- 用户列表表格 -->
      <el-table
        @selection-change="handleTableSelectionChange"
        :data="userList"
        border
        style="margin: 10px 0"
      >
        <el-table-column
          type="selection"
          width="50px"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          width="60px"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column
          width="70px"
          prop="id"
          align="center"
          label="id"
        ></el-table-column>
        <el-table-column
          min-width="150px"
          prop="username"
          align="center"
          label="用户姓名"
        ></el-table-column>
        <el-table-column
          min-width="150px"
          prop="name"
          align="center"
          label="用户昵称"
        ></el-table-column>
        <el-table-column
          min-width="180px"
          prop="roleName"
          align="center"
          label="用户角色"
        >
          <template #default="{ row }">
            <template v-if="row.roleName">
              <el-tag
                style="margin: 2px"
                v-for="item in row.roleName.split(',')"
                :key="item"
                type="success"
              >
                {{ item }}
              </el-tag>
            </template>
          </template>
        </el-table-column>
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
              @click="setRole(scope.row)"
            >
              分配角色
            </el-button>
            <el-button
              icon="Edit"
              size="small"
              type="warning"
              @click="updateUserBefore(scope.row)"
            >
              编辑
            </el-button>
            <el-popconfirm title="确认删除吗?" @confirm="deleteUser(scope.row)">
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

    <!-- 添加或修改用户的抽屉 -->
    <el-drawer
      @close="drawerClose"
      v-model="isShowAddOrUpdateDrawer"
      size="35%"
      direction="rtl"
    >
      <template #header>
        <h4>{{ userParams.id ? '修改用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form ref="userFormRef" :model="userParams" :rules="userFormRules">
          <el-form-item prop="username" label="用户姓名">
            <el-input
              v-model="userParams.username"
              plcaeholder="请输入用户姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="用户昵称">
            <el-input
              v-model="userParams.name"
              plcaeholder="请输入用户昵称"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="!userParams.id" prop="password" label="用户密码">
            <el-input
              v-model="userParams.password"
              plcaeholder="请输入用户密码"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save(userFormRef)">确定</el-button>
      </template>
    </el-drawer>

    <!-- 分配角色抽屉 -->
    <el-drawer v-model="isShowRoleDrawer" size="35%" direction="rtl">
      <template #header>
        <h4>分配用户角色</h4>
      </template>
      <template #default>
        <el-form :model="roleParams">
          <el-form-item prop="username" label="用户姓名">
            <el-input v-model="roleParams.username" disabled></el-input>
          </el-form-item>
          <el-form-item prop="name" label="角色列表">
            <el-checkbox
              v-model="roleCheckAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedRoleChange"
            >
              <el-checkbox
                v-for="role in roleList"
                :key="role.id"
                :label="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="roleCancel">取消</el-button>
        <el-button type="primary" @click="roleSave">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  reqGetUserList,
  reqAddOrUpdateUser,
  reqGetRoleList,
  reqAssignRole,
  reqRemoveUser,
  reqBatchRemoveUser,
} from '@/api/acl/user'
import {
  IUserListResponse,
  IUser,
  IRoleListResponse,
  IRole,
  IAssignRoleParams,
} from '@/api/acl/user/type'
import { CodeStatus } from '@/utils/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'

defineOptions({
  name: 'User',
})

// 用户仓库
const userStore = useUserStore()
// layout 设置仓库
const settingStore = useLayoutSettingStore()

// 添加或修改用户表单实例
let userFormRef = ref<any>(null)

// 分页数据
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// 用户列表
let userList = ref<IUser[]>([])

// 添加或修改的抽屉是否显示
let isShowAddOrUpdateDrawer = ref<boolean>(false)

// 添加或修改用户的表单数据
let userParams = reactive<IUser>({
  username: '',
  password: '',
  name: '',
})

// 角色列表是否全选
const roleCheckAll = ref<boolean>(false)
const isIndeterminate = ref(true)

// 表单校验规则
const userFormRules = reactive<FormRules<IUser>>({
  username: [
    { required: true, message: '请输入用户姓名' },
    { min: 4, max: 16, message: '用户姓名长度为4-16位' },
  ],
  password: [
    { required: true, message: '请输入用户密码' },
    { min: 4, max: 16, message: '密码长度为6-16位' },
  ],
  name: [
    { required: true, message: '请输入用户昵称' },
    { min: 4, max: 16, message: '用户昵称长度为4-16位' },
  ],
})

// 原始用户名，用于保存修改之前的用户名
let originalUsername = ref<string>('')

// 分配角色抽屉是否显示
let isShowRoleDrawer = ref<boolean>(false)

// 分配角色表单
let roleParams = reactive<IUser>({})

// 用户已有的角色
let userRole = ref<IRole[]>([])
// 可选角色列表
let roleList = ref<IRole[]>([])

// 表格多选框选择的用户
let selectUserList = ref<IUser[]>([])

// 搜索关键字
let searchKeyWord = ref<string>('')

// 每页显示数据数变化
const handleSizeChange = () => {
  getUserList()
}

// 当前页数变化
const handleCurrentChange = (pager: number) => {
  getUserList(pager)
}

// 获取用户列表
const getUserList = async (pager: number = 1) => {
  pageNo.value = pager

  const res: IUserListResponse = await reqGetUserList(
    pager,
    pageSize.value,
    searchKeyWord.value,
  )
  if (res.code === CodeStatus.SUCCESS) {
    userList.value = res.data.records
    total.value = res.data.total
  }
}

// 初始化参数
const initParams = () => {
  Object.assign(userParams, {
    username: '',
    password: '',
    name: '',
  })

  if (userParams.id) delete userParams.id
}

// 添加用户
const addUser = () => {
  // 初始化参数
  initParams()

  isShowAddOrUpdateDrawer.value = true
}

const updateUserBefore = (row: IUser) => {
  originalUsername.value = row.username as string

  if (row.username == userStore.userInfo.name) {
    ElMessageBox.confirm(
      '修改正在登录的用户将会被强制退出登录, 是否继续?',
      '警告',
      {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )
      .then(() => {
        updateUser(row)
      })
      .catch(() => {
        return
      })
  } else {
    updateUser(row)
  }
}

// 修改用户
const updateUser = (row: IUser) => {
  // 初始化参数
  initParams()
  delete userParams.password

  // 收集用户信息
  Object.assign(userParams, {
    id: row.id,
    username: row.username,
    name: row.name,
  })
  isShowAddOrUpdateDrawer.value = true
}

// 确定按钮
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  // 表单校验
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res: any = await reqAddOrUpdateUser(userParams)

      if (res.code === CodeStatus.SUCCESS) {
        ElMessage.success(userParams.id ? '修改成功' : '添加成功')
        isShowAddOrUpdateDrawer.value = false

        // 如果修改的是当前登录的用户，则刷新页面
        if (originalUsername.value === userStore.userInfo.name) {
          window.location.reload()
        }

        getUserList(userParams.id ? pageNo.value : 1)
      } else {
        ElMessage.error(userParams.id ? '修改失败' : '添加失败')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 取消按钮
const cancel = () => {
  isShowAddOrUpdateDrawer.value = false
}

// 抽屉关闭
const drawerClose = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
}

// 分配角色
let setRole = async (row: IUser) => {
  Object.assign(roleParams, row)

  const res: IRoleListResponse = await reqGetRoleList(row.id as number)

  if (res.code === CodeStatus.SUCCESS) {
    userRole.value = res.data.assignRoles
    roleList.value = res.data.allRolesList

    isIndeterminate.value =
      userRole.value.length > 0 &&
      userRole.value.length !== roleList.value.length

    isShowRoleDrawer.value = true
  }
}

const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? roleList.value : []
  isIndeterminate.value = false
}

const handleCheckedRoleChange = (value: string[]) => {
  const checkedCount = value.length
  roleCheckAll.value = checkedCount === roleList.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < roleList.value.length
}

// 分配角色抽屉关闭
const roleCancel = () => {
  isShowRoleDrawer.value = false
}

// 分配角色抽屉确定
const roleSave = async () => {
  const params: IAssignRoleParams = {
    userId: roleParams.id as number,
    roleIdList: userRole.value.map((item) => item.id),
  }

  const res: any = await reqAssignRole(params)

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('分配角色成功')
    isShowRoleDrawer.value = false

    getUserList(pageNo.value)
  } else {
    ElMessage.error('分配角色失败')
  }
}

// 删除单个用户
const deleteUser = async (row: IUser) => {
  const res = await reqRemoveUser(row.id as number)

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('删除成功')
    getUserList(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}

// 表格多选框变化
const handleTableSelectionChange = (val: IUser[]) => {
  selectUserList.value = val
}

// 批量删除用户
const batchRemoveUser = async () => {
  const res = await reqBatchRemoveUser(
    selectUserList.value
      .map((item) => item.id)
      .filter((id): id is number => id !== null && id !== undefined),
  )

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage.success('删除成功')
    getUserList(
      userList.value.length - selectUserList.value.length > 0
        ? pageNo.value
        : pageNo.value - 1,
    )
  } else {
    ElMessage.error('删除失败')
  }
}

// 重置
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

// 搜索
const search = () => {
  getUserList()
}

onMounted(() => {
  getUserList()
})
</script>

<style scoped lang="scss">
.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
