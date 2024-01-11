export interface IResponse {
  code: number
  message: string
  ok: boolean
}

// SPU数据的ts类型
export interface ISpuData {
  id?: number
  spuName: string
  description: string
  category3Id: number | string
  tmId: number | null
  spuSaleAttrList: null | ISpuSaleAttr[]
  spuImageList: null | ISpuImg[]
}

// SPU数组
export type IRecords = ISpuData[]

// 获取Spu列表接口返回的数据类型
export interface ISpuListResponseData extends IResponse {
  data: {
    records: IRecords
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌数据类型
export interface ITrademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据类型
export interface IAllTrademarkResponseData extends IResponse {
  data: ITrademark[]
}

// 商品图片类型
export interface ISpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}

// SPU图片接口返回的数据类型
export interface ISpuImgResponseData extends IResponse {
  data: ISpuImg[]
}

// 销售属性值对象的数据类型
export interface ISpuSaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 销售属性对象的数据类型
export interface ISpuSaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: ISpuSaleAttrValue[]
  isEdit?: boolean
  saleAttrValue?: string
}

// 销售属性列表接口返回的数据类型
export interface ISpuSaleAttrResponseData extends IResponse {
  data: ISpuSaleAttr[]
}

// 全部的 SPU 返回数据类型
export interface ISaleAttr {
  id: number
  name: string
  createTime: string
  updateTime: string
}

// 全部的 SPU 接口返回的数据类型
export interface ISaleAttrResponseData extends IResponse {
  data: ISaleAttr[]
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
  category3Id: number | null
  spuId: number | null
  tmId: number | null
  skuName: string
  price: number | null
  weight: number | null
  skuDesc: string
  skuDefaultImg: string
  skuAttrValueList?: IAttrValue[]
  skuSaleAttrValueList?: []
}

// 获取 SKU 列表接口返回的数据类型
export interface ISkuListResponse extends IResponse {
  data: ISkuData[]
}
