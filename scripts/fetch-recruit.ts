/**
 * 把 prts.wiki 现网「公招计算」用的数据抓成快照 preview/vendor/recruit/data.js，给整页样例 preview/recruit.html 用。
 *
 *   node scripts/fetch-recruit.ts           （用本机装的 Google Chrome：Playwright 的 channel: 'chrome'，原因同 fetch-vector-css.ts——WAF 按 TLS 指纹拦非浏览器客户端）
 *
 * 现网页面 = {{#widget:HrCalculator}}：正文里只有一个 #root，prts-widgets 的 HrCalculator 挂上去后自己发一条 cargoquery
 * （src/entries/HrCalculator.ts：chara ⋈ char_obtain，取「获得方式含公开招募」的干员的 职业 / 位置 / 稀有度 / 词缀 / 名称 / 获得方式）。
 * 这里先开页面过 WAF，再在页面里发同一条查询；快照原样保留那六个字段（字段名 = Widget 的 Source，src/widgets/HrCalculator/utils.ts），只做两件事：
 *   1. 稀有度转 number、词缀 / 获得方式拆数组（同 Widget）；
 *   2. 头像的 media 路径前缀（文件名 md5 的前两位，同 Widget 的 getImagePath）算好放进 am，页面不用带 md5 实现。
 * 头像本身不入库：页面运行时从 media.prts.wiki 取。
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/recruit');
const URL = 'https://prts.wiki/w/%E5%85%AC%E6%8B%9B%E8%AE%A1%E7%AE%97';
const QUERY = {
  action: 'cargoquery',
  format: 'json',
  tables: 'chara,char_obtain',
  limit: '5000',
  fields: 'chara.profession,chara.position,chara.rarity,chara.tag,chara.cn,char_obtain.obtainMethod',
  where: 'char_obtain.obtainMethod like "%公开招募%" AND chara.charIndex>0',
  join_on: 'chara._pageName=char_obtain._pageName',
};

type Row = { profession: string; position: string; rarity: string; tag: string | null; cn: string; obtainMethod: string | null };

const browser = await chromium.launch({ channel: 'chrome' });
let rows: Row[], lastmod: string | null;
try {
  const page = await browser.newPage();
  const res = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (!res?.ok()) throw new Error(`${URL} → HTTP ${res?.status()}`);
  await page.waitForSelector('#root', { state: 'attached', timeout: 60_000 });
  ({ rows, lastmod } = await page.evaluate(async query => {
    const resp = await fetch(`/api.php?${new URLSearchParams(query)}`);
    const json = await resp.json();
    return {
      rows: json.cargoquery.map((o: { title: unknown }) => o.title),
      lastmod: document.querySelector('#footer-info-lastmod')?.textContent?.trim() ?? null,
    };
  }, QUERY));
} finally {
  await browser.close();
}

const md5 = (name: string) => createHash('md5').update(name).digest('hex').slice(0, 2);
const chars = rows.map(v => ({
  zh: v.cn,
  profession: v.profession,
  position: v.position,
  rarity: Number.parseInt(v.rarity),
  tag: v.tag ? v.tag.split(' ') : [],
  obtainMethod: v.obtainMethod ? v.obtainMethod.split(' ') : [],
  am: md5(`头像_${v.cn}.png`),
}));
if (chars.length < 100) throw new Error(`只取到 ${chars.length} 位干员，查询可能变了`);

const date = new Date().toISOString().slice(0, 10);
await mkdir(OUT, { recursive: true });
const body = `/* 现网「公招计算」数据快照（${date} 由 scripts/fetch-recruit.ts 抓取，${chars.length} 位可公开招募的干员；${lastmod ?? ''}）。许可见同目录 NOTICE.md。 */
window.PRTS_RECRUIT = ${JSON.stringify({ date, chars })};
`;
await writeFile(join(OUT, 'data.js'), body);
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# 公招计算数据快照

\`data.js\` 是 prts.wiki 现网[公招计算](${URL})页面的 Widget（prts-widgets 的 \`HrCalculator\`）运行时发的那条 cargoquery 的结果（获得方式含「公开招募」的干员：职业 / 位置 / 稀有度 / 词缀 / 名称 / 获得方式），${date} 由 \`scripts/fetch-recruit.ts\` 抓取，共 ${chars.length} 位干员。

- 文本内容（干员名称、词缀等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 \`preview/recruit.html\` 用；头像不入库，页面运行时从 \`media.prts.wiki\` 取。
- 重抓：\`node scripts/fetch-recruit.ts\`（用本机的 Google Chrome，原因见脚本头注释）。
`,
);
console.log(`data.js ${(body.length / 1024).toFixed(0)} KB · ${chars.length} 位干员 → ${OUT}`);
