/**
 * 计算样式快照：页面里每个元素（含 ::before / ::after）的计算样式 + <html> 上全部 --ak-* 令牌的计算值，snapshots / hosts 两组共用。
 * 快照 = { rows: [路径, 本体样式 id, ::before id, ::after id, (withClass 时) 类名][], table: 样式串[], tokens }：样式串去重进 table，行里只放下标。
 */
import type { Browser, BrowserContextOptions, Page } from '@playwright/test';
import { offline } from './test.ts';

export type Row = [string, number, number, number, string?];
export type Snap = { rows: Row[]; table: string[]; tokens: Record<string, string> };

/** 干员页的「干员信息」舞台是现网 Widget 原样（不归本仓库管，图片从现网拉、时序不定），整棵子树跳过 */
export const SKIP = '.charinfo-container, .charimg-m';

type DumpOptions = { skip: string; withClass?: boolean; within?: string; tag?: string; pathsOnly?: boolean };

/* 在页面里跑（page.evaluate 只传一个参数）。within / tag / pathsOnly：交互态那轮只要子树的路径 / 类名，样式由 CDP 取，元素打上 data-ak-n=行号供对齐 */
function dump({ skip, withClass = false, within, tag, pathsOnly = false }: DumpOptions): Snap {
  const table = new Map<string, number>();
  const intern = (s: string) => { let id = table.get(s); if (id === undefined) { id = table.size; table.set(s, id); } return id; };
  const ser = (cs: CSSStyleDeclaration) => {
    const out: string[] = [];
    for (let i = 0; i < cs.length; i++) { const p = cs[i]; if (!p.startsWith('--')) out.push(p + ':' + cs.getPropertyValue(p)); }
    return out.join('\n').replaceAll(location.origin, '');   // 端口因机器而异
  };
  const path = (el: Element) => {
    const seg: string[] = [];
    for (let e: Element | null = el; e && e !== document.documentElement; e = e.parentElement) {
      let i = 1; for (let s = e.previousElementSibling; s; s = s.previousElementSibling) if (s.tagName === e.tagName) i++;
      seg.push(e.tagName.toLowerCase() + (e.id ? '#' + e.id.replace(/^swiper-wrapper-\w+$/, 'swiper-wrapper') : '') + ':' + i);   // Swiper 的随机 id
    }
    return seg.reverse().join('>');
  };
  const pseudo = (el: Element, p: string) => {
    const cs = getComputedStyle(el, p);
    return cs.content === 'none' || cs.content === 'normal' ? -1 : intern(ser(cs));
  };
  const rows: Row[] = [];
  for (const el of document.querySelectorAll(within ? `${within}, ${within} *` : 'html, html *')) {
    if (el.closest(skip) || el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    if (pathsOnly) el.setAttribute('data-ak-n', String(rows.length));
    const row: Row = [(tag ? `[${tag}] ` : '') + path(el), pathsOnly ? -1 : intern(ser(getComputedStyle(el))), pathsOnly ? -1 : pseudo(el, '::before'), pathsOnly ? -1 : pseudo(el, '::after')];
    if (withClass) row.push(el.getAttribute('class') ?? '');
    rows.push(row);
  }
  const tokens: Record<string, string> = {};
  const rcs = getComputedStyle(document.documentElement);
  for (let i = 0; i < rcs.length; i++) { const p = rcs[i]; if (p.startsWith('--')) tokens[p] = rcs.getPropertyValue(p).trim(); }
  return { rows, table: [...table.keys()], tokens };
}

/** 页面静下来再拍：字体加载完 + 300ms（减弱动效下动画 .01ms 就落到终态，留余量给脚本挂载） */
export async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}

export const snapshot = (page: Page, withClass = false) => page.evaluate(dump, { skip: SKIP, withClass });

/**
 * 交互态：selector 选中的链接 / 控件逐个强制伪类，拍元素 + 子树（不含伪元素），行路径带 [hover] 等前缀，样式串并进 snap.table。
 * 悬停真移过去只能一个一个来、且带过渡；:visited 出于隐私 getComputedStyle 永远按未访问算——都走 CDP：
 * CSS.forcePseudoState 强制，CSS.getComputedStyleForNode 取值（DevTools「计算样式」面板的路，认强制的 :visited）。
 * 返回这版 Chromium 不能强制的伪类（跳过）。
 */
