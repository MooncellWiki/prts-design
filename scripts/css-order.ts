/**
 * CSS 加载顺序只有一个来源：src/index.css → 各层 index.css 的 @import 顺序。
 * MediaWiki 的 ResourceLoader 不跟 @import（一个模块里的文件被拼成一张样式表，后面的 @import 失效），
 * 所以 skin/skin.json 必须逐文件列出——这里把 index.css 展开成文件列表，按规则分进模块：
 *
 *   skins.akds.base         bridge-codex.css + base/*（含 base/skin-assets.css；SkinModule）  Codex 桥接、皮肤素材、html / body 基底、MW 正文排版      只有 AKDS 皮肤
 *   skins.akds.components   tokens.css + scope.css + components → decor → arknights → utilities → forced-colors                                 AKDS 皮肤 + 任何皮肤的 widget / 模板入口
 *   skins.akds.fonts        fonts.css                                                                                                        AKDS 皮肤；别的皮肤想要官网字体时加载
 *   skins.akds.shell        chrome/*（L2 皮肤骨架）                                                                                            只有 AKDS 皮肤
 *   skins.akds.tokens       tokens.css + scope.css（纯令牌 + 作用域根，= components 的开头，不进皮肤的 styles）                                   别的皮肤上只要令牌时加载
 *
 * 两条 MediaWiki 事实决定了这个分法（includes/ResourceLoader/ClientHtml.php · FileModule.php，REL1_43）：
 *   · 皮肤 styles 里的模块在一个 load.php 请求里按**模块名字母序**输出（ClientHtml::makeLoad() 先 sort($modules)），不是 skin.json 里写的顺序。
 *     所以 base < components < shell 这个字母序就是层叠顺序；骨架模块不能叫 chrome（chrome < components）。
 *   · 带 dependencies 的模块不是 style-only（FileModule::getType() → LOAD_GENERAL），放进皮肤 styles 会被跳过（"Unexpected general module in styles queue"）。
 *     所以 components 不靠依赖拿令牌，而是自己带上 tokens.css + scope.css：别的皮肤 mw.loader.using("skins.akds.components") 一个模块就齐，
 *     AKDS 皮肤上它已经在 styles 里（状态 ready），这行是空操作。
 * 校验：
 *   (1) 皮肤 styles 里的模块按字母序拼起来，去掉「位置无关」的文件（只有 @font-face / 自定义属性 / color-scheme，挪到哪都一样）后，
 *       必须等于 index.css 的完整展开去掉同一批文件——即 MW 上的层叠顺序 = 单文件顺序；位置无关的文件本身也逐条检查确实只有这些声明。
 *   (2) standalone.css（npm 入口）展开后必须是 index.css 展开的子序列（同序，层叠结果与皮肤全套一致）。
 *
 *   node scripts/css-order.ts          检查 skin.json 是否与 index.css 同序（CI 用，不一致退出码 1）
 *   node scripts/css-order.ts --write  写回 skin.json（各模块的 styles 与皮肤的 styles 列表）
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

/** 位置无关：只有 @font-face，或只声明自定义属性 / color-scheme（令牌在级联里按元素解析，放在哪张表的哪个位置结果都一样） */
const ORDER_FREE = ['fonts.css', 'tokens.css', 'bridge-codex.css', 'base/skin-assets.css'];
async function assertOrderFree(f: string) {
  const css = (await readFile(join(src, f), 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '').replace(/@font-face\s*\{[^}]*\}/g, '');
  const bad = [...css.matchAll(/[{;]\s*([-\w]+)\s*:/g)].map(m => m[1]).filter(p => !p.startsWith('--') && p !== 'color-scheme');
  if (bad.length) throw new Error(`${f} 被当作位置无关，但里面有普通声明（${[...new Set(bad)].join(', ')}）——挪出 ORDER_FREE，或把这些声明移走`);
}

/** 皮肤 styles 里的模块（skin.json 里按字母序写，= 实际输出顺序） */
const SKIN_STYLES = ['skins.akds.base', 'skins.akds.components', 'skins.akds.fonts', 'skins.akds.shell'];
const TOKENS = ['tokens.css', 'scope.css'];
const moduleOf = (f: string) =>
  f === 'fonts.css' ? 'skins.akds.fonts'
  : f === 'bridge-codex.css' || f.startsWith('base/') ? 'skins.akds.base'
  : f.startsWith('chrome/') ? 'skins.akds.shell'
  : 'skins.akds.components';

const files = await expand(join(src, 'index.css'));
for (const f of ORDER_FREE) await assertOrderFree(f);
const groups: Record<string, string[]> = Object.fromEntries(SKIN_STYLES.map(m => [m, files.filter(f => moduleOf(f) === m)]));
// components 以 tokens.css + scope.css 开头（令牌随模块走，别的皮肤一个模块就齐）
const comps = groups['skins.akds.components'];
groups['skins.akds.components'] = [...TOKENS, ...comps.filter(f => !TOKENS.includes(f))];
groups['skins.akds.tokens'] = TOKENS;
const same = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

// (1) MW 的实际顺序（模块名字母序）去掉位置无关的文件 = index.css 去掉同一批
const loaded = [...SKIN_STYLES].sort().flatMap(m => groups[m]);
const fixed = (list: string[]) => list.filter(f => !ORDER_FREE.includes(f));
if (!same(fixed(loaded), fixed(files))) {
  const a = fixed(files), b = fixed(loaded);
  const i = b.findIndex((f, k) => f !== a[k]);
  throw new Error(`MW 上的加载顺序（模块名字母序：${[...SKIN_STYLES].sort().join(' → ')}）与 index.css 不一致：第 ${i + 1} 个有位置的文件 index.css 是 ${a[i]}，MW 上是 ${b[i]}`);
}
const missing = files.filter(f => !loaded.includes(f));
if (missing.length) throw new Error(`index.css 里有文件没进任何皮肤模块：${missing.join(', ')}`);

// (2) standalone.css 必须是 index.css 的子序列
const standalone = await expand(join(src, 'standalone.css'));
let k = 0;
for (const f of files) if (f === standalone[k]) k++;
if (k !== standalone.length) {
  console.error(`standalone.css 不是 index.css 的子序列（同序）：从 ${standalone[k]} 起对不上——两个入口的层叠结果会不一致`);
  process.exitCode = 1;
}

const path = join(root, 'skin/skin.json');
const json = JSON.parse(await readFile(path, 'utf8'));
const mods = json.ResourceModules;
const args = json.ValidSkinNames.akds.args[0];
const ALL = [...SKIN_STYLES, 'skins.akds.tokens'];
const ok = ALL.every(m => mods[m] && same(mods[m].styles ?? [], groups[m])) && same(args.styles, SKIN_STYLES);
for (const m of ALL) if (mods[m]?.dependencies?.length && SKIN_STYLES.includes(m)) throw new Error(`${m} 在皮肤 styles 里，不能有 dependencies（会变成 general 模块被 MW 跳过）`);
const summary = ALL.map(m => `${m.replace('skins.akds.', '')} ${groups[m].length}`).join(' · ');

if (process.argv.includes('--write')) {
  for (const m of ALL) {
    if (!mods[m]) throw new Error(`skin.json 里没有模块 ${m}（新模块的其余字段要先手写好，本脚本只同步 styles）`);
    mods[m].styles = groups[m];
  }
  args.styles = SKIN_STYLES;
  await writeFile(path, JSON.stringify(json, null, 2) + '\n');
  console.log(`skin.json：${summary}${ok ? '（本来就一致）' : '（已更新）'}`);
} else if (!ok) {
  console.error('skin/skin.json 的样式列表与 src/index.css 不同序，跑 node scripts/css-order.ts --write');
  process.exitCode = 1;
} else if (!process.exitCode) {
  console.log(`skin.json 与 index.css 同序（${files.length} 个文件：${summary}）；standalone.css 是其子序列（${standalone.length} 个文件）`);
}
