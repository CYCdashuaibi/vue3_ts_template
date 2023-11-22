import { UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入 svg 需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      // svg 图标配置代码
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: 'mock', // Mock 文件存放的路径
        localEnabled: command === 'serve', // 仅在本地开发环境启用 Mock
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // scss 全局变量
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "@/styles/variable.scss";`,
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        // 需要跨域的 key 为 vite.config.ts 中的 VITE_APP_BASE_API
        [env.VITE_APP_BASE_API]: {
          // 代理目标地址
          target: env.VITE_SERVE,
          // 允许跨域
          changeOrigin: true,
          // 重写路径
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
}
