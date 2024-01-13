import { createApp } from 'vue'
import App from '@/App.vue'
// 引入模板的全局样式
import '@/styles/index.scss'
// 引入 element-plus 插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// svg 配置代码
import 'virtual:svg-icons-register'
// 安装全局组件的自定义插件
import globalComponents from '@/components'
// 配置 element-plus 的国际化
// @ts-expect-error 忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入路由
import router from './router'
// 导入仓库
import pinia from '@/store'
// 导入导航守卫
import '@/permission'
import 'default-passive-events'

const app = createApp(App)

app.use(ElementPlus, { locale: zhCn })

app.use(globalComponents)

// 挂载仓库
app.use(pinia)

// 注册模板路由
app.use(router)

app.mount('#app')
