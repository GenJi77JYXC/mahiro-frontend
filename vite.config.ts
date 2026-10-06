import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 旧前端部署在 /legacy/ 路径下，生产构建需设置 base；
// 本地开发仍用根路径，不影响 dev 体验。
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/legacy/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}))