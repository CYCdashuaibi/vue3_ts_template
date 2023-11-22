export interface IResponse {
  code: number
  message: string
  ok: boolean
}

// 品牌列表数据类型
export interface ITrademark {
  id: number
  logoUrl: string
  tmName: string
  createTime: string
  updateTime: string
}

// 品牌列表返回数据类型
export interface ITrademarkListResponse extends IResponse {
  data: {
    records: ITrademark[]
    total: number
    size: number
    pages: number
    current: number
    searchCount: boolean
  }
}

// 品牌列表请求参数类型
export interface ITrademarkListParams {
  page: number
  limit: number
}

// 添加或修改品牌请求参数类型
export interface IAddOrUpdateTrademarkParams {
  id?: number
  logoUrl: string
  tmName: string
}
