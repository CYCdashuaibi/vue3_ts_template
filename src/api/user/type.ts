// 所有接口返回的共同数据类型
export interface IResponse {
  code: number
  message: string
  ok: boolean
}

// 登录接口需要携带参数 ts 类型
export interface ILoginParams {
  username: string
  password: string
}

// 登录接口返回数据 ts 类型
export interface ILoginResult extends IResponse {
  data: string
}

// 获取用户信息接口返回数据 ts 类型
export interface IUserInfoResult extends IResponse {
  data: {
    routes: Array<string>
    buttons: Array<string>
    roles: Array<string>
    name: string
    avatar: string
  }
}

// 退出登录返回数据类型
export interface ILogoutResult extends IResponse {
  data: any
}
