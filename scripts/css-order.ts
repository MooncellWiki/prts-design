/**
 * CSS 加载顺序只有一个来源：src/index.css → 各层 index.css 的 @import 顺序。
 * MediaWiki 的 ResourceLoader 不跟 @import（一个模块里的文件被拼成一张样式表，后面的 @import 失效），
 * 所以 skin/skin.json 必须逐文件列出——这里把 index.css 展开成文件列表，写进 skin.json 的两个模块：
 *   skins.akds.tokens   tokens.css + base/root.css（html / body 全局基底紧跟令牌）
 *   skins.akds.styles   其余全部（base → components → decor → arknights → chrome → utilities）
 * fonts.css 单独是 skins.akds.fonts，不动。
 *
 *   node scripts/css-order.ts          检查 skin.json 是否与 index.css 同序（CI 用，不一致退出码 1）
 *   node scripts/css-order.ts --write  写回 skin.json
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const src = join(root, 'packages/css/src');

/** 按 @import 顺序把 index.css 展开成叶子文件（相对 src/） */
async function expand(file: string): Promise<string[]> {
  const css = await readFile(file, 'utf8');
  const imports = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/@import\s+url\("([^"]+)"\)/g)].map(m => resolve(dirname(file), m[1]));
  if (!imports.length) return [relative(src, file)];
  return (await Promise.all(imports.map(expand))).flat();
}

const files = await expand(join(src, 'index.css'));
const TOKENS = ['tokens.css', 'base/root.css'];
const tokens = files.filter(f => TOKENS.includes(f));
const styles = files.filter(f => f !== 'fonts.css' && !TOKENS.includes(f));
if (tokens.join() !== TOKENS.join()) throw new Error(`index.css 里 tokens.css / base/root.css 的顺序不对：${tokens.join(' → ')}`);

const path = join(root, 'skin/skin.json');
const json = JSON.parse(await readFile(path, 'utf8'));
const mods = json.ResourceModules;
const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
const ok = same(mods['skins.akds.tokens'].styles, tokens) && same(mods['skins.akds.styles'].styles, styles);

if (process.argv.includes('--write')) {
  mods['skins.akds.tokens'].styles = tokens;
  mods['skins.akds.styles'].styles = styles;
  await writeFile(path, JSON.stringify(json, null, 2) + '\n');
  console.log(`skin.json：tokens ${tokens.length} 个文件 · styles ${styles.length} 个文件${ok ? '（本来就一致）' : '（已更新）'}`);
} else if (!ok) {
  console.error('skin/skin.json 的样式列表与 src/index.css 不同序，跑 node scripts/css-order.ts --write');
  process.exitCode = 1;
} else {
  console.log(`skin.json 与 index.css 同序（${tokens.length + styles.length} 个文件）`);
}
