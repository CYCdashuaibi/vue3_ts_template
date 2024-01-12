import request from '@/utils/request'
import { ISkuListResponse } from './type'

enum API {
  GET_SKU_LIST_URL = '/admin/product/list',
}

export const reqGetSkuList = (page: number, limit: number) =>
  request.get<any, ISkuListResponse>(`${API.GET_SKU_LIST_URL}/${page}/${limit}`)
