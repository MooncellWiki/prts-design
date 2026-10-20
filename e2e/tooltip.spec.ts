/**
 * 纯 CSS 提示 [data-ak-tip] 显示出来也不能把手机页面撑宽：气泡居中对着触发元素，贴着视口右缘的一条长提示原来伸出视口 ~80px，
 * 移动端浏览器就把布局视口撑宽、整页缩小（prts-widgets 干员模型的「GIF 2x」，innerWidth 393 → 470）。
 * 现在显示时宽度封顶到视口宽减 16px，伸出左 / 右缘的由 preview.js（与 skin.js 相同）量出来写进 --ak-tip-dx、整条挪回视口，两边各留 8px。
 * 气泡的位置按 ::after 的计算样式算（left + margin-left + transform 的平移，相对触发元素的内边距盒），不照抄脚本里的公式。
 * iOS 点按（iOS 26 模拟器实测）：:hover 在 touchstart 就生效、提示随即显示，这时只有 pointerover；mouseover 要等点按完成才派发，长按 / 按住滑动根本没有——
 * 脚本原先只听 mouseover，真机上照样伸出去。这里用 CDP 强制 :hover、只派发 pointerover 模拟（Playwright 的 tap() 不行：CI 的 Linux headless shell 点按不进 :hover）。
 * Vue 版 AkTooltip / AkPopover 自己避让（usePopover.ts 的 useAutoPlace：放不下的换到对边、伸出左 / 右缘的平移回来）：测构建好的 Storybook 里的
 * 「贴边自动避让」story（pnpm build:storybook；没有就跳过，同 stories.spec.ts）。
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Page } from '@playwright/test';
import { test, expect } from './support/test.ts';

test.use({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true });

const LONG = '尺寸：1000 × 1000，导出文件大小约为 GIF 的 3 倍';

/** 正文最前面插一排按钮：左缘、正中、右缘各一颗，外加一颗提示比视口还长的 */
async function open(page: Page) {
  await page.goto('/preview/operator.html', { waitUntil: 'load' });
  await page.locator('#mw-content-text').evaluate((root, long) => {
    root.insertAdjacentHTML('afterbegin', `<div id="tips" style="display: flex; justify-content: space-between; margin: 80px 0">
      <button class="ak-btn ak-btn--sm" id="tip-left" data-ak-tip="${long}">左</button>
      <button class="ak-btn ak-btn--sm" id="tip-mid" data-ak-tip="居中">中</button>
      <button class="ak-btn ak-btn--sm" id="tip-right" data-ak-tip="${long}">GIF 2x</button>
    </div><p><button class="ak-btn ak-btn--sm" id="tip-huge" data-ak-tip="${long.repeat(3)}">长</button></p>`);
  }, LONG);
  await page.locator('#tips').scrollIntoViewIfNeeded();
}

const bubble = (page: Page, id: string) => page.locator(`#${id}`).evaluate(el => {
  const cs = getComputedStyle(el, '::after'), r = el.getBoundingClientRect();
  const tx = cs.transform === 'none' ? 0 : new DOMMatrix(cs.transform).m41;
  const left = r.left + el.clientLeft + parseFloat(cs.left) + parseFloat(cs.marginLeft) + tx;
  const w = parseFloat(cs.width) + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const root = document.documentElement;
  return { left, right: left + w, width: w, center: r.left + r.width / 2, opacity: Number(cs.opacity), vw: root.clientWidth, scrollWidth: root.scrollWidth, innerWidth };
});

/** 气泡完全显示（淡入走完）之后再量 */
async function shown(page: Page, id: string) {
  await expect.poll(async () => (await bubble(page, id)).opacity).toBe(1);
  return bubble(page, id);
}

function expectInside(b: Awaited<ReturnType<typeof bubble>>) {
  expect(b.left, '气泡左缘留 8px').toBeGreaterThanOrEqual(8 - 0.5);
  expect(b.right, '气泡右缘留 8px').toBeLessThanOrEqual(b.vw - 8 + 0.5);
  expect(b.scrollWidth, '文档没有横向溢出').toBe(b.vw);
  expect(b.innerWidth, '布局视口没被撑宽').toBe(393);
}

test('悬停贴右缘的长提示：气泡挪回视口，页面不撑宽', async ({ page }) => {
  await open(page);
  await page.locator('#tip-right').hover();
  expectInside(await shown(page, 'tip-right'));
});

test('悬停贴左缘的长提示：气泡挪回视口', async ({ page }) => {
  await open(page);
  await page.locator('#tip-left').hover();
  expectInside(await shown(page, 'tip-left'));
});

