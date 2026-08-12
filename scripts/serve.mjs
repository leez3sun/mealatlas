import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distRoot = join(projectRoot, 'dist')
const host = '127.0.0.1'
const port = Number(process.env.MEALATLAS_PORT || 4173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
}

if (!existsSync(join(distRoot, 'index.html'))) {
  console.error('dist/index.html was not found. Run npm run build first.')
  process.exit(1)
}

const server = createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url || '/', `http://${host}`).pathname)
  const relativePath = normalize(requestPath).replace(/^[/\\]+/, '')
  let filePath = resolve(distRoot, relativePath || 'index.html')

  if (!filePath.startsWith(`${distRoot}\\`) && filePath !== distRoot) {
    response.writeHead(403).end('Forbidden')
    return
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(distRoot, 'index.html')
  }

  const extension = extname(filePath).toLowerCase()
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  })
  createReadStream(filePath).pipe(response)
})

server.listen(port, host, () => {
  console.log('')
  console.log('  MealAtlas is running locally.')
  console.log(`  Open: http://${host}:${port}/`)
  console.log('  Keep this window open. Press Ctrl+C to stop.')
  console.log('')
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try opening http://${host}:${port}/`)
  } else {
    console.error(error)
  }
  process.exit(1)
})
