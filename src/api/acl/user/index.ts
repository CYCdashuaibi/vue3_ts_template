import request from '@/utils/request'
import { IUserListResponse, IUser } from './type'

enum API {
  // 获取用户列表
  GET_USER_LIST = '/admin/acl/user',
  // 新增用户
  ADD_USER_URL = '/admin/acl/user/save',
  // 修改用户
  UPDATE_USER_URL = '/admin/acl/user/update',
}

export const reqGetUserList = (page: number, limit: number) =>
  request.get<any, IUserListResponse>(`${API.GET_USER_LIST}/${page}/${limit}`)

export const reqAddOrUpdateUser = (user: IUser) => {
  if (user.id) {
    return request.put<any, any>(API.UPDATE_USER_URL, user)
  } else {
    return request.post<any, any>(API.ADD_USER_URL, user)
  }
}
