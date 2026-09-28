/**
 * e2e 的静态服务（playwright.config.ts 的 webServer 起它，端口读 PORT）：
 *   /…              仓库根目录原样（预览页 preview/*.html、单文件版 dist/*.html）
 *   /src/…          → packages/css/src/（预览页按站点布局引 ../src/…，Pages 上 /src/ = CSS 包）
 *   /prts-design/…  → _site/（scripts/build-site.sh 组装的 Pages 站点：文档站 + /storybook/，stories / docs 两组测它；
 *                     VitePress 开了 cleanUrls，/x 找 x.html，/x/ 找 x/index.html）
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
export const SITE_BASE = '/prts-design/';

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.TTF': 'font/ttf', '.gif': 'image/gif', '.webp': 'image/webp',
};

/** 请求路径 → 依次尝试的文件 */
function candidates(path: string): string[] {
  if (path.startsWith(SITE_BASE)) {
    const rest = path.slice(SITE_BASE.length);
    const file = join(root, '_site', rest);
    if (rest === '' || rest.endsWith('/')) return [join(file, 'index.html')];
    return extname(rest) ? [file] : [`${file}.html`, join(file, 'index.html')];
  }
  return [join(root, path.startsWith('/src/') ? `packages/css${path}` : path)];
}

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 4180);
  createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    for (const file of candidates(path)) {
      try {
        const body = await readFile(file);
        res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
        res.end(body);
        return;
      } catch { /* 下一个候选 */ }
    }
    res.writeHead(404); res.end();
  }).listen(port, '127.0.0.1', () => console.log(`e2e 静态服务 http://127.0.0.1:${port}`));
}
