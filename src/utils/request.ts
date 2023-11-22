// 进行 axios 二次封装：使用请求和响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'

// 创建 axios 实例
// axios.create() 与 导入的 axios 一样，可以创建一个 axios 实例，该实例具有自己的配置
const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  // 超时时间
  timeout: 5000,
})

// 添加请求拦截器
request.interceptors.request.use((config) => {
  const userStore = useUserStore()

  if (userStore.token) {
    config.headers.token = userStore.token
  }

  // config 配置对象，headers 请求头对象，可以给服务器端携带公共参数
  // 返回配置对象
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 错误信息
    let message = ''
    // 错误状态码
    const status = error.response?.status

    switch (status) {
      case 400:
        message = '请求参数错误'
        break
      case 401:
        message = '登录过期，请重新登录'
        // 清除 token
        useUserStore().userLogout()
        // 跳转到登录页面
        useRouter().push({
          path: '/login',
          query: { redirect: useRoute().path },
        })
        break
      case 403:
        message = '您暂时没有权限'
        break
      case 404:
        message = '请求失败，资源未找到'
        break
      case 408:
        message = '请求超时'
        break
      case 500:
        message = '服务器错误'
        break
      case 503:
        message = '服务器正在维护中'
        break
      default:
        message = '网络连接失败，请稍后再试'
        break
    }

    // 提示错误信息
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(new Error(message))
  },
)

export default request
