export interface IResponse {
  code: number
  message: string
  ok: boolean
}

export interface IAttrValue {
  id?: number
  attrId: number | null
  valueId: number | null
  valueName: string
}

export interface ISaleAttrValue {
  id: number
  saleAttrId: number | null
  saleAttrValueId: number | null
  saleAttrName: string
}

// 商品图片类型
export interface ISpuImg {
  id?: number | null
  createTime?: string
  updateTime?: string
  spuId?: number | null
  imgName?: string
  imgUrl?: string
}

// SKU 对象类型
export interface ISkuData {
  id?: number
  category3Id: number | null
  spuId: number | null
  tmId: number | null
  skuName: string
  isSale: number | null
  price: number | null
  weight: number | null
  skuDesc: string
  skuDefaultImg: string
  skuAttrValueList?: IAttrValue[]
  skuSaleAttrValueList?: ISaleAttrValue[]
  skuImageList?: ISpuImg[]
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

// 获取 SKU 商品信息接口返回类型
export interface ISkuInfoResponse extends IResponse {
  data: ISkuData
}