test('放得下的提示照旧居中', async ({ page }) => {
  await open(page);
  await page.locator('#tip-mid').hover();
  const b = await shown(page, 'tip-mid');
  expect(Math.abs((b.left + b.right) / 2 - b.center)).toBeLessThan(1);
});

test('比视口还长的提示折行，宽度不超过视口减 16px', async ({ page }) => {
  await open(page);
  await page.locator('#tip-huge').hover();
  const b = await shown(page, 'tip-huge');
  expect(b.width).toBeLessThanOrEqual(b.vw - 16 + 0.5);
  expectInside(b);
});

test('iOS 点按：:hover 在 touchstart 就生效、只有 pointerover 没有 mouseover，同样挪回视口', async ({ page }) => {
  await open(page);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable');
  await cdp.send('CSS.enable');
  const { root } = await cdp.send('DOM.getDocument');
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#tip-right' });
  await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['hover'] });
  await page.locator('#tip-right').dispatchEvent('pointerover', { pointerType: 'touch' });
  expectInside(await shown(page, 'tip-right'));
});

test('键盘聚焦贴右缘的按钮：同悬停', async ({ page }) => {
  await open(page);
  await page.mouse.move(196, 5);
  await page.locator('#tip-mid').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#tip-right')).toBeFocused();
  expectInside(await shown(page, 'tip-right'));
});

test.describe('AkTooltip / AkPopover', () => {
  test.skip(!existsSync(resolve(import.meta.dirname, '../_build/storybook/index.json')), '没有 _build/storybook：先 pnpm build:storybook');

  test('贴着视口边缘：换到对边、平移进视口，放得下的照旧，页面不撑宽', async ({ page }) => {
    await page.goto('/storybook/iframe.html?id=components-tooltip--edges&viewMode=story', { waitUntil: 'networkidle' });
    await expect(page.locator('#edge-br ~ .ak-popover')).toBeVisible();
    const boxes = await page.evaluate(() => {
      const box = (id: string) => {
        const t = document.getElementById(id)!, b = t.parentElement!.querySelector<HTMLElement>('.ak-tooltip, .ak-popover')!;
        const r = b.getBoundingClientRect(), tr = t.getBoundingClientRect();
        return { cls: b.className, left: r.left, right: r.right, top: r.top, bottom: r.bottom, center: (r.left + r.right) / 2, triggerCenter: (tr.left + tr.right) / 2 };
      };
      const root = document.documentElement;
      return { tl: box('edge-tl'), tr: box('edge-tr'), mid: box('edge-mid'), br: box('edge-br'), vw: root.clientWidth, vh: root.clientHeight, scrollWidth: root.scrollWidth, innerWidth };
    });
    expect(boxes.tl.cls, '左上：上方放不下，换到下方').toContain('ak-tooltip--bottom');
    expect(boxes.tr.cls, '右上：右边放不下，换到左边').toContain('ak-tooltip--left');
    expect(boxes.mid.cls, '正中：放得下照旧').toContain('ak-tooltip--top');
    expect(Math.abs(boxes.mid.center - boxes.mid.triggerCenter), '正中：照旧居中').toBeLessThan(1);
    expect(boxes.br.cls, '右下：下方放不下，换到上方').toContain('ak-popover--top');
    for (const [k, b] of Object.entries({ tl: boxes.tl, tr: boxes.tr, mid: boxes.mid, br: boxes.br })) {
      expect(b.left, `${k}：左缘留 8px`).toBeGreaterThanOrEqual(8 - 0.5);
      expect(b.right, `${k}：右缘留 8px`).toBeLessThanOrEqual(boxes.vw - 8 + 0.5);
      expect(b.top, `${k}：不出视口上缘`).toBeGreaterThanOrEqual(0);
      expect(b.bottom, `${k}：不出视口下缘`).toBeLessThanOrEqual(boxes.vh);
    }
    expect(boxes.scrollWidth, '文档没有横向溢出').toBe(boxes.vw);
    expect(boxes.innerWidth, '布局视口没被撑宽').toBe(393);
  });

  test('悬停打开的：打开时才量，伸出左缘的平移回来', async ({ page }) => {
    await page.goto('/storybook/iframe.html?id=components-tooltip--edges&viewMode=story', { waitUntil: 'networkidle' });
    await page.locator('#edge-bl').hover();
    const tip = page.locator('#edge-bl ~ .ak-tooltip');
    await expect(tip).toBeVisible();
    await expect(tip).toHaveClass(/ak-tooltip--top/);
    const r = (await tip.boundingBox())!;
    expect(r.x).toBeGreaterThanOrEqual(8 - 0.5);
    expect(await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth])).toEqual([393, 393]);
  });
});
