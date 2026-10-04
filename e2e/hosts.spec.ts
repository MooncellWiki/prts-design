/**
 * 跨宿主：同一份组件 HTML（对照页 preview/gallery.html）在 Arknights 皮肤 / Vector 2022 / 站外三种页面上的计算样式必须一样。
 * 每个用例 = 一个宿主 × 主题，和同主题的 akds 宿主比：每个 [data-gallery] 块里的元素（含伪元素）逐属性相同，否则列出不同的元素 / 属性。
 * 交互态另比一轮：块里的链接 / 控件用 CDP 强制 :hover / :focus-visible / :visited，拍元素 + 子树的计算样式（路径带 [hover] 等前缀；不含伪元素）。
 * vector 宿主用仓库里的 Vector 2022 样式夹具 preview/vendor/vector/（scripts/fetch-vector-css.ts 从现网抓来入库；测试本身不出网，见 support/test.ts）。
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Browser } from '@playwright/test';
import { openPage, props, settle, snapshot, stateRows, styleAt, SLOTS, type Row, type Snap } from './support/computed.ts';
import { test, expect } from './support/test.ts';

const vendor = resolve(import.meta.dirname, '../preview/vendor/vector');
const HOSTS = ['akds', 'vector', 'bare'] as const;
type HostName = (typeof HOSTS)[number];
const STATES = ['hover', 'focus-visible', 'visited'];
const INTERACTIVE = '[data-gallery] :is(a[href], button, input, select, textarea, [tabindex])';

/**
 * 允许的差异（逐条注明原因）。只有这些——字体不在白名单里：font-family 的计算值是声明的字体列表，三个宿主应当完全一样，不一样就是真泄漏。
 *   hosts：哪些宿主上允许；el：元素条件（标签 / 类名，不写 = 任何元素）；props：属性
 */
const ALLOW: { hosts: HostName[]; el?: (tag: string, cls: string[]) => boolean; props: string[]; why: string }[] = [
  {
    hosts: ['vector', 'bare'], el: (_, c) => c.includes('ak-item--bare'), props: ['background-image'],
    why: '游戏素材（道具稀有度底框）只随皮肤走（base/skin-assets.css）：别的皮肤只加载 skins.akds.components、站外只有 standalone.css，没有底框（var() 回退 none）',
  },
  {
    hosts: ['vector', 'bare'], el: t => /^h[1-6]$/.test(t), props: ['scroll-margin-top', 'scroll-margin-block-start'],
    why: 'Arknights 皮肤正文标题给固定页眉让出的锚点偏移（base/typography.css），只在皮肤页面上有意义，不影响渲染',
  },
  {
    hosts: ['vector', 'bare'], el: (t, c) => t === 'a' && c.includes('ak-btn'), props: ['text-underline-offset', 'text-decoration-thickness'],
    why: '链接形态的 .ak-btn 不标 ak-not-prose，Arknights 皮肤正文的 a:hover（base/typography.css）给了下划线偏移 / 粗细；.ak-btn:hover 没有下划线，看不见',
  },
];

type HostSnap = Snap & { sections: string[]; skipped: string[] };

async function capture(browser: Browser, baseURL: string | undefined, host: HostName, theme: string): Promise<HostSnap> {
  const page = await openPage(browser, baseURL);
  try {
    await page.goto(`/preview/gallery.html?host=${host}&theme=${theme}&demo=0`, { waitUntil: 'networkidle' });
    await settle(page);
    const snap = await snapshot(page, true);
    const sections = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('[data-gallery]')].map(s => s.dataset.gallery!));
    const skipped = await stateRows(page, snap, INTERACTIVE, STATES);
    return { ...snap, sections, skipped };
  } finally {
    await page.context().close();
  }
}

