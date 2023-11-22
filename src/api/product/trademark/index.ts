// 品牌管理模块接口
import request from '@/utils/request'
import type {
  ITrademarkListParams,
  ITrademarkListResponse,
  IAddOrUpdateTrademarkParams,
} from './type'

// 接口
enum API {
  // 获取品牌列表
  GET_TRADEMARK_LIST = '/admin/product/baseTrademark/getTrademarkList',
  // 删除品牌
  TRADEMARK_REMOVE = '/admin/product/baseTrademark/remove',
  // 新增品牌
  TRADEMARK_ADD = '/admin/product/baseTrademark/save',
  // 修改品牌
  TRADEMARK_UPDATE = '/admin/product/baseTrademark/update',
  // 根据关键词搜索品牌
  GET_TRADEMARK_LIST_BY_KEYWORD = '/admin/product/baseTrademark/findBaseTrademarkByKeyword',
  // 根据品牌id获取品牌信息
  GET_TRADEMARK_BY_ID = '/admin/product/baseTrademark/get',
  // 根据 idList 获取品牌列表
  GET_TRADEMARK_BY_ID_LIST = '/admin/product/baseTrademark/inner/findBaseTrademarkByTrademarkIdList',
  // 分页获取品牌列表
  GET_TRADEMARK_LIST_BY_PAGE_URP = '/admin/product/baseTrademark/',
}

export const reqTrademarkList = (params: ITrademarkListParams) =>
  request.get<any, ITrademarkListResponse>(
    API.GET_TRADEMARK_LIST_BY_PAGE_URP + `${params.page}/${params.limit}`,
  )

// 添加或修改品牌
export const reqAddOrUpdateTrademark = (data: IAddOrUpdateTrademarkParams) => {
  if (data.id) {
    return request.put<any, any>(API.TRADEMARK_UPDATE, data)
  } else {
    return request.post<any, any>(API.TRADEMARK_ADD, data)
  }
}

// 删除品牌
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.TRADEMARK_REMOVE + `/${id}`)
