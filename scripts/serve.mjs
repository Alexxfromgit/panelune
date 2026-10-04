import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL(process.argv.includes('--dist') ? '../dist/' : '../src/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.json': 'application/json' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    const path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (path !== resolve(root) && !path.startsWith(resolve(root) + sep)) {
      response.writeHead(403).end('Forbidden'); return;
    }
    const file = (await stat(path)).isDirectory() ? resolve(path, 'index.html') : path;
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(data);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Panelune is serving ${root} at http://127.0.0.1:${port}`));
