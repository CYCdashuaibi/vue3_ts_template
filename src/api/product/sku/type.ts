export interface IResponse {
  code: number
  message: string
  ok: boolean
}

export interface IAttrValue {
  attrId: number | null
  valueId: number | null
}

export interface ISaleAttrValue {
  saleAttrId: number | null
  saleAttrValueId: number | null
}

// SKU 对象类型
export interface ISkuData {
  id?: number
  category3Id: number | null
  spuId: number | null
  tmId: number | null
  skuName: string
  isSale: number
  price: number | null
  weight: number | null
  skuDesc: string
  skuDefaultImg: string
  skuAttrValueList?: IAttrValue[]
  skuSaleAttrValueList?: []
}

// 获取 SKU 列表接口返回的数据类型
export interface ISkuListResponse extends IResponse {
  data: {
    records: ISkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}
