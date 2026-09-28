/**
 * 文档站自检：每一页不 404、示例 iframe 都有内容、控制台没有错误 / 警告、没有失败的请求；整页截图进报告（CI 上只截失败的）。
 * 测的是 _site（bash scripts/build-site.sh _site 组装的 Pages 站点，与上线的是同一份；没有就跳过）。页面清单 = _site 里 VitePress 生成的 .html，
 * 不含 /storybook/、/preview/、/dist/、/src/、404 页与旧地址的跳转页。不出网：页面里现网的图在浏览器里拦下（support/test.ts）。
 *
 *   pnpm e2e --project=docs                      全部
 *   pnpm e2e --project=docs -g /components/chip  按路径挑
 *   THEME=light pnpm e2e --project=docs          亮色（默认暗）
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { collectProblems, shouldShoot } from './support/problems.ts';
import { SITE_BASE } from './support/server.ts';
import { test, expect } from './support/test.ts';

const THEME = process.env.THEME ?? 'dark';
const site = resolve(import.meta.dirname, '../_site');
const NOT_DOCS = /^(storybook|preview|dist|src|assets)\//;
const pages = existsSync(`${site}/index.html`)
  ? readdirSync(site, { recursive: true, encoding: 'utf8' })
    .filter(f => f.endsWith('.html') && !NOT_DOCS.test(f) && f !== '404.html')
    .filter(f => !readFileSync(`${site}/${f}`, 'utf8').includes('http-equiv="refresh"'))   // build-site.sh 写的旧地址跳转页
    .map(f => '/' + f.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, ''))   // cleanUrls：/components/chip.html → /components/chip
    .sort()
  : [];

test.describe.configure({ mode: 'parallel' });

if (!pages.length) test('文档站', () => test.skip(true, '没有 _site：先 bash scripts/build-site.sh _site'));

for (const path of pages) {
  test(path, async ({ page }, testInfo) => {
    const problems = collectProblems(page, testInfo);
    await page.addInitScript(t => localStorage.setItem('vitepress-theme-appearance', t), THEME);
    const res = await page.goto(`${SITE_BASE}${path.slice(1)}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);   // 示例 iframe 异步挂载
    const info = await page.evaluate(() => ({
      is404: !!document.querySelector('.NotFound'),
      frames: [...document.querySelectorAll('iframe')].map(f => {
        const body = f.contentDocument?.body;
        return { src: f.getAttribute('src') ?? '', h: Math.round(f.getBoundingClientRect().height), empty: !body || body.innerText.trim() === '' && !body.querySelector("img,svg,[class^='ak-'],[class*=' ak-']") };
      }),
    }));
    expect.soft(res?.status() ?? 200, 'HTTP 状态').toBeLessThan(400);
    expect.soft(info.is404, 'VitePress 的 404 页').toBe(false);
    expect.soft(info.frames.filter(f => f.empty || f.h < 20).map(f => f.src), '空白的示例 iframe').toEqual([]);
    expect.soft(problems, '控制台 / 网络问题').toEqual([]);
    if (shouldShoot(testInfo)) await testInfo.attach(`${path.slice(1).replaceAll('/', '_') || 'index'}.png`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });
}
