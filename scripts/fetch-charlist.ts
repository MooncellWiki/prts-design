/**
 * 把 prts.wiki 现网「干员一览」页面的数据抓成快照 preview/vendor/charlist/data.js，给整页样例 preview/operators.html 用。
 *
 *   node scripts/fetch-charlist.ts           （用本机装的 Google Chrome：Playwright 的 channel: 'chrome'，原因同 fetch-vector-css.ts——WAF 按 TLS 指纹拦非浏览器客户端）
 *
 * 现网页面 = {{#widget:CharList}}：模板往正文里输出两块数据，prts-widgets 的 CharList 挂到 #root 上读它们——
 *   #filter-filter   JSON：{ filters: [{ title, filter: [{ title, cbt, both, field }] }] }   三组筛选（筛选 / 六维筛选 / 势力·出身地·种族）
 *   #filter-data     每位干员一个 <div data-zh data-profession data-rarity …>特性 HTML</div>
 * 快照原样保留这两块的内容（字段名 = Widget 的 Char 类，src/widgets/CharList/utils.ts），只做三件事：
 *   1. data-* 解析成 Char 的形状（数值转 number、多值拆数组、部署费用 / 阻挡取「a→b→c」的最后一段——同 Widget 的 getLast）；
 *   2. 特性 HTML 换成设计系统的写法：内联 color:#00B0FF → .ak-rt-kw，{{术语}} 的 .mc-tooltips → .ak-term[data-tip]（提示正文转成纯文本）；
 *   3. 头像 / 半身像的 media 路径前缀（文件名 md5 的前两位，同 Widget 的 getImagePath）算好放进 am / hm，页面不用带 md5 实现。
 * 图片本身不入库：页面运行时从 media.prts.wiki 取（同干员页舞台的立绘 / 语音）。
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/charlist');
const URL = 'https://prts.wiki/w/%E5%B9%B2%E5%91%98%E4%B8%80%E8%A7%88';

type Raw = { d: Record<string, string>; feature: string; plain: string };

const browser = await chromium.launch({ channel: 'chrome' });
let filters: unknown, raws: Raw[], lastmod: string | null;
try {
  const page = await browser.newPage();
  const res = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (!res?.ok()) throw new Error(`${URL} → HTTP ${res?.status()}`);
  await page.waitForSelector('#filter-data > div', { state: 'attached', timeout: 60_000 });
  ({ filters, raws, lastmod } = await page.evaluate(() => {
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    /* 特性 HTML → 设计系统写法。只认现网实际出现的三种节点：彩色 span、术语 .mc-tooltips、其余标签（<br> / <b> …）只留文字 */
    const conv = (node: Node): string => {
      if (node.nodeType === 3) return esc(node.nodeValue ?? '');
      if (!(node instanceof HTMLElement)) return '';
      if (node.classList.contains('mc-tooltips')) {
        const [term, tip] = Array.from(node.children) as HTMLElement[];
        if (tip) tip.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
        const text = (tip?.textContent ?? '').replace(/^术语[:：]\s*[^\n]*\n?/, '').replace(/[ \t]+/g, ' ').trim();   // 去掉首行「术语: xx」——触发词自己就是它
        return `<span class="ak-term" tabindex="0" data-tip="${esc(text)}">${esc(term?.textContent ?? '')}</span>`;
      }
      const inner = Array.from(node.childNodes).map(conv).join('');
      if (node.tagName === 'BR') return '<br>';
      if (/#00B0FF/i.test(node.getAttribute('style') ?? '')) return `<span class="ak-rt-kw">${inner}</span>`;
      return inner;
    };
    const plain = (el: HTMLElement) => {   // 搜索用的纯文本：去掉术语提示正文（同 Widget 的 plainFeature）
      const c = el.cloneNode(true) as HTMLElement;
      c.querySelectorAll('.mc-tooltips').forEach(t => t.children[1]?.remove());
      return (c.textContent ?? '').trim();
    };
    return {
      filters: JSON.parse(document.querySelector('#filter-filter')!.textContent!).filters,
      raws: Array.from(document.querySelectorAll<HTMLElement>('#filter-data > div')).map(el => ({ d: { ...el.dataset } as Record<string, string>, feature: Array.from(el.childNodes).map(conv).join('').trim(), plain: plain(el) })),
      lastmod: document.querySelector('#footer-info-lastmod')?.textContent?.trim() ?? null,
    };
  }));
} finally {
  await browser.close();
}

const md5 = (name: string) => createHash('md5').update(name).digest('hex').slice(0, 2);
const last = (s: string) => Number.parseInt(s.includes('→') ? s.split('→').at(-1)! : s);
const chars = raws.map(({ d, feature, plain }) => {
  const [types, values] = (d.potential ?? '').split('`').map(v => v.split(','));
  return {
    zh: d.zh, en: d.en ?? '', ja: d.ja ?? '', id: d.id ?? '', sortId: Number.parseInt(d.sortid),
    profession: d.profession, subProfession: d.subprofession, rarity: Number.parseInt(d.rarity), position: d.position, sex: d.sex ?? '',
    logo: d.logo ?? '', force: [d.nation, d.group, d.team].filter(Boolean), birthPlace: d.birthPlace ?? '', race: (d.race ?? '').split('/'),
    hp: Number.parseInt(d.hp), atk: Number.parseInt(d.atk), def: Number.parseInt(d.def), res: Number.parseInt(d.res),
    reDeploy: d.reDeploy ?? '', cost: last(d.cost), block: last(d.block), interval: d.interval,
    tag: d.tag ? d.tag.split(' ') : [], obtainMethod: d.obtainMethod ? d.obtainMethod.split(', ') : [],
    potential: types && values ? types.map((t, i) => ({ type: t, value: Number.parseInt(values[i]) })).filter(p => p.type) : [],
    trust: (d.trust ?? '').split(',').map(v => (v ? Number.parseInt(v) : 0)),
    phy: d.phy ?? '', flex: d.flex ?? '', tolerance: d.tolerance ?? '', plan: d.plan ?? '', skill: d.skill ?? '', adapt: d.adapt ?? '',
    feature, plainFeature: plain,
    am: md5(`头像_${d.zh}.png`), hm: md5(`半身像_${d.zh}_1.png`),
  };
});
if (chars.length < 300) throw new Error(`只取到 ${chars.length} 位干员，页面结构可能变了`);

const date = new Date().toISOString().slice(0, 10);
await mkdir(OUT, { recursive: true });
const body = `/* 现网「干员一览」数据快照（${date} 由 scripts/fetch-charlist.ts 抓取，${chars.length} 位干员；${lastmod ?? ''}）。许可见同目录 NOTICE.md。 */
window.PRTS_CHARLIST = ${JSON.stringify({ date, filters, chars })};
`;
await writeFile(join(OUT, 'data.js'), body);
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# 干员一览数据快照

\`data.js\` 是 prts.wiki 现网[干员一览](${URL})页面正文里的两块数据（\`#filter-filter\` 筛选项定义、\`#filter-data\` 每位干员一条），${date} 由 \`scripts/fetch-charlist.ts\` 抓取，共 ${chars.length} 位干员。

- 文本内容（干员名称、特性描述等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 \`preview/operators.html\` 用；头像 / 半身像不入库，页面运行时从 \`media.prts.wiki\` 取。
- 重抓：\`node scripts/fetch-charlist.ts\`（用本机的 Google Chrome，原因见脚本头注释）。
`,
);
console.log(`data.js ${(body.length / 1024).toFixed(0)} KB · ${chars.length} 位干员 → ${OUT}`);
