/**
 * 打开中的 AkDialog 按打开顺序排成一摞（同原生 top layer），两件事靠它：
 *  · 页面滚动锁：原生 showModal() 只让背后的页面 inert、不锁滚动，滚轮停在遮罩上照样带着页面滚。
 *    同一文档里第一个打开时锁、最后一个关上时放开——列表里再开预览、关掉预览时页面仍锁着；
 *  · 不认 showModal() 的浏览器：Esc、Tab 焦点圈只归最上面那层管。
 */

/** 皮肤的滚动锁（skin.js · window.akdsScrollLock）：按持有者计数，与侧栏抽屉、手机目录浮层共用一把，另管 iOS 的触摸滚动 */
type SkinScrollLock = (owner: string, on: boolean) => void;

const stack: HTMLElement[] = [];
const locks = new Map<Document, () => void>();

export function enter(d: HTMLElement) {
  if (stack.includes(d)) return;
  stack.push(d);
  const doc = d.ownerDocument;
  if (!locks.has(doc)) locks.set(doc, lockScroll(doc));
}

export function leave(d: HTMLElement) {
  const i = stack.indexOf(d);
  if (i < 0) return;
  stack.splice(i, 1);
  const doc = d.ownerDocument;
  if (!stack.some(x => x.ownerDocument === doc)) {
    locks.get(doc)?.();
    locks.delete(doc);
  }
}

/** 是不是本文档最上面那层 */
export function isTop(d: HTMLElement) {
  const mine = stack.filter(x => x.ownerDocument === d.ownerDocument);
  return mine[mine.length - 1] === d;
}

/** 锁住文档滚动，返回解锁函数。prts.wiki 上交给皮肤；站外：<html> overflow: hidden（不改滚动位置），
 *  有实体滚动条（Windows、「总是显示滚动条」）时写 scrollbar-gutter: stable 占住它的位置，页面不左右抖 */
function lockScroll(doc: Document): () => void {
  const win = doc.defaultView as (Window & { akdsScrollLock?: SkinScrollLock }) | null;
  const skin = win?.akdsScrollLock;
  if (typeof skin === "function") {
    skin("ak-dialog", true);
    return () => skin("ak-dialog", false);
  }
  const html = doc.documentElement;
  const s = html.style;
  const { overflow, scrollbarGutter } = s;
  if (win && win.innerWidth > html.clientWidth && !(win.getComputedStyle(html).scrollbarGutter || "").includes("stable")) s.scrollbarGutter = "stable";
  s.overflow = "hidden";
  return () => {
    s.overflow = overflow;
    s.scrollbarGutter = scrollbarGutter;
  };
}

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, audio[controls], video[controls], summary, [contenteditable]:not([contenteditable="false"]), [tabindex]';

/** 能 Tab 到的子元素（按文档顺序；跳过 tabindex=-1 与不显示的） */
export function tabbables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.tabIndex >= 0 && el.getClientRects().length > 0);
}
