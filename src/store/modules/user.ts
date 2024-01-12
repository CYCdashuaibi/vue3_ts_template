import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
  ILoginParams,
  ILoginResult,
  IUserInfoResult,
  ILogoutResult,
} from '@/api/user/type'
import { CodeStatus } from '@/utils/common'
import { IUserState, IUserInfo } from './types'
import {
  SET_TOKEN,
  GET_TOKEN,
  REMOVE_TOKEN,
  // SET_USER_INFO,
  // GET_USER_INFO,
  // REMOVE_USER_INFO,
} from '@/utils/localStorage'
// 引入常量路由
import { constantRoutes } from '@/router/routes'
import { ElMessage } from 'element-plus'

// 创建用户仓库
const useUserStore = defineStore('User', {
  // 存储数据
  state: (): IUserState => {
    return {
      token: GET_TOKEN() || '',
      menuRoutes: constantRoutes,
      // userInfo: JSON.parse(GET_USER_INFO() as string) || {},
      userInfo: {},
    }
  },
  // 异步 | 逻辑
  actions: {
    // 用户登录方法
    async userLogin(data: ILoginParams) {
      const res: ILoginResult = await reqLogin(data)
      if (res.code === CodeStatus.SUCCESS) {
        this.token = res.data as string
        // 将token存储到本地
        SET_TOKEN(res.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
    // 获取用户信息
    async getUserInfo() {
      const res: IUserInfoResult = await reqUserInfo()
      if (res.code === CodeStatus.SUCCESS) {
        this.userInfo = res.data as IUserInfo
        // 将用户信息存储到本地
        // SET_USER_INFO(JSON.stringify(res.data))
        return res.data
      } else {
        ElMessage.error(res.message)
        return Promise.reject(new Error(res.message))
      }
    },
    // 退出登录
    async userLogout() {
      const res: ILogoutResult = await reqLogout()
      if (res.code === CodeStatus.SUCCESS) {
        this.token = ''
        this.userInfo = {}
        // 清除本地存储
        REMOVE_TOKEN()
        // REMOVE_USER_INFO()
      } else {
        return Promise.reject(new Error(res.message))
      }
    },
  },
  getters: {},
})

// 导出用户仓库
export default useUserStore
