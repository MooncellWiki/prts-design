/**
 * 把 prts.wiki 现网「道具一览」页面的数据抓成快照 preview/vendor/itemlist/data.js，给整页样例 preview/items.html 用。
 *
 *   node scripts/fetch-itemlist.ts           （用本机装的 Google Chrome：Playwright 的 channel: 'chrome'，原因同 fetch-vector-css.ts——WAF 按 TLS 指纹拦非浏览器客户端）
 *
 * 现网页面 = {{#widget:ItemList}}：页面往正文里输出一块数据，prts-widgets 的 ItemList 挂到 #root 上读它——
 *   #cargo-data     每件道具一个 <div data-name data-rarity data-category1…3 data-item-id data-sort-id data-icon-id data-filename data-dark-background>，
 *                   里面三段：.obtain-method 获取途径 / .description 描述 / .purpose 用途（都是 wikitext 解析结果，带站内链接）
 * 快照原样保留每件道具的字段（字段名 = Widget 的 Item，src/widgets/ItemList/item.ts），只做两件事：
 *   1. data-* 解析成 Item 的形状（稀有度 / sortId 转 number，category1–3 收成数组）；
 *   2. 三段 HTML 只留文字、<br> 和链接，链接改成指向 prts.wiki 的绝对地址（样例页是静态站，站内相对链接点不通）。
 * 图标不入库：页面运行时取——模板给了图（data-filename，media.prts.wiki 上的「道具 带框 <名>.png」）用它，否则按 iconId 从 torappu.prts.wiki 取。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/itemlist');
const URL = 'https://prts.wiki/w/%E9%81%93%E5%85%B7%E4%B8%80%E8%A7%88';

type Raw = { d: Record<string, string>; obtain: string; desc: string; usage: string };

const browser = await chromium.launch({ channel: 'chrome' });
let raws: Raw[], lastmod: string | null;
try {
  const page = await browser.newPage();
  const res = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (!res?.ok()) throw new Error(`${URL} → HTTP ${res?.status()}`);
  await page.waitForSelector('#cargo-data > div', { state: 'attached', timeout: 60_000 });
  ({ raws, lastmod } = await page.evaluate(() => {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    /* 只留文字、<br> 和链接；其余标签（<span class="fuzzy"> / <small> / <p> …）只留里面的内容 */
    const conv = (node: Node): string => {
      if (node.nodeType === 3) return esc(node.nodeValue ?? '');
      if (!(node instanceof HTMLElement)) return '';
      if (node.tagName === 'BR') return '<br>';
      const inner = Array.from(node.childNodes).map(conv).join('');
      if (node instanceof HTMLAnchorElement && node.getAttribute('href')) return `<a href="${esc(node.href)}">${inner}</a>`;   // .href 是解析后的绝对地址
      return inner;
    };
    const part = (el: HTMLElement, cls: string) => {
      const p = el.querySelector(`:scope > .${cls}`);
      return p ? Array.from(p.childNodes).map(conv).join('').trim() : '';
    };
    return {
      raws: Array.from(document.querySelectorAll<HTMLElement>('#cargo-data > div')).map(el => ({
        d: { ...el.dataset } as Record<string, string>,
        obtain: part(el, 'obtain-method'), desc: part(el, 'description'), usage: part(el, 'purpose'),
      })),
      lastmod: document.querySelector('#footer-info-lastmod')?.textContent?.trim() ?? null,
    };
  }));
} finally {
  await browser.close();
}

const items = raws.map(({ d, obtain, desc, usage }) => ({
  name: d.name ?? '', itemId: d.itemId ?? '', rarity: Number.parseInt(d.rarity ?? '0') || 0, sortId: Number.parseInt(d.sortId ?? '0') || 0,
  categories: [d.category1, d.category2, d.category3].filter(Boolean),
  iconId: d.iconId ?? '', filename: d.filename ?? '', dark: d.darkBackground === '1',
  usage, desc, obtain,
}));
if (items.length < 1000) throw new Error(`只取到 ${items.length} 件道具，页面结构可能变了`);

const date = new Date().toISOString().slice(0, 10);
await mkdir(OUT, { recursive: true });
const body = `/* 现网「道具一览」数据快照（${date} 由 scripts/fetch-itemlist.ts 抓取，${items.length} 件道具；${lastmod ?? ''}）。许可见同目录 NOTICE.md。 */
window.PRTS_ITEMLIST = ${JSON.stringify({ date, items })};
`;
await writeFile(join(OUT, 'data.js'), body);
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# 道具一览数据快照

\`data.js\` 是 prts.wiki 现网[道具一览](${URL})页面正文里的那块数据（\`#cargo-data\`，每件道具一条），${date} 由 \`scripts/fetch-itemlist.ts\` 抓取，共 ${items.length} 件道具。

- 文本内容（道具名称、用途、描述、获取途径等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 \`preview/items.html\` 用；道具图标不入库，页面运行时从 \`torappu.prts.wiki\` / \`media.prts.wiki\` 取。
- 重抓：\`node scripts/fetch-itemlist.ts\`（用本机的 Google Chrome，原因见脚本头注释）。
`,
);
console.log(`data.js ${(body.length / 1024).toFixed(0)} KB · ${items.length} 件道具 → ${OUT}`);
