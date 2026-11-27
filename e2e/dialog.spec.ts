/**
 * AkDialog（MooncellWiki/prts-design#3）：
 *  · 开着时背景页面滚不动——原生 showModal() 只让页面 inert、不锁滚动，滚轮停在遮罩上会带着页面滚；对话框正文照常内滚。
 *    叠开时（资源列表里再开预览）关掉上面那层仍锁着，最后一层关上才恢复。
 *  · 没有 showModal() 的浏览器（Safari ≤ 15.3、Firefox ≤ 97）：退回成 .ak-dialog-backdrop + open 属性，照样打开、居中、锁滚动，
 *    Esc / 点遮罩关上面那层，Tab 不出对话框，关上后焦点回到打开它的按钮。这里在 Chromium 里删掉 showModal 模拟。
 * 测构建好的 Storybook 里的「叠开 · 滚动锁」story（pnpm build:storybook；没有就跳过，同 stories.spec.ts）。
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Page } from '@playwright/test';
import { test, expect } from './support/test.ts';

test.skip(!existsSync(resolve(import.meta.dirname, '../_build/storybook/index.json')), '没有 _build/storybook：先 pnpm build:storybook');
test.use({ viewport: { width: 1200, height: 460 } });

const STORY = '/storybook/iframe.html?id=components-dialog--stacked&viewMode=story';
const list = (page: Page) => page.locator('dialog.ak-dialog', { hasText: '资源列表' });
const preview = (page: Page) => page.locator('dialog.ak-dialog', { hasText: '图片预览' });
const scrollY = (page: Page) => page.evaluate(() => window.scrollY);

async function open(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(STORY, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 285));   // 「导出」按钮在 100vh 处：滚到 285 时在视口里，click() 不会再滚
  await page.locator('#open-list').click();
  await expect(list(page)).toBeVisible();
  expect(await scrollY(page), '打开时页面不跳').toBe(285);
  return errors;
}

/** 滚轮停在遮罩上（左上角，对话框外）往上滚：页面不动 */
async function expectLocked(page: Page) {
  await page.mouse.move(20, 20);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(100);
  expect(await scrollY(page), '页面锁住').toBe(285);
}

test('原生：遮罩上滚不动页面，正文照常内滚；叠开时关上面那层仍锁着，全关后恢复', async ({ page }) => {
  await open(page);
  await expectLocked(page);

  const body = list(page).locator('.ak-dialog__body');
  const box = (await body.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 300);
  await expect.poll(() => body.evaluate(el => el.scrollTop), '正文内滚').toBeGreaterThan(0);
  expect(await scrollY(page)).toBe(285);

  await body.evaluate(el => (el.scrollTop = 0));
  await page.locator('#open-preview').click();
  await expect(preview(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(preview(page)).toBeHidden();
  await expect(list(page)).toBeVisible();
  await expectLocked(page);

  await page.keyboard.press('Escape');
  await expect(list(page)).toBeHidden();
  await expect(page.locator('#open-list')).toBeFocused();
  // 原生关闭时浏览器同步还焦点，close 事件排在下一个任务里，解锁在它之后
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow), '<html> 的内联样式还原').toBe('');
  await page.mouse.wheel(0, -400);
  await expect.poll(() => scrollY(page), '全关后页面能滚').toBeLessThan(285);
});

test('没有 showModal()：退回成遮罩 + open，照样打开、居中、锁滚动，Esc / 点遮罩 / Tab / 焦点归还都对', async ({ page }) => {
  await page.addInitScript(() => {
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
  });
  const errors = await open(page);
  await expect(page.locator('.ak-dialog-backdrop')).toHaveCount(1);

  const d = list(page);
  const r = (await d.boundingBox())!;
  expect(Math.abs(r.x + r.width / 2 - 600), '水平居中').toBeLessThan(1);
  expect(r.y, '不出视口上缘').toBeGreaterThanOrEqual(0);
  expect(r.y + r.height, '不出视口下缘').toBeLessThanOrEqual(460);
  expect(await d.evaluate(el => el.contains(document.activeElement)), '焦点进对话框').toBe(true);
  await expectLocked(page);

  // Tab 圈在对话框里：焦点在第一个（✕）上 Shift+Tab 到最后一个，再 Tab 回第一个
  await expect(d.getByRole('button', { name: '关闭' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#open-preview')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(d.getByRole('button', { name: '关闭' })).toBeFocused();

  // 叠开：预览盖在列表上，点遮罩只关预览
  await page.locator('#open-preview').click();
  await expect(preview(page)).toBeVisible();
  await expect(page.locator('.ak-dialog-backdrop')).toHaveCount(2);
  const pr = (await preview(page).boundingBox())!;
  expect(await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('dialog')?.textContent?.includes('图片预览'), [pr.x + pr.width / 2, pr.y + pr.height / 2]), '预览在最上面').toBe(true);
  await page.mouse.click(20, 20);
  await expect(preview(page)).toBeHidden();
  await expect(d).toBeVisible();
  await expect(page.locator('#open-preview'), '焦点还给「预览」按钮').toBeFocused();
  await expectLocked(page);

  await page.keyboard.press('Escape');
  await expect(d).toBeHidden();
  await expect(page.locator('.ak-dialog-backdrop')).toHaveCount(0);
  await expect(page.locator('#open-list')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  expect(errors, '没有报错').toEqual([]);
});
