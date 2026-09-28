/**
 * 单文件版（≈ primer/css 的 dist/primer.css）：src/standalone.css 按 @import 顺序内联成一张样式表，给不走打包器的页面用——
 * 纯 HTML 里一个 <link> 就齐（CDN：https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css/dist/prts-design.min.css），不用让浏览器逐级请求 80 多个 @import。
 *
 *   pnpm --filter @mooncellwiki/prts-design-css build   （= node build.ts；根目录 pnpm build 会带上它）
 *
 *   dist/prts-design.css       可读版：各文件的头注释原样保留，规则与 standalone.css 逐条对应（自定义属性的值会被重排空白，不改语义）
 *   dist/prts-design.min.css   压缩版：只留一行版权头
 *
 * 用 esbuild 而不是 lightningcss：lightningcss 不给 targets 时会删掉它认为多余的回退（-webkit-backdrop-filter、写在 100dvh 前面的 100vh），
 * esbuild 不做这种改写，只内联 + 去空白。target 保持默认（esnext），不做语法降级。
 * 令牌 tokens.css 是 @mooncellwiki/prts-design-tokens 生成进 src/ 的，devDependencies 里写上它，pnpm -r build 就会先跑令牌、再打这里。
 */
import { build, type BuildOptions } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const here = import.meta.dirname;
const { version } = JSON.parse(await readFile(resolve(here, 'package.json'), 'utf8'));
const banner = `/*! PRTS Design · @mooncellwiki/prts-design-css v${version} · MIT · https://mooncellwiki.github.io/prts-design/ */`;

const common: BuildOptions = { entryPoints: [resolve(here, 'src/standalone.css')], bundle: true, logLevel: 'warning' };
await build({ ...common, outfile: resolve(here, 'dist/prts-design.css'), legalComments: 'inline', banner: { css: banner } });
await build({ ...common, outfile: resolve(here, 'dist/prts-design.min.css'), legalComments: 'none', banner: { css: banner }, minify: true });
console.log(`css: dist/prts-design.css · dist/prts-design.min.css（v${version}）`);
