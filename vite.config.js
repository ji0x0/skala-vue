import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

/**
 * 개발 서버에서 api/ 폴더의 서버리스 함수를 그대로 실행하는 플러그인.
 *
 * 배포 환경(Vercel)은 api/*.js를 자동으로 함수로 띄우지만 개발 서버는 그렇지 않다.
 * 같은 파일을 미들웨어로 마운트해 로컬과 배포가 동일한 코드를 쓰게 만든다.
 * 덕분에 별도 도구 없이 `npm run dev` 만으로 개발할 수 있다.
 */
const serverlessApiPlugin = () => ({
  name: 'serverless-api-dev',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next()

      const requestUrl = new URL(req.url, 'http://localhost')
      const functionName = requestUrl.pathname.replace('/api/', '')

      // 경로 조작으로 다른 파일이 실행되지 않도록 이름을 제한한다.
      if (!/^[a-z0-9-]+$/.test(functionName)) return next()

      try {
        const module = await server.ssrLoadModule(`/api/${functionName}.js`)

        // Vercel 함수가 기대하는 최소한의 req/res 형태를 맞춰 준다.
        req.query = Object.fromEntries(requestUrl.searchParams)
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(data))
        }

        await module.default(req, res)
      } catch (error) {
        console.error(`[api/${functionName}] 실행 실패:`, error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ message: `api/${functionName} 실행에 실패했습니다.` }))
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 세 번째 인자를 빈 문자열로 주면 VITE_ 접두사가 없는 변수까지 읽는다.
  // 읽은 값은 process.env에만 넣으므로 클라이언트 번들에는 포함되지 않는다.
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
      vue(),
      vueDevTools(),
      serverlessApiPlugin(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
