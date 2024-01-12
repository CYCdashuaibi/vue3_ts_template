<template>
  <div class="container">
    <!-- 搜索 -->
    <el-card style="height: 75px">
      <el-form inline class="search-form">
        <el-form-item label="用户名">
          <el-input placeholder="请输入搜索关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button style="color: #409eff">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 内容 -->
    <el-card style="margin: 10px 0">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button type="danger">批量删除</el-button>

      <!-- 用户列表表格 -->
      <el-table :data="userList" border style="margin: 10px 0">
        <el-table-column
          type="selection"
          width="50px"
          align="center"
        ></el-table-column>
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
          prop="username"
          align="center"
          label="用户姓名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="用户昵称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="roleName"
          align="center"
          label="用户角色"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          align="center"
          label="更新时间"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column width="270px" align="center" label="操作">
          <template #default="scope">
            <el-button icon="User" size="small" type="primary">
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
            <el-button icon="Delete" size="small" type="danger">删除</el-button>
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
      v-model="isShowDrawer"
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { reqGetUserList, reqAddOrUpdateUser } from '@/api/acl/user'
import { IUserListResponse, IUser } from '@/api/acl/user/type'
import { CodeStatus } from '@/utils/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import useUserStore from '@/store/modules/user'

// 用户仓库
const userStore = useUserStore()

defineOptions({
  name: 'User',
})

// 添加或修改用户表单实例
let userFormRef = ref<any>(null)

// 分页数据
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

// 用户列表
let userList = ref<IUser[]>([])

// 添加或修改的抽屉是否显示
let isShowDrawer = ref<boolean>(false)

// 添加或修改用户的表单数据
let userParams = reactive<IUser>({
  username: '',
  password: '',
  name: '',
})

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

  const res: IUserListResponse = await reqGetUserList(pager, pageSize.value)
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

  isShowDrawer.value = true
}

const updateUserBefore = (row: IUser) => {
  originalUsername.value = row.username

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
  isShowDrawer.value = true
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
        isShowDrawer.value = false

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
  isShowDrawer.value = false
}

// 抽屉关闭
const drawerClose = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
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
