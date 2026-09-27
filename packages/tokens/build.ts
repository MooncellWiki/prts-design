/**
 * AKDS primitives（≈ primer/primitives，npm 包 @mooncellwiki/akds-tokens）：src/**\/*.json5（W3C DTCG 格式）→ ../css/src/tokens.css + tokens.json
 *
 *   pnpm tokens      （= node tokens/build.ts）
 *
 * 源文件分三层，和 CSS 里的块一一对应：
 *   base/*            原始色板 + 主题无关的尺寸 / 字体 / 动效 / 层级        → :root
 *   functional/*      语义令牌：themes/light · dark（同一套键）、contrast-more、chrome（页眉 / 头图 / 画布主题接口）、control
 *   bridge/codex      MediaWiki Codex 令牌 → AKDS 语义令牌的桥接（变量名不带 --ak- 前缀）
 *
 * 命名：变量名 = 路径最后一段（`color.neutral.gray-50` → --ak-gray-50；bridge/codex 下的不加前缀），分组只管组织和文档。
 * 引用 `{theme.foreground.fg-muted}` 输出成 var(--ak-fg-muted)——主题切换靠级联，不在构建期解析。
 * 暗色块输出两次：显式暗色（data-theme / clientpref-night）+ 跟随系统的 @media 版，同一份源，不再手抄。
 */
import StyleDictionary from 'style-dictionary';
import type { DesignTokens, TransformedToken } from 'style-dictionary/types';
import { readFile, writeFile } from 'node:fs/promises';
import JSON5 from 'json5';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');   // 仓库根
const src = (f: string) => resolve(import.meta.dirname, 'src', f);
const BASE = ['base/color.json5', 'base/typography.json5', 'base/size.json5', 'base/motion.json5', 'base/z-index.json5', 'base/asset.json5', 'functional/control.json5'].map(src);
const LIGHT = src('functional/themes/light.json5');
const DARK = src('functional/themes/dark.json5');
const CONTRAST = src('functional/themes/contrast-more.json5');
const CHROME = src('functional/chrome.json5');
const CODEX = src('bridge/codex.json5');

const nameOf = (path: string[]) => (path[0] === 'codex' ? '' : 'ak-') + path.at(-1);
StyleDictionary.registerTransform({ name: 'name/akds', type: 'name', transform: t => nameOf(t.path) });

/** 原始写法（含 {引用}）→ CSS 值：引用改 var(--名字)，在级联里随主题解析 */
const cssValue = (v: unknown) => String(v).replace(/\{([^}]+)\}/g, (_, ref: string) => `var(--${nameOf(ref.split('.'))})`);

async function load(source: string[], include: string[] = []) {
  const sd = new StyleDictionary({ source, include, log: { verbosity: 'silent' }, platforms: { css: { transforms: ['name/akds'] } } });
  return sd.getPlatformTokens('css');
}

type Block = { title: string; selector: string; media?: string; decls?: string[]; source: string[]; include?: string[] };
const DARK_SELECTOR = ':root[data-theme="dark"],\nhtml.skin-theme-clientpref-night';
const OS_DARK_SELECTOR = ':root:not([data-theme="light"]):not(.skin-theme-clientpref-day):not([data-theme="dark"]):not(.skin-theme-clientpref-night)';
const BLOCKS: Block[] = [
  { title: '1. PRIMITIVE PALETTE · 2a. THEME-INDEPENDENT SEMANTICS', selector: ':root', source: BASE, include: [LIGHT] },
  { title: '2b. SEMANTIC TOKENS · LIGHT（"档案模式" · in-game archive / white UI）', selector: ':root', decls: ['color-scheme: light'], source: [LIGHT], include: BASE },
  { title: '2c. SEMANTIC TOKENS · DARK（"终端模式" · main menu / PRTS terminal）', selector: DARK_SELECTOR, decls: ['color-scheme: dark'], source: [DARK], include: BASE },
  { title: '跟随系统：仅当未显式指定时生效（= 2c，同一份源）', media: '(prefers-color-scheme: dark)', selector: OS_DARK_SELECTOR, decls: ['color-scheme: dark'], source: [DARK], include: BASE },
  { title: '2d. CHROME · 页眉 / 头图 / 画布 的主题接口', selector: ':root', source: [CHROME], include: [...BASE, LIGHT] },
  { title: '3. CODEX / MEDIAWIKI BRIDGE', selector: ':root, html.skin-theme-clientpref-night, :root[data-theme="dark"]', source: [CODEX], include: [...BASE, LIGHT] },
  { title: '高对比偏好：只有亮色吃得到（暗色块选择器特指度更高，压过这里的 :root——沿用原行为）', media: '(prefers-contrast: more)', selector: ':root', source: [CONTRAST], include: [...BASE, LIGHT] },
];

/** 分组的 $description：Style Dictionary 变换后的树里不保留，直接读源文件（按块各读各的，亮 / 暗的分组说明可以不同） */
async function groupDescriptions(files: string[]) {
  const out = new Map<string, string>();
  const walk = (node: Record<string, unknown>, path: string[]) => {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$') || !v || typeof v !== 'object' || '$value' in v) continue;
      const g = v as Record<string, unknown>;
      if (typeof g.$description === 'string') out.set([...path, k].join('.'), g.$description);
      walk(g, [...path, k]);
    }
  };
  for (const f of files) walk(JSON5.parse(await readFile(f, 'utf8')), []);
  return out;
}

const isToken = (n: unknown): n is TransformedToken => !!n && typeof n === 'object' && '$value' in n;
const comment = (text: string, pad: string) => {
  const lines = text.split('\n');
  return lines.length === 1 ? `${pad}/* ${text} */` : `${pad}/* ${lines.join(`\n${pad} * `)} */`;
};

