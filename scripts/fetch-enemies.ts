/**
 * 把 prts.wiki 现网「敌人一览」用的数据抓成快照 preview/vendor/enemies/data.js，给整页样例 preview/enemies.html 用。
 *
 *   node scripts/fetch-enemies.ts           （用本机装的 Google Chrome：Playwright 的 channel: 'chrome'，原因同 fetch-vector-css.ts——WAF 按 TLS 指纹拦非浏览器客户端）
 *
 * 现网页面 = {{#widget:EnemiesListV2}}：正文里只有一个 #root，prts-widgets 的 EnemiesListV2 挂上去后自己取「敌人一览/数据」那份 JSON
 * （src/entries/EnemiesListV2.ts：index.php?title=敌人一览/数据&action=raw，机器人按游戏数据维护，每个敌人一条）。
 * 这里先开页面过 WAF，再在页面里取同一份；快照原样保留每条的字段（字段名 = Widget 的 EnemyData，src/widgets/EnemiesListV2/enemy.ts），只做两件事：
 *   1. 一千七百多条、每条十八个字段名太占地方：字段名只写一遍（fields），每个敌人是一行按同样次序排的值（rows）；
 *   2. 头像的 media 路径前缀（文件名 md5 的前两位，同 Widget 的 getImagePath）算好放在每行最后（am），页面不用带 md5 实现。
 * 能力（ability）是数据里的 HTML 原文，怎么转成设计系统的写法由页面脚本做（= Widget 的 convertAbility）。
 * 头像本身不入库：页面运行时从 media.prts.wiki 取。
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/enemies');
const URL = 'https://prts.wiki/w/%E6%95%8C%E4%BA%BA%E4%B8%80%E8%A7%88';
const QUERY = { title: '敌人一览/数据', action: 'raw', ctype: 'application/json' };
/** Widget 的 EnemyData 的字段，快照里每行按这个次序 */
const FIELDS = [
  'enemyIndex', 'sortId', 'name', 'enemyLink', 'enemyRace', 'enemyLevel', 'attackType', 'damageType', 'motion',
  'endure', 'attack', 'defence', 'resistance', 'moveSpeed', 'attackSpeed', 'enemyRes', 'enemyDamageRes', 'ability',
] as const;

type Row = Record<(typeof FIELDS)[number], string | number>;

const browser = await chromium.launch({ channel: 'chrome' });
let list: Row[], lastmod: string | null;
try {
  const page = await browser.newPage();
  const res = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (!res?.ok()) throw new Error(`${URL} → HTTP ${res?.status()}`);
  await page.waitForSelector('#root', { state: 'attached', timeout: 60_000 });
  ({ list, lastmod } = await page.evaluate(async query => {
    const resp = await fetch(`/index.php?${new URLSearchParams(query)}`);
    if (!resp.ok) throw new Error(`敌人一览/数据 → HTTP ${resp.status}`);
    return {
      list: await resp.json(),
      lastmod: document.querySelector('#footer-info-lastmod')?.textContent?.trim() ?? null,
    };
  }, QUERY));
} finally {
  await browser.close();
}
if (!Array.isArray(list) || list.length < 1000) throw new Error(`只取到 ${Array.isArray(list) ? list.length : 0} 个敌人，数据页可能变了`);
const missing = FIELDS.filter(k => !(k in list[0]));
if (missing.length) throw new Error(`数据里没有字段 ${missing.join('、')}，Widget 的 EnemyData 可能变了`);

const md5 = (name: string) => createHash('md5').update(name).digest('hex').slice(0, 2);
const rows = list.map(e => [...FIELDS.map(k => e[k] ?? ''), md5(`头像_敌人_${e.name}.png`)]);

const date = new Date().toISOString().slice(0, 10);
await mkdir(OUT, { recursive: true });
const body = `/* 现网「敌人一览」数据快照（${date} 由 scripts/fetch-enemies.ts 抓取，${rows.length} 个敌人；${lastmod ?? ''}）。许可见同目录 NOTICE.md。 */
window.PRTS_ENEMIES = ${JSON.stringify({ date, fields: [...FIELDS, 'am'], rows })};
`;
await writeFile(join(OUT, 'data.js'), body);
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# 敌人一览数据快照

\`data.js\` 是 prts.wiki 现网[敌人一览](${URL})页面的 Widget（prts-widgets 的 \`EnemiesListV2\`）运行时取的那份 JSON（[敌人一览/数据](https://prts.wiki/w/%E6%95%8C%E4%BA%BA%E4%B8%80%E8%A7%88/%E6%95%B0%E6%8D%AE)：每个敌人的图鉴编号 / 名称 / 地位 / 种类 / 攻击方式 / 伤害类型 / 行动方式 / 八项属性的等级 / 能力），${date} 由 \`scripts/fetch-enemies.ts\` 抓取，共 ${rows.length} 个敌人。

- 文本内容（敌人名称、能力描述等）来自 prts.wiki，按 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 使用；游戏数据版权归鹰角网络所有。不在本仓库 MIT 许可范围内。
- 只给整页样例 \`preview/enemies.html\` 用；头像不入库，页面运行时从 \`media.prts.wiki\` 取。
- 重抓：\`node scripts/fetch-enemies.ts\`（用本机的 Google Chrome，原因见脚本头注释）。
`,
);
console.log(`data.js ${(body.length / 1024).toFixed(0)} KB · ${rows.length} 个敌人 → ${OUT}`);
