import request from '@/utils/request'
import { IRole, IRoleListResponse, IGetPermissionResponse } from './type'

enum API {
  // 获取角色列表
  GET_ROLE_LIST_URL = '/admin/acl/role/',
  // 新增角色
  ADD_ROLE_URL = '/admin/acl/role/save',
  // 修改角色
  UPDATE_ROLE_URL = '/admin/acl/role/update',
  // 根据角色获取菜单
  GET_PERMISSION_URL = '/admin/acl/permission/toAssign',
  // 给角色分配权限
  ASSIGN_PERMISSION_UER = '/admin/acl/permission/doAssign',
  // 删除角色
  REMOVE_ROLE_URL = '/admin/acl/role/remove',
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

export const reqGetPermission = (roleId: number) =>
  request.get<any, IGetPermissionResponse>(
    `${API.GET_PERMISSION_URL}/${roleId}`,
  )

export const reqAssignPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    `${API.ASSIGN_PERMISSION_UER}/?roleId=${roleId}&permissionId=${permissionId}`,
  )

export const reqRemoveRole = (id: number) =>
  request.delete<any, any>(`${API.REMOVE_ROLE_URL}/${id}`)
