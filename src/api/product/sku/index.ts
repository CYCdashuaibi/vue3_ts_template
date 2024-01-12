import request from '@/utils/request'
import { ISkuListResponse } from './type'

enum API {
  GET_SKU_LIST_URL = '/admin/product/list',
  // 下架商品
  CANCEL_SALE_URL = '/admin/product/cancelSale',
  // 上架商品
  ON_SALE_URL = '/admin/product/onSale',
}

export const reqGetSkuList = (page: number, limit: number) =>
  request.get<any, ISkuListResponse>(`${API.GET_SKU_LIST_URL}/${page}/${limit}`)

export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(`${API.CANCEL_SALE_URL}/${skuId}`)

export const reqOnSale = (skuId: number) =>
  request.get<any, any>(`${API.ON_SALE_URL}/${skuId}`)
