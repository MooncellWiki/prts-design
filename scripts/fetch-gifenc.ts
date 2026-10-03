/**
 * 把 GIF 编码器 gifenc 抓到 preview/vendor/gifenc/gifenc.js，给干员页样例 preview/operator.html「干员模型」的 GIF 导出用。
 *
 *   node scripts/fetch-gifenc.ts
 *
 * 现网的 SpineViewer（prts-widgets src/widgets/SpineViewer/engine/gif.ts）用的就是 npm 上的 gifenc，点了导出才动态 import；
 * 样例页取同一个版本（VERSION 钉死，prts-widgets 升级了再改这里重跑）。
 *
 * 只做一处改动：结尾的 `export{…}` 换成 `window.gifenc = {…}`，整个文件包进一个函数——样例页可以直接从 file:// 打开，
 * 那里 ES 模块加载不了（跨源），只能用普通 <script>；包一层是因为压缩后的顶层变量（单字母）不能漏成全局。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/gifenc');
const VERSION = '1.0.3';
const BASE = `https://cdn.jsdelivr.net/npm/gifenc@${VERSION}`;
const EXPORT = /export\{([^}]*)\};?\s*(\/\/# sourceMappingURL=\S+\s*)?$/;

const get = async (path: string) => {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`${BASE}/${path} → ${res.status}`);
  return res.text();
};
const [src, license] = await Promise.all([get('dist/gifenc.esm.js'), get('LICENSE.md')]);
const m = EXPORT.exec(src);
if (!m) throw new Error('结尾不是 `export{…}`，上游改了打包方式，脚本要跟着改');
const names = m[1].split(',').map((s) => {
  const [local, as] = s.trim().split(/\s+as\s+/);
  return `${as ?? local}:${local}`;
});
const date = new Date().toISOString().slice(0, 10);
const head = `/* gifenc ${VERSION}（MIT，Matt DesLauriers）；${date} 由 scripts/fetch-gifenc.ts 取自 npm gifenc@${VERSION} dist/gifenc.esm.js。许可见同目录 NOTICE.md。 */\n`;
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'gifenc.js'), `${head}(function(){${src.slice(0, m.index)}window.gifenc={${names.join(',')}};})();\n`);
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# gifenc

\`gifenc.js\` 是 [gifenc](https://github.com/mattdesl/gifenc) ${VERSION} 的 \`dist/gifenc.esm.js\`，${date} 由 \`scripts/fetch-gifenc.ts\` 取自 npm——与现网 SpineViewer（prts-widgets）导出 GIF 用的是同一个版本。唯一的改动是结尾的 \`export{…}\` 换成 \`window.gifenc = {…}\`、整个文件包进一个函数（样例页用普通 \`<script>\` 加载）。

- 只给整页样例 \`preview/operator.html\` 的「干员模型」导出 GIF 用，点了导出才加载。
- 重抓：\`node scripts/fetch-gifenc.ts\`（prts-widgets 升级了 gifenc 就改脚本里的 \`VERSION\`）。

## 许可

${license.trim()}
`,
);
console.log(`preview/vendor/gifenc/gifenc.js ← gifenc@${VERSION}（${(src.length / 1024).toFixed(0)} KB）`);
