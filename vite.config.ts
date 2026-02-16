import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Custom proxy plugin that forwards /api/proxy requests to the
 * user-configured API base URL (passed via X-Target-Base header).
 * This avoids CORS issues since the browser only talks to localhost.
 */
function apiProxyPlugin(): Plugin {
  return {
    name: 'api-proxy',
    configureServer(server) {
      server.middlewares.use('/api/proxy', async (req, res) => {
        const targetBase = req.headers['x-target-base'] as string | undefined
        if (!targetBase) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing X-Target-Base header' }))
          return
        }

        // Build the target URL: base + the sub-path after /api/proxy
        const subPath = req.url ?? ''
        const targetUrl = `${targetBase.replace(/\/+$/, '')}${subPath}`

        // Collect request body
        const chunks: Buffer[] = []
        for await (const chunk of req) {
          chunks.push(chunk as Buffer)
        }
        const body = Buffer.concat(chunks)

        // Forward headers, stripping hop-by-hop and our custom header
        const forwardHeaders: Record<string, string> = {}
        for (const [key, value] of Object.entries(req.headers)) {
          if (
            value &&
            !['host', 'x-target-base', 'connection', 'transfer-encoding', 'accept-encoding'].includes(key)
          ) {
            forwardHeaders[key] = Array.isArray(value) ? value.join(', ') : value
          }
        }

        try {
          const upstream = await fetch(targetUrl, {
            method: req.method ?? 'POST',
            headers: forwardHeaders,
            body: body.length > 0 ? body : undefined,
          })

          res.writeHead(upstream.status, {
            'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
          })

          if (upstream.body) {
            const reader = upstream.body.getReader()
            const pump = async () => {
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                res.write(value)
              }
              res.end()
            }
            await pump()
          } else {
            res.end(await upstream.text())
          }
        } catch (err) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiProxyPlugin()],
})
