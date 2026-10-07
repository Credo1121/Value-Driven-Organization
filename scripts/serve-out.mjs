// Serves the static export (`out/`) locally without network access (QZ4, ADR-001).
// Uses Node built-ins only, so no extra dependency is needed for workshops.
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve('out')
const port = Number(process.env.PORT ?? 4180)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
}

if (!existsSync(root)) {
  console.error('No out/ folder found. Run `npm run build` first.')
  process.exit(1)
}

function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  const candidate = join(root, safe)
  if (!candidate.startsWith(root)) return null // path traversal guard
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  const index = join(candidate, 'index.html')
  if (existsSync(index)) return index
  return null
}

createServer((req, res) => {
  const path = new URL(req.url ?? '/', 'http://localhost').pathname
  const file = resolveFile(path)
  if (!file) {
    res.writeHead(404, { 'content-type': types['.html'] })
    createReadStream(join(root, '404.html')).pipe(res)
    return
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(port, '127.0.0.1', () => {
  console.log(`Serving out/ at http://localhost:${port}`)
})
