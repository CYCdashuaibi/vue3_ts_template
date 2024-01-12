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

// 用户角色类型
export interface IRole {
  id: number
  createTime: string
  updateTime: string
  roleName: string
  remark: null
}

// 角色列表接口返回数据
export interface IRoleListResponse extends IResponse {
  data: {
    assignRoles: IRole[]
    allRolesList: IRole[]
  }
}

// 分配用户角色请求携带的参数类型
export interface IAssignRoleParams {
  roleIdList: number[]
  userId: number
}