export async function stateRows(page: Page, snap: Snap, selector: string, states: string[]): Promise<string[]> {
  // 减弱动效的 * { transition-duration: .01ms }（Arknights 皮肤 / 作用域 / Vector 都有）让每个元素的所有属性都带过渡（transition-property 初值是 all）：
  // 强制伪类后没过一帧就取值，拿到的是过渡起点（未悬停 / 未聚焦的样子）；撤掉强制时祖先的颜色也在往回过渡、子树继承到中间值。
  // 这一轮把过渡关掉，各宿主一样；transition-* 本身在静态那轮已比过
  await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
  const origin = new URL(page.url()).origin;
  const ids = new Map(snap.table.map((s, i) => [s, i]));
  const intern = (s: string) => { let id = ids.get(s); if (id === undefined) { id = snap.table.length; snap.table.push(s); ids.set(s, id); } return id; };
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
  const { root: doc } = await cdp.send('DOM.getDocument', { depth: 0 });
  const n = await page.evaluate(sel => { const els = document.querySelectorAll(sel); els.forEach((el, i) => el.setAttribute('data-ak-st', String(i))); return els.length; }, selector);
  const nodeOf = async (sel: string) => (await cdp.send('DOM.querySelector', { nodeId: doc.nodeId, selector: sel })).nodeId;
  const skipped: string[] = [];
  for (const state of states) {
    try { await cdp.send('CSS.forcePseudoState', { nodeId: await nodeOf('[data-ak-st="0"]'), forcedPseudoClasses: [state] }); } catch { skipped.push(state); continue; }
    for (let i = 0; i < n; i++) {
      const sel = `[data-ak-st="${i}"]`;
      const nodeId = await nodeOf(sel);
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [state] });
      const meta = await page.evaluate(dump, { skip: SKIP, withClass: true, within: sel, tag: state, pathsOnly: true });
      for (let k = 0; k < meta.rows.length; k++) {
        const { computedStyle } = await cdp.send('CSS.getComputedStyleForNode', { nodeId: await nodeOf(`[data-ak-n="${k}"]`) });
        const r = meta.rows[k];
        r[1] = intern(computedStyle.filter(p => !p.name.startsWith('--')).map(p => `${p.name}:${p.value}`).join('\n').replaceAll(origin, ''));
        snap.rows.push(r);
      }
      await page.evaluate(() => document.querySelectorAll('[data-ak-n]').forEach(el => el.removeAttribute('data-ak-n')));
      await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });
    }
  }
  await cdp.detach();
  return skipped;
}

/** 新开一个上下文 + 页面（一个用例里要同时开几个页面时用；选项照 playwright.config.ts 的 use 写全，不依赖默认上下文；同样不出网） */
export async function openPage(browser: Browser, baseURL: string | undefined, options: BrowserContextOptions = {}) {
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light', ...options });
  await offline(context);
  return context.newPage();
}

/** 自定义属性的计算值是原文（不解析），比较前把写法归一：空白、#abc → #aabbcc、.10 → 0.1 */
export const normToken = (v: string | undefined) => v === undefined ? v : v.replace(/\s+/g, '')
  .replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
  .replace(/(?<![\d.])\.(\d)/g, '0.$1').replace(/(\.\d*?)0+\b/g, '$1').replace(/\.(?!\d)/g, '').toLowerCase();

/** 样式串 → 属性表 */
export const props = (s: string | undefined) => new Map((s ?? '').split('\n').filter(Boolean).map(l => { const i = l.indexOf(':'); return [l.slice(0, i), l.slice(i + 1)] as [string, string]; }));

export const SLOTS = [[1, ''], [2, '::before'], [3, '::after']] as const;
/** 行里某个槽位的样式串（没有伪元素 = undefined） */
export const styleAt = (s: Snap, r: Row, slot: 1 | 2 | 3) => (r[slot] as number) < 0 ? undefined : s.table[r[slot] as number];
