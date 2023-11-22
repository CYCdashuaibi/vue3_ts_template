// layout 组件相关配置
import { defineStore } from 'pinia'
import { ISettingState } from './types'

const useLayoutSettingStore = defineStore('Setting', {
  state: (): ISettingState => {
    return {
      fold: false, // 是否折叠菜单
      refresh: false, // 是否刷新页面
    }
  },
})

export default useLayoutSettingStore
