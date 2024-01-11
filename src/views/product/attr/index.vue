<template>
  <div>
    <!-- 分类选择器 -->
    <Category
      :scene="scene"
      v-model:addBtnDisabled="addBtnDisabled"
      @category-change="categoryChange"
    />
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          @click="addAttr"
          type="primary"
          :disabled="addBtnDisabled"
          icon="Plus"
        >
          添加属性
        </el-button>
        <el-table :data="attrList" border style="margin: 10px 0">
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="200px"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="attrValueList" label="属性值名称">
            <template #default="scope">
              <el-tag
                v-for="item in scope.row.attrValueList"
                :key="item.id"
                style="margin: 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                icon="Edit"
                size="small"
                @click="updateAttr(scope.row)"
              >
                编辑
              </el-button>
              <el-popconfirm
                title="确认删除该属性吗?"
                @confirm="deleteAttr(scope.row.id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              v-model="attrParams.attrName"
              placeholder="请输入属性名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="Plus"
          @click="addAttrValue"
          :disabled="!attrParams.attrName"
        >
          添加属性值
        </el-button>
        <el-button @click="addCancel">取消</el-button>
        <el-table
          border
          :data="attrParams.attrValueList"
          style="margin: 10px 0"
        >
          <el-table-column
            label="序号"
            type="index"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #default="{ row, $index }">
              <el-input
                :ref="(el: any) => (inputArr[$index] = el)"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值名称"
                v-model.trim="row.valueName"
                size="small"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="{ $index }">
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="!attrParams.attrValueList.length || !isVerify"
        >
          保存
        </el-button>
        <el-button @click="addCancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  reqAttrList,
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '@/api/product/attr'
import {
  IAttrListParams,
  IAttr,
  IAttrListResponse,
  IAttrValue,
} from '@/api/product/attr/type'
import { CodeStatus } from '@/utils/common'
import { ElMessage } from 'element-plus'
import { ref, reactive, nextTick } from 'vue'

defineOptions({
  name: 'Attr',
})

const attrList = ref<IAttr[]>([])
let scene = ref<number>(0)
let addBtnDisabled = ref<boolean>(true)

// 当前选择的分类三个级别的分类id
let attrIdObj = ref<IAttrListParams>({
  category1Id: null,
  category2Id: null,
  category3Id: null,
})

// 收集新增的属性的数据
let attrParams = reactive<IAttr>({
  attrName: '', // 新增的属性的名字
  attrValueList: [
    // 新增的属性值数组
  ],
  categoryId: '', // 三级分类的ID
  categoryLevel: 3, // 代表三级分类
})

// 存储 el-input 组件实例
let inputArr = ref<any>([])

// 表单验证是否通过
let isVerify = ref<boolean>(true)

const categoryChange = async (val: IAttrListParams) => {
  // 重置添加按钮的禁用状态
  addBtnDisabled.value = false
  // 重置平台属性列表
  attrList.value = []
  attrIdObj.value = val

  getAttrList()
}

// 获取平台属性列表
const getAttrList = async () => {
  const res: IAttrListResponse = await reqAttrList(attrIdObj.value)
  if (res.code === CodeStatus.SUCCESS) {
    attrList.value = res.data
  }
}

// 添加平台属性
const addAttr = () => {
  scene.value = 1

  // 每次点击，先清空数据，再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: attrIdObj.value.category3Id as number,
    categoryLevel: 3,
  })

  delete attrParams.value.id
}

// 添加属性值
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
  })

  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 编辑平台属性
const updateAttr = (data: IAttr) => {
  scene.value = 1
  Object.assign(attrParams, JSON.parse(JSON.stringify(data)))
}

// 取消添加
const addCancel = () => {
  scene.value = 0
}

// 保存
const save = async () => {
  const res = await reqAddOrUpdateAttr(attrParams)

  if (res.code == CodeStatus.SUCCESS) {
    // 切换场景
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })

    getAttrList()
  } else {
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 属性值表单元素失却焦点事件回调
const toLook = (row: IAttrValue, $index: number) => {
  // 输入框内容为空
  if (!row.valueName.trim()) {
    attrParams.attrValueList.splice($index, 1)

    ElMessage({
      type: 'error',
      message: '属性值名称不能为空',
    })
    return
  }

  // 输入框内容重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName == row.valueName
    }
  })

  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值名称不能为重复',
    })

    isVerify.value = false
    inputArr.value[$index].focus()
    return
  }
  isVerify.value = true
}

// 删除属性
const deleteAttr = async (attrId: number) => {
  let res: any = await reqRemoveAttr(attrId)

  if (res.code === CodeStatus.SUCCESS) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAttrList()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped></style>
