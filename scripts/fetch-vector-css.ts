/**
 * 把 prts.wiki 现网 Vector 2022 皮肤的样式抓成回归夹具 preview/vendor/vector/vector.css（**不入库**：Vector 是 GPL-2.0-or-later，目录在 .gitignore 里）。
 * 跨宿主对照页 preview/gallery.html?host=vector、Storybook 工具栏「宿主：Vector 2022」、scripts/verify/styles.ts hosts 都读它：
 * 同一份组件 HTML 放在 Vector 页面里，看宿主的正文 / 链接 / 标题规则有没有漏进组件。
 *
 *   node scripts/fetch-vector-css.ts           （CHROME=… 指定浏览器；默认 macOS 的 Google Chrome）
 *
 * 为什么不是 fetch-*.py 那样的 urllib：prts.wiki 前面的 WAF 按 TLS 指纹拦非浏览器客户端（curl / urllib 一律 403），这里用真浏览器（puppeteer-core）取。
 * 模块列表 = 现网 Vector 2022 页面 <head> 里第一条 load.php（皮肤 + 扩展样式；不含 site.styles / Gadget 这类站点自定义，也不含站外 CDN 的图标字体），
 * 取自 MediaWiki 1.43.9 的 prts.wiki（2026-09-28）。现网换了模块再改 MODULES；load.php 不认版本号，内容就是抓取当时的。
 * 样式表里的根相对 url(/…) 改成 https://prts.wiki/… 的绝对地址（本地没有这些图标；比对只看计算值，不需要真的取到）。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/vector');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SITE = 'https://prts.wiki';
const MW = 'MediaWiki 1.43.9';
const MODULES = ['ext.cite.styles', 'ext.srf.styles', 'ext.uls.pt', 'jquery.makeCollapsible.styles', 'skins.vector.icons', 'skins.vector.styles', 'skins.vector.search.codex.styles'];
const URL_ = `${SITE}/load.php?lang=zh-cn&modules=${encodeURIComponent(MODULES.join('|'))}&only=styles&skin=vector-2022`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: process.env.CI ? ['--no-sandbox'] : [] });
let css: string;
let generator: string | null | undefined;
try {
  const page = await browser.newPage();
  const res = await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (!res?.ok() || !res.headers()['content-type']?.includes('text/css')) throw new Error(`${URL_} → HTTP ${res?.status()} ${res?.headers()['content-type'] ?? ''}`);
  css = await res.text();
  // 顺带核一下现网的 MW 版本：变了只提示，不拦
  await page.goto(`${SITE}/?useskin=vector-2022`, { waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => null);
  generator = await page.evaluate(() => document.querySelector('meta[name="generator"]')?.getAttribute('content')).catch(() => null);
} finally {
  await browser.close();
}
if (generator && generator !== MW) console.warn(`注意：现网是 ${generator}，脚本里记的是 ${MW}——模块列表可能要跟着更新`);

const date = new Date().toISOString().slice(0, 10);
const body = css.replace(/url\((["']?)\/(?!\/)/g, `url($1${SITE}/`);
await mkdir(OUT, { recursive: true });
await writeFile(
  join(OUT, 'vector.css'),
  `/* 回归夹具（不入库）：prts.wiki 现网 Vector 2022 的皮肤 + 扩展样式，${generator ?? MW}，${date} 由 scripts/fetch-vector-css.ts 抓取。\n * ${URL_}\n * Vector 为 GPL-2.0-or-later，见同目录 NOTICE.md。 */\n${body}\n`,
);
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# Vector 2022 样式夹具

\`vector.css\` 是 prts.wiki 现网 Vector 2022 皮肤（及同页加载的几个扩展）经 ResourceLoader 输出的样式，${date} 由 \`scripts/fetch-vector-css.ts\` 抓取（${generator ?? MW}）：

    ${URL_}

**仅作跨宿主回归测试的夹具**（\`preview/gallery.html?host=vector\`、Storybook「宿主：Vector 2022」、\`node scripts/verify/styles.ts hosts\`），不属于 AKDS，不入库（目录在 \`.gitignore\` 里），也不随文档站发布。

许可：Vector 皮肤与 MediaWiki 核心样式为 GPL-2.0-or-later（https://www.mediawiki.org/wiki/Skin:Vector），各扩展按其各自的许可。
`,
);
console.log(`vector.css ← ${MODULES.length} 个模块，${(body.length / 1024).toFixed(0)} KB（${generator ?? MW}）→ ${join('preview/vendor/vector', 'vector.css')}`);
