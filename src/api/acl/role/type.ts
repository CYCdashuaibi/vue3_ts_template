export interface IResponse {
  code: number
  message: string
  ok: boolean
}

// 角色数据类型
export interface IRole {
  id?: number
  createTime?: string
  updateTime?: string
  roleName?: string
  remark?: null
}

// 角色列表接口返回的数据类型
export interface IRoleListResponse extends IResponse {
  data: {
    records: IRole[]
    total: number
    size: number
    current: number
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 权限数据类型
export interface IPermission {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children: IPermission[]
  select: boolean
}

// 根据角色获取权限接口返回的数据类型
export interface IGetPermissionResponse extends IResponse {
  data: IPermission[]
}
