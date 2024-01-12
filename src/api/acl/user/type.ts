export interface IResponse {
  code: number
  message: string
  ok: boolean
}

// 用户数据类型
export interface IUser {
  id?: number | null
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: string | null
  roleName?: string
}

// 用户列表接口返回的数据类型
export interface IUserListResponse extends IResponse {
  data: {
    records: IUser[]
    total: number
    size: number
    current: number
    pages: number
  }
}
