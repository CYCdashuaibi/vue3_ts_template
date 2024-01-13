export interface IResponse {
  code: number
  message: string
  ok: boolean
}

// c菜单数据类型
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

// 获取菜单列表接口返回的数据类型
export interface IGetPermissionResponse extends IResponse {
  data: IPermission[]
}

// 新增或修改菜单携带的参数类型
export interface IPermissionParams {
  id?: number
  code: string
  level: number | null
  name: string
  pid: number | null
}
