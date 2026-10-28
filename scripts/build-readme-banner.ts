/**
 * README 头图：.github/assets/banner.html 按终端（暗）/ 档案（亮）各截一张 → .github/assets/banner-{dark,light}.png
 *
 *   node scripts/build-readme-banner.ts      （用 e2e 的 headless shell：pnpm exec playwright install --only-shell chromium）
 *
 * 页面直接引 packages/css/src 的 fonts.css / tokens.css，改了令牌或字体重跑一遍即可。
 */
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const dir = resolve(import.meta.dirname, '../.github/assets');
const src = pathToFileURL(resolve(dir, 'banner.html')).href;

/* file:// 页面默认不能跨文件取字体（CORS），放开 */
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 360 }, deviceScaleFactor: 2 });
  for (const theme of ['dark', 'light']) {
    await page.goto(`${src}?theme=${theme}`);
    await page.evaluate(() => document.fonts.ready);
    const out = resolve(dir, `banner-${theme}.png`);
    await page.locator('.banner').screenshot({ path: out });
    console.log(out);
  }
} finally {
  await browser.close();
}
