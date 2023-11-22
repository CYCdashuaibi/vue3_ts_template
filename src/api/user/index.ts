// 统一管理用户相关的接口
import request from '@/utils/request'
import type {
  ILoginParams,
  ILoginResult,
  IUserInfoResult,
  ILogoutResult,
} from './type'

enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USER_INFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 登录接口
export const reqLogin = (data: ILoginParams) =>
  request.post<any, ILoginResult>(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserInfo = () =>
  request.get<any, IUserInfoResult>(API.USER_INFO_URL)

// 退出登录
export const reqLogout = () => request.post<any, ILogoutResult>(API.LOGOUT_URL)
