import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'service-worker-handler',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/service-worker.js') {
            const swPath = resolve(__dirname, 'src/pwa/service-worker.js')
            res.setHeader('Content-Type', 'application/javascript')
            res.end(readFileSync(swPath, 'utf-8'))
            return
          }
          next()
        })
      },
      closeBundle() {
        const src = resolve(__dirname, 'src/pwa/service-worker.js')
        const dest = resolve(__dirname, 'dist/service-worker.js')
        if (existsSync(src)) {
          copyFileSync(src, dest)
        }
      },
    },
  ],
})
