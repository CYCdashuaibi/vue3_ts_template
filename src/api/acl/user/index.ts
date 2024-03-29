import request from '@/utils/request'
import {
  IUserListResponse,
  IUser,
  IRoleListResponse,
  IAssignRoleParams,
} from './type'

enum API {
  // 获取用户列表
  GET_USER_LIST = '/admin/acl/user',
  // 新增用户
  ADD_USER_URL = '/admin/acl/user/save',
  // 修改用户
  UPDATE_USER_URL = '/admin/acl/user/update',
  // 根据用户获取角色数据
  GET_ROLE_LIST_URL = '/admin/acl/user/toAssign',
  // 给用户分配角色
  ASSIGN_ROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除单个用户
  REMOVE_USER_URL = '/admin/acl/user/remove',
  // 批量删除用户
  BATCH_REMOVE_USER_URL = '/admin/acl/user/batchRemove',
}

export const reqGetUserList = (page: number, limit: number, username: string) =>
  request.get<any, IUserListResponse>(
    `${API.GET_USER_LIST}/${page}/${limit}/?username=${encodeURIComponent(
      username,
    )}`,
  )

export const reqAddOrUpdateUser = (user: IUser) => {
  if (user.id) {
    return request.put<any, any>(API.UPDATE_USER_URL, user)
  } else {
    return request.post<any, any>(API.ADD_USER_URL, user)
  }
}

export const reqGetRoleList = (adminId: number) =>
  request.get<any, IRoleListResponse>(`${API.GET_ROLE_LIST_URL}/${adminId}`)

export const reqAssignRole = (data: IAssignRoleParams) =>
  request.post<any, any>(API.ASSIGN_ROLE_URL, data)

export const reqRemoveUser = (id: number) =>
  request.delete<any, any>(`${API.REMOVE_USER_URL}/${id}`)

export const reqBatchRemoveUser = (idList: number[]) =>
  request.delete<any, any>(API.BATCH_REMOVE_USER_URL, { data: idList })
