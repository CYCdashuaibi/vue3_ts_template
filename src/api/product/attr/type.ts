// 属性相关的 ts 类型
export interface IResponse {
  code: number
  message: string
  ok: boolean
}

// 一级分类数据类型
export interface ICategory1 {
  id: number
  createTime: string
  updateTime: string
  name: string
}

export interface ICategory1Response extends IResponse {
  data: Array<ICategory1>
}

// 二级分类数据类型
export interface ICategory2 {
  id: number
  createTime: string
  updateTime: string
  name: string
  category1Id: number
}

export interface ICategory2Response extends IResponse {
  data: Array<ICategory2>
}

// 三级分类数据类型
export interface ICategory3 {
  id: number
  createTime: string
  updateTime: string
  name: string
  category2Id: number
}

export interface ICategory3Response extends IResponse {
  data: Array<ICategory3>
}

// 获取属性列表请求参数类型
export interface IAttrListParams {
  category1Id: number | null
  category2Id: number | null
  category3Id: number | null
}

// 属性值数据类型
export interface IAttrValue {
  id?: number
  valueName: string
  attrId?: number
}

// 属性列表数据类型
export interface IAttr {
  id?: number
  categoryId: number | string
  attrName: string
  categoryLevel: number
  attrValueList: Array<IAttrValue>
  attrIdAndValueId?: string
}

// 属性列表返回数据类型
export interface IAttrListResponse extends IResponse {
  data: Array<IAttr>
}
