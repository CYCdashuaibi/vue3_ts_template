// 属性相关的 API
import request from '@/utils/request'
import {
  ICategory1Response,
  ICategory2Response,
  ICategory3Response,
  IAttrListParams,
  IAttrListResponse,
  IAttr,
} from './type'

// 属性管理模块接口地址
enum API {
  CATEGORY1_URL = '/admin/product/getCategory1',
  CATEGORY2_URL = '/admin/product/getCategory2',
  CATEGORY3_URL = '/admin/product/getCategory3',
  GET_ATTR_LIST_URL = '/admin/product/attrInfoList',
  ADD_OR_UPDATE_ATTR_URL = '/admin/product/saveAttrInfo',
  DELETE_ATTR_URL = '/admin/product/deleteAttr',
}

// 获取一级分类
export const reqCategory1 = () =>
  request.get<any, ICategory1Response>(API.CATEGORY1_URL)

// 获取二级分类
export const reqCategory2 = (category1Id: number) =>
  request.get<any, ICategory2Response>(API.CATEGORY2_URL + `/${category1Id}`)

// 获取三级分类
export const reqCategory3 = (category2Id: number) =>
  request.get<any, ICategory3Response>(API.CATEGORY3_URL + `/${category2Id}`)

// 获取属性列表
export const reqAttrList = (params: IAttrListParams) =>
  request.get<any, IAttrListResponse>(
    API.GET_ATTR_LIST_URL +
      `/${params.category1Id}/${params.category2Id}/${params.category3Id}`,
  )

// 新增或修改已有的属性接口
export const reqAddOrUpdateAttr = (data: IAttr) =>
  request.post<any, any>(API.ADD_OR_UPDATE_ATTR_URL, data)

// 删除属性
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(`${API.DELETE_ATTR_URL}/${attrId}`)