/** 与 akds 比：返回 块 → 问题行，以及各条白名单放过的次数 */
function compare(base: HostSnap, other: HostSnap, host: HostName) {
  // 只看 [data-gallery] 块里的元素：路径里第一个 section:k 就是第 k 块（块都是 #gallery-root 下的兄弟）
  const inGallery = (s: HostSnap) => new Map(s.rows.filter(r => /(^|>)section:\d+/.test(r[0])).map(r => [r[0], r] as [string, Row]));
  const sectionOf = (p: string) => base.sections[Number(p.match(/(?:^|>)section:(\d+)/)![1]) - 1];
  const A = inGallery(base), B = inGallery(other);
  const out = new Map<string, string[]>();   // 块 → 问题
  const allowed = ALLOW.map(() => 0);
  const add = (p: string, line: string) => { const sec = sectionOf(p); (out.get(sec) ?? out.set(sec, []).get(sec)!).push(line); };
  for (const p of A.keys()) if (!B.has(p)) add(p, `  元素只在 akds：${p}`);
  for (const [p, ra] of A) {
    const rb = B.get(p);
    if (!rb) continue;
    const cls = (ra[4] ?? '').trim().split(/\s+/).filter(Boolean);
    const tagName = p.split('>').pop()!.replace(/[#:].*$/, '');
    for (const [slot, tag] of SLOTS) {
      const sa = styleAt(base, ra, slot), sb = styleAt(other, rb, slot);
      if (sa === sb) continue;
      const short = `${p.replace(/^(\[[\w-]+\] )?.*?(section:\d+)/, '$1$2')}${tag}${cls.length ? `  .${cls.join('.')}` : ''}`;
      if (sa === undefined || sb === undefined) { add(p, `  ${short}\n      （伪元素只在 ${sa === undefined ? host : 'akds'}）`); continue; }
      const pa = props(sa), pb = props(sb);
      const d = [...new Set([...pa.keys(), ...pb.keys()])].filter(k => pa.get(k) !== pb.get(k)).filter(k => {
        const i = ALLOW.findIndex(w => w.hosts.includes(host) && w.props.includes(k) && (!w.el || (!tag && w.el(tagName, cls))));
        if (i >= 0) allowed[i]++;
        return i < 0;
      });
      if (d.length) add(p, `  ${short}\n      ${d.map(k => `${k}: ${pa.get(k) ?? '∅'} → ${pb.get(k) ?? '∅'}`).join('\n      ')}`);
    }
  }
  return { out, allowed };
}

/** 按块列出；perSection 限每块行数（失败消息里只列前几条，完整的进附件） */
const report = (out: Map<string, string[]>, perSection = Infinity) => [...out].map(([sec, lines]) =>
  [` [${sec}]`, ...lines.slice(0, perSection), ...(lines.length > perSection ? [`  …共 ${lines.length} 处`] : [])].join('\n')).join('\n');

// 一个用例开两个页面、逐个元素强制交互态拍计算样式：CI 的 2 核机器上要 20–30s，重试开了 trace 更慢，默认的 30s 不够
test.describe.configure({ mode: 'parallel', timeout: 120_000 });

for (const theme of ['dark', 'light']) {
  for (const host of HOSTS.filter(h => h !== 'akds')) {
    test(`${host}@${theme} 与 akds 一致`, async ({ browser, baseURL }, testInfo) => {
      // 夹具缺了不能跳过：对照页找不到夹具时 vector 宿主等于站外，比对会悄悄通过
      if (host === 'vector') for (const f of ['vector.css', 'site.css']) expect(existsSync(`${vendor}/${f}`), `Vector 样式夹具缺 ${f}（preview/vendor/vector/ 入库的；本地可用 node scripts/fetch-vector-css.ts 重抓）`).toBe(true);
      const [base, other] = await Promise.all([capture(browser, baseURL, 'akds', theme), capture(browser, baseURL, host, theme)]);
      for (const [h, s] of [['akds', base], [host, other]] as const) {
        const states = s.rows.filter(r => r[0].startsWith('[')).length;
        testInfo.annotations.push({ type: h, description: `${s.rows.length - states} 元素 / ${s.table.length} 种样式 / ${s.sections.length} 块；交互态 ${states} 行` });
      }
      for (const s of new Set([...base.skipped, ...other.skipped])) testInfo.annotations.push({ type: 'skipped-state', description: `这版 Chromium 不能强制 :${s}，交互态跳过` });
      const { out, allowed } = compare(base, other, host);
      ALLOW.forEach((w, i) => allowed[i] && testInfo.annotations.push({ type: 'allowed', description: `白名单放过 ${allowed[i]} 处 ${w.props.join(' / ')}：${w.why}` }));
      const count = [...out.values()].reduce((n, l) => n + l.length, 0);
      if (count) await testInfo.attach(`${host}@${theme}-diff.txt`, { body: report(out), contentType: 'text/plain' });
      expect(count, `${host}@${theme}：${count} 处与 akds 不同（完整列表见附件）\n${report(out, 15)}\n`).toBe(0);
    });
  }
}
