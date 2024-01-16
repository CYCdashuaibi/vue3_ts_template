import router from '@/router'
// 引入 nprogress 插件与样式
// @ts-expect-error 编译识别不到包报错
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from '@/store'
import useUserStore from '@/store/modules/user'
import setting from '@/setting'

// 去掉进度条小圆圈
nprogress.configure({ showSpinner: false })

// 用户仓库
const userStore = useUserStore(pinia)

const whiteList = ['/login']

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 更改页面标题
  document.title = `${setting.title}-${to.meta.title}`

  // 是否登录
  const isLogin = userStore.token ? true : false

  nprogress.start()

  // 已登录不能访问登录页面
  if (isLogin) {
    if (to.path === '/login') {
      next(from.path)
    } else {
      if (Object.keys(userStore.userInfo).length) {
        next()
      } else {
        try {
          await userStore.getUserInfo()
          next({ ...to, replace: true })
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
      // next()
    }
  }
})

// 全局解析守卫
router.afterEach(() => {
  nprogress.done()
})
