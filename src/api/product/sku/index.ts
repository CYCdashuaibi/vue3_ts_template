import request from '@/utils/request'
import { ISkuListResponse, ISkuInfoResponse } from './type'

enum API {
  GET_SKU_LIST_URL = '/admin/product/list',
  // 下架商品
  CANCEL_SALE_URL = '/admin/product/cancelSale',
  // 上架商品
  ON_SALE_URL = '/admin/product/onSale',
  // 获取商品详情
  SKU_INFO_URL = '/admin/product/getSkuInfo',
  // 删除商品
  DELETE_SKU_URL = '/admin/product/deleteSku',
}

export const reqGetSkuList = (page: number, limit: number) =>
  request.get<any, ISkuListResponse>(`${API.GET_SKU_LIST_URL}/${page}/${limit}`)

export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(`${API.CANCEL_SALE_URL}/${skuId}`)

export const reqOnSale = (skuId: number) =>
  request.get<any, any>(`${API.ON_SALE_URL}/${skuId}`)

export const reqGetSkuInfo = (skuId: number) =>
  request.get<any, ISkuInfoResponse>(`${API.SKU_INFO_URL}/${skuId}`)

export const reqDeleteSku = (skuId: number) =>
  request.delete<any, any>(`${API.DELETE_SKU_URL}/${skuId}`)
