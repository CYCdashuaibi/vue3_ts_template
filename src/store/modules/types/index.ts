import type { RouteRecordRaw } from 'vue-router'
// 定义用户仓库类型
export interface IUserInfo {
  routes: Array<string>
  buttons: Array<string>
  roles: Array<string>
  name: string
  avatar: string
}

export interface IUserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  userInfo: IUserInfo | Record<string, never>
  userAsyncRoutes: RouteRecordRaw[]
}

// 定义设置仓库类型
export interface ISettingState {
  fold: boolean
  refresh: boolean
  dark: boolean
}
