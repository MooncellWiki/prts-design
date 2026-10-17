/**
 * 把现网的 mc-tooltips 脚本（prts-widgets 的 Tooltip 入口，static.prts.wiki 上线的那份）抓到 preview/vendor/tooltip/Tooltip.js，
 * 给敌人页样例 preview/enemy*.html 的悬停说明用。
 *
 *   node scripts/fetch-tooltip.ts
 *
 * 现网 {{Popup}} / {{术语}} / {{异常效果}} 都输出 .mc-tooltips：第一个子元素是触发点，第二个是藏起来的内容（data-size / data-trigger /
 * data-interactive / data-append-to），由这个脚本用 tippy 挂到 body 上显示，日间 light-border、夜间 dark-border（按 <html> 上的
 * skin-theme-clientpref-* 类判断）。样例页要和现网的气泡一模一样，所以直接用上线的那份，不自己画。
 *
 * 只做一处改动：整个文件包进一个立即执行的函数——上线的是 ES 模块（<script type="module">），样例页可以直接从 file:// 打开，
 * 那里模块加载不了（跨源），只能用普通 <script>；打包产物顶层是一串 var / function，不包一层会漏成全局变量。
 * 上线地址不带版本号，抓的时候记下日期和 SHA-256，现网换了脚本就重跑。
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/tooltip');
const URL = 'https://static.prts.wiki/widgets/production/Tooltip.js';

const res = await fetch(URL);
if (!res.ok) throw new Error(`${URL} → ${res.status}`);
const src = await res.text();
if (/^\s*(import|export)\s/m.test(src)) throw new Error('上线的 Tooltip.js 有 import / export 了，不能再当普通脚本用，脚本要跟着改');
if (!src.includes('mc-tooltips')) throw new Error('上线的 Tooltip.js 里没有 mc-tooltips，地址或入口变了');
const sha = createHash('sha256').update(src).digest('hex');
const date = new Date().toISOString().slice(0, 10);
const body = src.replace(/\n\/\/# sourceMappingURL=.*\s*$/, '\n');
const head = `/* 现网 mc-tooltips 脚本（prts-widgets 的 Tooltip 入口，内含 tippy.js / Popper）；${date} 由 scripts/fetch-tooltip.ts 取自 ${URL}（SHA-256 ${sha.slice(0, 12)}…），只包了一层立即执行函数。许可见同目录 NOTICE.md。 */\n`;
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'Tooltip.js'), `${head}(function () {\n${body}})();\n`);
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# mc-tooltips 脚本

\`Tooltip.js\` 是现网（prts.wiki）加载的 \`${URL}\`，即 [MooncellWiki/prts-widgets](https://github.com/MooncellWiki/prts-widgets) 的 \`src/entries/Tooltip.ts\` 打包后的产物，${date} 由 \`scripts/fetch-tooltip.ts\` 抓取（SHA-256 \`${sha}\`）。唯一的改动是整个文件包进一个立即执行的函数、去掉 sourceMappingURL（样例页用普通 \`<script>\` 加载）。

- prts-widgets 按 [MIT](https://github.com/MooncellWiki/prts-widgets/blob/main/LICENSE) 授权；打包进去的 [tippy.js](https://github.com/atomiks/tippyjs)、[Popper](https://github.com/floating-ui/floating-ui/tree/v2.x) 也都是 MIT。
- 只给敌人页样例 \`preview/enemy*.html\` 的悬停说明用（\`.mc-tooltips\`，同现网 \`{{Popup}}\` / \`{{术语}}\` 的输出）。
- 重抓：\`node scripts/fetch-tooltip.ts\`（现网换了脚本就重跑）。
`,
);
console.log(`preview/vendor/tooltip/Tooltip.js ← ${URL}（${(src.length / 1024).toFixed(0)} KB，sha256 ${sha.slice(0, 12)}）`);
