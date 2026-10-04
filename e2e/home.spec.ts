/**
 * 首页轮播的自动播放：计时是当前指示格 ::after 上一段 6 秒的 CSS 动画，播完（animationend）切下一张。
 * 减弱动效下动画一生成就落在终态（base/root.css，与 MW 核心 accessibility 特性一致），停住也照样派发 animationend——
 * 脚本没把住关的话每帧切一张停不下来（现网反馈过「首页活动图片疯狂切换闪现」）。这里数指示条 aria-current 换了几次。
 */
import type { Page } from '@playwright/test';
import { test, expect } from './support/test.ts';

/** 开首页，从脚本初始化之后开始数换张次数（window.__changes） */
async function open(page: Page) {
  await page.goto('/preview/home.html?theme=dark&demo=0', { waitUntil: 'load' });
  await expect(page.locator('.mp-hero__dot[aria-current="true"]')).toHaveCount(1);
  await page.evaluate(() => {
    const w = window as unknown as { __changes: number };
    w.__changes = 0;
    new MutationObserver(ms => { for (const m of ms) if ((m.target as Element).getAttribute('aria-current') === 'true') w.__changes++; })
      .observe(document.getElementById('mp-hero-pager')!, { attributes: true, attributeFilter: ['aria-current'], subtree: true });
  });
  await page.mouse.move(5, 880);   // 鼠标不在轮播上：悬停会把自动播放停住
}
const changes = (page: Page) => page.evaluate(() => (window as unknown as { __changes: number }).__changes);
const current = (page: Page) => page.evaluate(() => [...document.querySelectorAll('.mp-hero__dot')].findIndex(d => d.getAttribute('aria-current') === 'true'));

test('减弱动效：不自动播，手动一次只切一张', async ({ page }) => {   // 配置里默认就是 reducedMotion: 'reduce'
  await open(page);
  await expect(page.locator('#mp-hero')).toHaveClass(/is-stopped/);
  await page.waitForTimeout(1000);
  expect(await changes(page), '静置 1 秒不该换张').toBe(0);

  await page.locator('#mp-hero').hover();
  await page.locator('#mp-hero-next').click();
  await page.mouse.move(5, 880);
  await page.waitForTimeout(1000);
  expect(await changes(page), '点一次箭头只切一张').toBe(1);
  expect(await current(page)).toBe(1);

  await page.locator('.mp-hero__dot').nth(4).click();
  await page.mouse.move(5, 880);
  await page.waitForTimeout(1000);
  expect(await changes(page), '点一次指示条只切一张').toBe(2);
  expect(await current(page)).toBe(4);
});

test.describe('不减弱动效', () => {
  test.use({ reducedMotion: 'no-preference' });
  test('6 秒自动切下一张，页面开着时打开减弱动效就停住', async ({ page }) => {
    await open(page);
    await expect.poll(() => changes(page), { timeout: 12_000, message: '6 秒的进度播完该切下一张' }).toBe(1);

    await page.emulateMedia({ reducedMotion: 'reduce' });   // 开着页面改系统设置：CSS 那半立刻生效，脚本也得跟上
    await expect(page.locator('#mp-hero')).toHaveClass(/is-stopped/);
    const n = await changes(page);
    await page.waitForTimeout(1000);
    expect(await changes(page), '打开减弱动效后不该再换张').toBe(n);
  });
});
