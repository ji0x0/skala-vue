import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 오피넷은 CORS 헤더를 내려주지 않아 브라우저에서 직접 호출할 수 없다.
      // 개발 서버에서는 Vite 프록시로, 배포 환경에서는 vercel.json rewrite로 우회한다.
      '/api/opinet': {
        target: 'https://www.opinet.co.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/opinet/, '/api'),
      },
    },
  },
})
