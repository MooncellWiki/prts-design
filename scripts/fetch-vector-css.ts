/**
 * 把 prts.wiki 现网 Vector 2022 皮肤的样式抓成回归夹具 preview/vendor/vector/vector.css，站点自定义样式（site.styles = MediaWiki:Common.css / Vector.css …）
 * 抓成同目录 site.css。**入库只作回归测试的夹具**（Vector 是 GPL-2.0-or-later、站点样式版权归 prts.wiki 编者，见同目录 NOTICE.md），不随文档站发布：
 * e2e 不出网、CI 不抓，现网 MW 升级或 Common.css 改了才在本地重跑本脚本、提交新夹具。
 * 跨宿主对照页 preview/gallery.html?host=vector、Storybook 工具栏「宿主：Vector 2022」、e2e/hosts.spec.ts 都读它：
 * 同一份组件 HTML 放在 Vector 页面里，看宿主的正文 / 链接 / 标题规则有没有漏进组件。
 *
 *   node scripts/fetch-vector-css.ts           （用本机装的 Google Chrome：Playwright 的 channel: 'chrome'）
 *
 * 为什么不是 fetch-*.py 那样的 urllib：prts.wiki 前面的 WAF 按 TLS 指纹拦非浏览器客户端（curl / urllib 一律 403），这里用本机的 Google Chrome 取（Playwright 自带的 chromium-headless-shell 照样 403）。
 * vector.css 的模块列表 = 现网 Vector 2022 页面 <head> 里第一条 load.php（皮肤 + 扩展样式；不含 Gadget，也不含站外 CDN 的图标字体），
 * 取自 MediaWiki 1.43.9 的 prts.wiki（2026-09-28）。现网换了模块再改 MODULES；load.php 不认版本号，内容就是抓取当时的。
 * site.css 单独抓：MW 上 mw.loader 动态加载的样式插在 <meta name="ResourceLoaderDynamicStyles"> 之前，即皮肤样式之后、site.styles 之前——
 * 所以别的皮肤上 skins.akds.components 压得过 Vector 自己的规则，却压不过 Common.css 里同特指度的规则；对照页 / Storybook 的 vector 宿主把它排在 standalone.css 之后。
 * 样式表里的根相对 url(/…) 改成 https://prts.wiki/… 的绝对地址（本地没有这些图标；比对只看计算值，不需要真的取到）。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const OUT = join(root, 'preview/vendor/vector');
const SITE = 'https://prts.wiki';
const MW = 'MediaWiki 1.43.9';
const MODULES = ['ext.cite.styles', 'ext.srf.styles', 'ext.uls.pt', 'jquery.makeCollapsible.styles', 'skins.vector.icons', 'skins.vector.styles', 'skins.vector.search.codex.styles'];
const loadUrl = (modules: string[]) => `${SITE}/load.php?lang=zh-cn&modules=${encodeURIComponent(modules.join('|'))}&only=styles&skin=vector-2022`;
const FILES = [{ name: 'vector.css', modules: MODULES, what: '皮肤 + 扩展样式' }, { name: 'site.css', modules: ['site.styles'], what: '站点自定义样式（MediaWiki:Common.css / Vector.css …）' }];

const browser = await chromium.launch({ channel: 'chrome' });
const css: Record<string, string> = {};
let generator: string | null | undefined;
try {
  const page = await browser.newPage();
  for (const f of FILES) {
    const res = await page.goto(loadUrl(f.modules), { waitUntil: 'domcontentloaded', timeout: 60_000 });
    if (!res?.ok() || !res.headers()['content-type']?.includes('text/css')) throw new Error(`${loadUrl(f.modules)} → HTTP ${res?.status()} ${res?.headers()['content-type'] ?? ''}`);
    css[f.name] = await res.text();
  }
  // 顺带核一下现网的 MW 版本：变了只提示，不拦
  await page.goto(`${SITE}/?useskin=vector-2022`, { waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => null);
  generator = await page.evaluate(() => document.querySelector('meta[name="generator"]')?.getAttribute('content')).catch(() => null);
} finally {
  await browser.close();
}
if (generator && generator !== MW) console.warn(`注意：现网是 ${generator}，脚本里记的是 ${MW}——模块列表可能要跟着更新`);

const date = new Date().toISOString().slice(0, 10);
await mkdir(OUT, { recursive: true });
const sizes: string[] = [];
for (const f of FILES) {
  const body = css[f.name].replace(/url\((["']?)\/(?!\/)/g, `url($1${SITE}/`);
  await writeFile(join(OUT, f.name), `/* 回归夹具（只作测试，不随站点发布）：prts.wiki 现网 Vector 2022 的${f.what}，${generator ?? MW}，${date} 由 scripts/fetch-vector-css.ts 抓取。\n * ${loadUrl(f.modules)}\n * 许可见同目录 NOTICE.md。 */\n${body}\n`);
  sizes.push(`${f.name} ${(body.length / 1024).toFixed(0)} KB`);
}
await writeFile(
  join(OUT, 'NOTICE.md'),
  `# Vector 2022 样式夹具

\`vector.css\` 是 prts.wiki 现网 Vector 2022 皮肤（及同页加载的几个扩展）经 ResourceLoader 输出的样式，\`site.css\` 是同站的 \`site.styles\`（MediaWiki:Common.css / Vector.css …），${date} 由 \`scripts/fetch-vector-css.ts\` 抓取（${generator ?? MW}）：

${FILES.map(f => `    ${loadUrl(f.modules)}`).join('\n')}

**仅作跨宿主回归测试的夹具**（\`preview/gallery.html?host=vector\`、Storybook「宿主：Vector 2022」、\`pnpm e2e --project=hosts\`），不属于 PRTS Design；入库只为让测试不出网，不随文档站发布（\`scripts/build-site.sh\` 组装站点时删掉）。

许可：Vector 皮肤与 MediaWiki 核心样式为 GPL-2.0-or-later（https://www.mediawiki.org/wiki/Skin:Vector），各扩展按其各自的许可；站点自定义样式版权归 prts.wiki 的编者。
`,
);
console.log(`${sizes.join('，')}（${generator ?? MW}）→ preview/vendor/vector/`);
