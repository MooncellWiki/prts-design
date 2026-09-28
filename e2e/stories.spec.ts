/**
 * Storybook 自检：每个 story 渲染成功（#storybook-root 有内容、没有 Storybook 的错误页），控制台没有错误 / 警告、没有失败的请求；截图进报告（CI 上只截失败的）。
 * 测的是构建好的 _build/storybook（pnpm build:storybook；Pages 上的 /storybook/ 就是它；没有就跳过）。不出网：story 里 media.prts.wiki 的图在浏览器里拦下（support/test.ts）。
 *
 *   pnpm e2e --project=stories                   全部
 *   pnpm e2e --project=stories -g components-chip   按 story id（= 注册表 storybook 字段）挑
 *   THEME=light pnpm e2e --project=stories       亮色（默认暗）
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { collectProblems, shouldShoot } from './support/problems.ts';
import { test, expect } from './support/test.ts';

const THEME = process.env.THEME ?? 'dark';
const index = resolve(import.meta.dirname, '../_build/storybook/index.json');
const stories = existsSync(index)
  ? Object.values((JSON.parse(readFileSync(index, 'utf8')) as { entries: Record<string, { id: string; type: string; title: string; name: string }> }).entries).filter(e => e.type === 'story')
  : [];

test.describe.configure({ mode: 'parallel' });

if (!stories.length) test('Storybook', () => test.skip(true, '没有 _build/storybook：先 pnpm build:storybook'));

for (const s of stories) {
  test(`${s.id}（${s.title} / ${s.name}）`, async ({ page }, testInfo) => {
    const problems = collectProblems(page, testInfo);
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto(`/storybook/iframe.html?id=${s.id}&viewMode=story&globals=theme:${THEME}`, { waitUntil: 'networkidle' });
    const state = await page.waitForFunction(() => {
      const err = document.querySelector<HTMLElement>('.sb-show-errordisplay .sb-errordisplay');
      if (err) return { ok: false, text: err.innerText.slice(0, 600) };
      const r = document.querySelector('#storybook-root');
      return r && r.children.length ? { ok: true, text: '' } : false;
    }, undefined, { timeout: 15_000 }).then(h => h.jsonValue() as Promise<{ ok: boolean; text: string }>).catch(() => ({ ok: false, text: '15 秒内没有渲染出内容' }));
    await page.waitForTimeout(300);
    expect.soft(state.ok, `渲染失败：${state.text.replace(/\s+/g, ' ')}`).toBe(true);
    expect.soft(problems, '控制台 / 网络问题').toEqual([]);
    if (shouldShoot(testInfo)) await testInfo.attach(`${s.id}.png`, { body: await page.screenshot(), contentType: 'image/png' });
  });
}
