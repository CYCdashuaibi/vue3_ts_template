import request from '@/utils/request'
import { IGetPermissionResponse, IPermissionParams } from './type'

enum API {
  // 获取菜单列表
  GET_PERMISSION_URL = '/admin/acl/permission',
  // 新增菜单
  ADD_PERMISSION_URL = '/admin/acl/permission/save',
  // 修改菜单
  UPDATE_PERMISSION_URL = '/admin/acl/permission/update',
  // 删除菜单
  REMOVE_PERMISSION_URL = '/admin/acl/permission/remove',
}

export const reqGetPermissionList = () =>
  request.get<any, IGetPermissionResponse>(API.GET_PERMISSION_URL)

export const reqAddOrUpdatePermission = (data: IPermissionParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_PERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADD_PERMISSION_URL, data)
  }
}

export const reqRemovePermission = (id: number) =>
  request.delete<any, any>(`${API.REMOVE_PERMISSION_URL}/${id}`)