/** 按源文件里的顺序走树：分组的 $description 输出成小标题注释，令牌的 $description 跟在行尾 */
function emit(node: DesignTokens, pad: string, out: string[], descs: Map<string, string>, trail: string[] = []) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$') || !v || typeof v !== 'object') continue;
    if (isToken(v)) {
      if (!v.isSource) continue;
      const decl = `${pad}--${v.name}: ${cssValue(v.original.$value)};`;
      const d = v.$description as string | undefined;
      if (!d) out.push(decl);
      else if (!d.includes('\n')) out.push(`${decl.padEnd(40)}   /* ${d} */`);
      else out.push(`${decl.padEnd(40)}   /* ${d.split('\n').join(`\n${' '.repeat(Math.max(40, decl.length) + 3)}   `)} */`);
      continue;
    }
    const group = v as DesignTokens;
    const hasSource = JSON.stringify(group).includes('"isSource":true');
    if (!hasSource) continue;
    const path = [...trail, k];
    const d = descs.get(path.join('.'));
    out.push('', comment(d ? `─── ${path.join(' · ')} · ${d}` : `─── ${path.join(' · ')}`, pad));
    emit(group, pad, out, descs, path);
  }
}

const css: string[] = [
  `/*! ═══════════════════════════════════════════════════════════════════════════
 *  AKDS — 明日方舟网页设计系统 · Design Tokens
 *  Arknights Web Design System for MediaWiki skins (prts.wiki)
 *
 *  生成物，勿手改：源文件是 packages/tokens/src/ 下的 *.json5（W3C DTCG 格式，@mooncellwiki/akds-tokens），改完 pnpm tokens 重新生成。
 *
 *  层级：
 *    1. Primitive  --ak-{hue}-{step}      原始色板（来源：官网 CSS / 游戏解包 / gamedata）
 *    2. Semantic   --ak-{role}            语义令牌（随主题变化）
 *    3. Bridge     Codex / MediaWiki 令牌   让 MW 核心 & 扩展 UI 自动跟随主题
 *
 *  主题机制（与 MediaWiki 1.43 clientPrefs 一致）：
 *    <html class="skin-theme-clientpref-os">    跟随系统（默认）
 *    <html class="skin-theme-clientpref-night"> 终端模式（暗）
 *    <html class="skin-theme-clientpref-day">   档案模式（亮）
 *  非 MW 环境亦可用 data-theme="dark|light"。
 *  html / body 等元素的全局样式不在这里，见 base/root.css。
 * ═══════════════════════════════════════════════════════════════════════════ */`,
];
for (const b of BLOCKS) {
  const dict = await load(b.source, b.include);
  const pad = b.media ? '    ' : '  ';
  const body: string[] = [];
  for (const d of b.decls ?? []) body.push(`${pad}${d};`);
  emit(dict.tokens, pad, body, await groupDescriptions(b.source));
  const sel = b.media ? b.selector.split('\n').map(s => '  ' + s).join('\n') : b.selector;
  const block = `${sel} {\n${body.join('\n').replace(/^\n/, '')}\n${b.media ? '  ' : ''}}`;
  css.push('', `/* ═══ ${b.title} ═══ */`, b.media ? `@media ${b.media} {\n${block}\n}` : block);
}
await writeFile(resolve(root, 'packages/css/src/tokens.css'), css.join('\n') + '\n');

/* ── tokens.json：给文档站 / 其它平台用——每个令牌带 CSS 写法与亮 / 暗两套解析值 ── */
const [L, D, C] = await Promise.all([
  load([...BASE, LIGHT, CHROME, CODEX]),
  load([...BASE, DARK, CHROME, CODEX]),
  load([CONTRAST], [...BASE, LIGHT]),
]);
const dark = new Map(D.allTokens.map(t => [t.name, t]));
const contrast = new Map(C.allTokens.filter(t => t.isSource).map(t => [t.name, t]));
const groups = Object.fromEntries(await groupDescriptions([...BASE, LIGHT, CHROME, CODEX]));
const json = {
  $name: 'AKDS · Arknights Web Design System tokens',
  $version: '0.1.0',
  $generated: '生成物：packages/tokens/build.ts ← packages/tokens/src/ 下的 *.json5',
  $sources: {
    site: 'https://ak.hypergryph.com/ (Next.js CSS: #18D1FF, greys, Bender/Novecento/Oswald/SourceHanSans)',
    'game-sprites': 'torappu unpacked UI sprites (ui/pages/home_page, ui/character/*, arts/*_hub)',
    gamedata: 'gamedata_const.richTextStyles, sandbox_table.charRarityColorList',
  },
  groups,
  tokens: L.allTokens.map(t => {
    const d = dark.get(t.name)!;
    const themed = t.path[0] === 'theme';
    return {
      name: `--${t.name}`,
      path: t.path,
      type: t.$type,
      description: t.$description,
      ...(d.$description !== t.$description ? { descriptionDark: d.$description } : {}),
      css: themed ? { light: cssValue(t.original.$value), dark: cssValue(d.original.$value) } : cssValue(t.original.$value),
      resolved: { light: t.$value, dark: d.$value, ...(contrast.has(t.name) ? { 'contrast-more': contrast.get(t.name)!.$value } : {}) },
    };
  }),
};
await writeFile(resolve(import.meta.dirname, 'tokens.json'), JSON.stringify(json, null, 2) + '\n');
console.log(`tokens: packages/css/src/tokens.css（${BLOCKS.length} 块）· packages/tokens/tokens.json（${json.tokens.length} 个令牌）`);
