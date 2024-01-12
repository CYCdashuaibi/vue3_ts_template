<template>
  <div class="login-container">
    <el-row style="width: 100%">
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          class="login-form"
        >
          <h1>Hello</h1>
          <h2>欢迎来到超品甄选</h2>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :prefix-icon="Lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-btn"
              type="primary"
              size="default"
              @click="login(loginFormRef)"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
import type { FormInstance, FormRules } from 'element-plus'
import { ILoginForm } from './types'

defineOptions({
  name: 'Login',
})

// 用户信息
const userStore = useUserStore()
// 获取路由器
const $router = useRouter()
const $route = useRoute()

// 控制按钮加载效果
const loading = ref<boolean>(false)

// 登录表单
let loginForm = reactive<ILoginForm>({
  username: '',
  password: '',
})

// 用户名校验规则
// @ts-expect-error 用于忽略ts校验
const validateUsername = (rule: any, value: any, callback: any) => {
  // rule: 当前校验规则
  // value: 当前输入框的值
  // callback: 回调函数 符合规则调用callback() 不符合规则调用callback(new Error('错误信息'))
  if (!value) {
    return callback(new Error('请输入用户名'))
  }
  if (value.length < 4 || value.length > 16) {
    return callback(new Error('用户名长度为4-16位'))
  }
  callback()
}

// 密码校验规则
// @ts-expect-error 用于忽略ts校验
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (value.length < 6 || value.length > 16) {
    return callback(new Error('密码长度为6-16位'))
  }
  callback()
}

// 登录表单校验规则
const loginFormRules = reactive<FormRules>({
  username: [{ validator: validateUsername, trigger: 'change' }],
  password: [{ validator: validatePassword, trigger: 'change' }],
})

// 获取表单实例
const loginFormRef = ref<FormInstance>()

// 登录按钮回调
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        // 调用登录接口
        await userStore.userLogin(loginForm)
        // 获取用户信息
        await userStore.getUserInfo()
        // 编程式导航跳转至展示数据首页
        const redirect = $route.query.redirect as string
        console.log(redirect)
        $router.push({ path: redirect || '/' })
        ElNotification({
          title: `Hi, ${getTime()}好！`,
          message: '欢迎回来',
          type: 'success',
        })
      } catch (error: any) {
        ElNotification({
          message: error.message,
          type: 'error',
        })
      } finally {
        loading.value = false
      }
    } else {
      console.info('error submit!!', fields)
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  min-height: 100vh;
  background: url('@/assets/images/background.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;

  .login-form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: #fff;
      font-size: 40px;
    }

    h2 {
      color: #fff;
      font-size: 20px;
      margin: 20px 0;
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>
