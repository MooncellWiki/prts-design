/**
 * e2e 的静态服务（playwright.config.ts 的 webServer 起它，端口读 PORT）：
 *   /…            仓库根目录原样（预览页 preview/*.html、单文件版 dist/*.html）
 *   /src/…        → packages/css/src/（预览页按站点布局引 ../src/…，Pages 上 /src/ = CSS 包）
 *   /storybook/…  → _build/storybook/（pnpm build:storybook；同 Pages 的布局：整页样例 story 按 ../preview/ 引预览页）
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const port = Number(process.env.PORT ?? 4180);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.TTF': 'font/ttf', '.gif': 'image/gif', '.webp': 'image/webp',
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  try {
    const file = path.startsWith('/src/') ? `packages/css${path}` : path.startsWith('/storybook/') ? `_build${path}` : path;
    const body = await readFile(join(root, file));
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
}).listen(port, '127.0.0.1', () => console.log(`e2e 静态服务 http://127.0.0.1:${port}`));
