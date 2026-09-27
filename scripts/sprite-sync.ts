/**
 * 界面线稿图标的三份副本保持一致：
 *   preview/_src/skeleton.html 的 SVG sprite（源头，改图标改这里）
 *   skin/templates/skin.mustache 的 SVG sprite（皮肤页面里 <use href="#i-…"> 用它；以前漏了，菜单 / 回到顶部图标画不出来）
 *   packages/vue/src/icons.ts（AkIcon 内联渲染用）
 *
 *   node scripts/sprite-sync.ts          检查三处同名同图（CI 用，不一致退出码 1）
 *   node scripts/sprite-sync.ts --write  把骨架里的 sprite 写进 skin.mustache（icons.ts 仍需手改，检查会指出差异）
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const SKELETON = resolve(root, 'preview/_src/skeleton.html');
const TEMPLATE = resolve(root, 'skin/templates/skin.mustache');
const ICONS = resolve(root, 'packages/vue/src/icons.ts');
const START = '<!-- ═══ SVG sprite ═══ -->';
const SPRITE = /<!-- ═══ SVG sprite[^\n]*-->\n<svg [^>]*>[\s\S]*?<\/svg>/;

/** sprite 里的 <symbol id="i-x" viewBox="0 0 24 24">内容</symbol> → { x: 内容 } */
const symbols = (sprite: string) =>
  Object.fromEntries([...sprite.matchAll(/<symbol id="i-([\w-]+)" viewBox="0 0 24 24">([\s\S]*?)<\/symbol>/g)].map(m => [m[1], m[2]]));

const skeleton = await readFile(SKELETON, 'utf8');
const sprite = SPRITE.exec(skeleton)?.[0];
if (!sprite) throw new Error(`${SKELETON} 里找不到 ${START} 开头的 sprite`);
const want = symbols(sprite);

let template = await readFile(TEMPLATE, 'utf8');
const inTemplate = SPRITE.exec(template)?.[0];
const block = sprite.replace(START, '<!-- ═══ SVG sprite（scripts/sprite-sync.ts 从 preview/_src/skeleton.html 同步，勿手改）═══ -->');
if (process.argv.includes('--write')) {
  template = inTemplate ? template.replace(SPRITE, block) : template.replace(/(\{\{![^}]*\}\}\n)/, `$1${block}\n`);
  await writeFile(TEMPLATE, template);
  console.log(`skin.mustache：sprite 已同步（${Object.keys(want).length} 枚）`);
}

const { icons } = (await import(ICONS)) as { icons: Record<string, string> };
const problems: string[] = [];
const compare = (label: string, got: Record<string, string>) => {
  for (const [k, v] of Object.entries(want)) if (got[k] !== v) problems.push(`${label}：${k} ${got[k] === undefined ? '缺失' : '路径不同'}`);
  for (const k of Object.keys(got)) if (!(k in want)) problems.push(`${label}：多了 ${k}`);
};
compare('skin.mustache', symbols(SPRITE.exec(await readFile(TEMPLATE, 'utf8'))?.[0] ?? ''));
compare('icons.ts', icons);
if (problems.length) {
  console.error(problems.join('\n') + '\n（改图标改 preview/_src/skeleton.html，再 node scripts/sprite-sync.ts --write，并同步 icons.ts）');
  process.exit(1);
}
console.log(`图标三处一致（${Object.keys(want).length} 枚）`);
