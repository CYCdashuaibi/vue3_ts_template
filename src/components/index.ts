// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
import { App, Component } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 定义一个类型，描述包含所有全局组件的对象
interface IGlobalComponents {
  [key: string]: Component
}

const allGloablComponents: IGlobalComponents = { SvgIcon, Pagination, Category }

// 向暴露插件对象
export default {
  // 必须叫install
  install(app: App) {
    // 注册项目全部的全局组件
    Object.keys(allGloablComponents).forEach((key: string) => {
      // 注册为全局组件
      app.component(key, allGloablComponents[key])
    })
    // 注册element-plus的图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
