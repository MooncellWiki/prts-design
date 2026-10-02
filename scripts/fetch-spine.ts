/**
 * 把 prts-widgets 的 Spine 运行时抓到 preview/vendor/spine/spine-webgl.js，给干员页样例 preview/operator.html 的「干员模型」用。
 *
 *   node scripts/fetch-spine.ts
 *
 * 现网的 SpineViewer（prts-widgets src/entries/SpineViewer.ts）打包进去的就是这一份：spine-webgl 3.8（游戏的骨骼是 3.8.99），
 * 外加 prts-widgets 自己的几处修补（如 c344ac9：旋转用 Math.fround，修 ±180° 处的路径翻转）。样例页要跑出和现网一样的姿态，
 * 所以取这一份而不是 npm 上的原版；提交号钉死，上游改了运行时再改这里的 COMMIT 重跑。
 *
 * 只做一处改动：文件结尾的 `export default spine` 换成 `window.spine = spine`——样例页可以直接从 file:// 打开，
 * 那里 ES 模块加载不了（跨源），只能用普通 <script>。
 * 模型本身（.skel / .atlas / .png）不入库：页面运行时从 torappu.prts.wiki 取（CORS 是 *）。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/spine');
const COMMIT = 'c344ac92298240f03d7863fa2aa71b3867406699';
const PATH = 'src/spine/runtime/spine-webgl.js';
const URL = `https://raw.githubusercontent.com/MooncellWiki/prts-widgets/${COMMIT}/${PATH}`;
const EXPORT = /\nexport default spine\s*$/;

const res = await fetch(URL);
if (!res.ok) throw new Error(`${URL} → ${res.status}`);
const src = await res.text();
if (!EXPORT.test(src)) throw new Error('运行时结尾不是 `export default spine`，上游改了导出方式，脚本要跟着改');
const date = new Date().toISOString().slice(0, 10);
const head = `/* Spine Runtimes 3.8（spine-webgl）+ prts-widgets 的修补；${date} 由 scripts/fetch-spine.ts 取自 MooncellWiki/prts-widgets@${COMMIT.slice(0, 7)} ${PATH}。许可见同目录 NOTICE.md。 */\n`;
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'spine-webgl.js'), head + src.replace(EXPORT, '\nwindow.spine = spine\n'));
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# Spine 运行时

\`spine-webgl.js\` 是 [Spine Runtimes](https://github.com/EsotericSoftware/spine-runtimes) 3.8 的 spine-webgl，带 prts-widgets 的几处修补，${date} 由 \`scripts/fetch-spine.ts\` 取自 [MooncellWiki/prts-widgets@${COMMIT.slice(0, 7)}](https://github.com/MooncellWiki/prts-widgets/blob/${COMMIT}/${PATH})——即现网 SpineViewer 打包的那一份。唯一的改动是结尾的 \`export default spine\` 换成 \`window.spine = spine\`（样例页用普通 \`<script>\` 加载）。

- 版权归 Esoteric Software 所有，按 [Spine Runtimes License](http://esotericsoftware.com/spine-runtimes-license) 使用，不在本仓库 MIT 许可范围内。
- 只给整页样例 \`preview/operator.html\` 的「干员模型」用；模型文件（.skel / .atlas / .png）不入库，页面运行时从 \`torappu.prts.wiki\` 取，版权归鹰角网络所有。
- 重抓：\`node scripts/fetch-spine.ts\`（上游改了运行时就改脚本里的 \`COMMIT\`）。
`,
);
console.log(`preview/vendor/spine/spine-webgl.js ← prts-widgets@${COMMIT.slice(0, 7)}（${(src.length / 1024).toFixed(0)} KB）`);
