import request from '@/utils/request'
import type {
  ISpuListResponseData,
  IAllTrademarkResponseData,
  ISpuImgResponseData,
  ISpuSaleAttrResponseData,
  ISaleAttrResponseData,
  ISpuData,
  ISkuData,
  ISkuListResponse,
} from './type'

enum API {
  SPU_LIST_URL = '/admin/product',
  // 获取全部品牌的数据
  ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个SPU下的全部售卖商品的图片
  SPU_IMAGE_LIST_URL = '/admin/product/spuImageList',
  // 获取某个SPU的销售属性
  SPU_SALE_ATTR_LIST_URL = '/admin/product/spuSaleAttrList',
  // 获取全部的销售属性
  ALL_SALE_ATTR_LIST_URL = '/admin/product/baseSaleAttrList',
  // 新增SPU
  SAVE_SPU_URL = '/admin/product/saveSpuInfo',
  // 修改SPU
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo',
  // 新增SKU
  SAVE_SKU_URL = '/admin/product/saveSkuInfo',
  // 根据 spuId 获取 sku 列表
  GET_SKU_LIST_BY_SPU_ID_URL = '/admin/product/findBySpuId',
  // 删除 SPU
  DELETE_SPU_URL = '/admin/product/deleteSpu',
}

export const reqGetSpuList = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, ISpuListResponseData>(
    `${API.SPU_LIST_URL}/${page}/${limit}?category3Id=${category3Id}`,
  )

export const reqAllTrademark = () =>
  request.get<any, IAllTrademarkResponseData>(API.ALL_TRADEMARK_URL)

export const reqSpuImageList = (spuId: number) =>
  request.get<any, ISpuImgResponseData>(`${API.SPU_IMAGE_LIST_URL}/${spuId}`)

export const reqSpuSaleAttrList = (spuId: number) =>
  request.get<any, ISpuSaleAttrResponseData>(
    `${API.SPU_SALE_ATTR_LIST_URL}/${spuId}`,
  )

export const reqAllSaleAttrList = () =>
  request.get<any, ISaleAttrResponseData>(`${API.ALL_SALE_ATTR_LIST_URL}`)

export const reqSaveOrUpdateSpu = (data: ISpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATE_SPU_URL, data)
  } else {
    return request.post<any, any>(API.SAVE_SPU_URL, data)
  }
}

export const reqSaveSku = (data: ISkuData) =>
  request.post<any, any>(API.SAVE_SKU_URL, data)

export const reqGetSkuListBySpuId = (spuId: number) =>
  request.get<any, ISkuListResponse>(
    `${API.GET_SKU_LIST_BY_SPU_ID_URL}/${spuId}`,
  )

export const reqDeleteSpu = (spuId: number) =>
  request.delete<any, any>(`${API.DELETE_SPU_URL}/${spuId}`)
