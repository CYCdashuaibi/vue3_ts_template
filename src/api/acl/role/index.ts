import request from '@/utils/request'
import { IRole, IRoleListResponse } from './type'

enum API {
  // 获取角色列表
  GET_ROLE_LIST_URL = '/admin/acl/role/',
  // 新增角色
  ADD_ROLE_URL = '/admin/acl/role/save',
  // 修改角色
  UPDATE_ROLE_URL = '/admin/acl/role/update',
}

export const reqGetRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, IRoleListResponse>(
    `${API.GET_ROLE_LIST_URL}/${page}/${limit}/?roleName=${encodeURIComponent(
      roleName,
    )}`,
  )

export const reqAddOrUpdateRole = (data: IRole) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_ROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADD_ROLE_URL, data)
  }
}
