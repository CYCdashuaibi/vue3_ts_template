// layout 组件相关配置
import { defineStore } from 'pinia'
import { ISettingState } from './types'
import { systemMode } from '@/utils/util'

const useLayoutSettingStore = defineStore('Setting', {
  state: (): ISettingState => {
    return {
      fold: false, // 是否折叠菜单
      refresh: false, // 是否刷新页面
      dark: localStorage.getItem('dark')
        ? localStorage.getItem('dark') == '1'
          ? true
          : false
        : systemMode(),
    }
  },
  actions: {
    updateDark(dark: boolean) {
      this.dark = dark
    },
  },
})

export default useLayoutSettingStore
