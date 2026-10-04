/**
 * 整页样式回归：预览页每个元素（含 ::before / ::after）的计算样式 + <html> 上全部 --ak-* 令牌的计算值，和基准逐项比对。
 * 用来保证「令牌改由 JSON 生成」「CSS 按组件拆文件」这类重构视觉零变化：
 *
 *   pnpm e2e --project=snapshots -u     改之前：拍基准 → _verify/snapshots/preview/<页面>@<模式>.json（不入库）
 *   pnpm e2e --project=snapshots        改之后：逐项比对（没有基准就跳过）
 *
 * 模式 = 主题（?theme=）× 视口 × 配色偏好；一律 prefers-reduced-motion: reduce（动画直接落到终态、首页轮播不自动播）。
 * 页面里的时间冻结在 NOW；不出网（support/test.ts，快照不随现网抖动）；干员页的「干员信息」舞台整棵子树跳过（见 support/computed.ts 的 SKIP）。
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { normToken, props, settle, snapshot, styleAt, SLOTS, type Row, type Snap } from './support/computed.ts';
import { test, expect } from './support/test.ts';

const PAGES = ['home', 'operators', 'enemies', 'items', 'operator', 'recruit'];
const DIR = 'preview';
const NOW = Date.parse('2026-09-27T12:00:00+08:00');   // 首页时钟 / 倒计时 / 今日开放状态才可复现
const BASELINE = resolve(import.meta.dirname, '../_verify/snapshots', DIR);

type Mode = { name: string; query: string; width: number; height: number; scheme?: 'light' | 'dark'; mobile?: boolean };
const MODES: Mode[] = [
  { name: 'dark', query: 'theme=dark&demo=0', width: 1440, height: 900 },
  { name: 'light', query: 'theme=light&demo=0', width: 1440, height: 900 },
  { name: 'os-dark', query: 'theme=os&demo=0', width: 1440, height: 900, scheme: 'dark' },
  { name: 'os-light', query: 'theme=os&demo=0', width: 1440, height: 900, scheme: 'light' },
  { name: 'light-tablet', query: 'theme=light&demo=0', width: 1024, height: 800 },
  { name: 'dark-mobile', query: 'theme=dark&demo=0', width: 390, height: 844, mobile: true },
  { name: 'demo-dark', query: 'theme=dark&demo=1', width: 1440, height: 900 },
];

/** 基准 → 当前：令牌、元素增删、样式不同（前 limit 处列属性，其余只计数） */
function compare(A: Snap, B: Snap, limit = Infinity) {
  const out: string[] = [];
  for (const k of new Set([...Object.keys(A.tokens), ...Object.keys(B.tokens)])) {
    if (normToken(A.tokens[k]) !== normToken(B.tokens[k])) out.push(`  令牌 ${k}: ${A.tokens[k] ?? '∅'} → ${B.tokens[k] ?? '∅'}`);
  }
  const body = (r: Row) => !r[0].startsWith('head:');   // <head> 里的 link / style / meta 不渲染
  const ma = new Map(A.rows.filter(body).map(r => [r[0], r] as [string, Row]));
  const mb = new Map(B.rows.filter(body).map(r => [r[0], r] as [string, Row]));
  for (const p of ma.keys()) if (!mb.has(p)) out.push(`  元素只在基准：${p}`);
  for (const p of mb.keys()) if (!ma.has(p)) out.push(`  元素只在当前：${p}`);
  let count = 0;
  for (const [p, ra] of ma) {
    const rb = mb.get(p); if (!rb) continue;
    for (const [slot, tag] of SLOTS) {
      const sa = styleAt(A, ra, slot), sb = styleAt(B, rb, slot);
      if (sa === sb) continue;
      if (count++ >= limit) continue;
      const pa = props(sa), pb = props(sb);
      const d = [...new Set([...pa.keys(), ...pb.keys()])].filter(k => pa.get(k) !== pb.get(k)).map(k => `${k}: ${pa.get(k) ?? '∅'} → ${pb.get(k) ?? '∅'}`);
      out.push(`  ${p}${tag}\n      ${sa === undefined ? '（伪元素只在当前）' : sb === undefined ? '（伪元素只在基准）' : d.join('\n      ')}`);
    }
  }
  if (count > limit) out.push(`  …共 ${count} 处样式不同`);
  return out;
}

test.describe.configure({ mode: 'parallel' });

for (const name of PAGES) {
  for (const mode of MODES) {
    test.describe(() => {
      test.use({ viewport: { width: mode.width, height: mode.height }, isMobile: !!mode.mobile, hasTouch: !!mode.mobile, colorScheme: mode.scheme ?? 'light' });

      test(`${DIR}/${name}@${mode.name}`, async ({ page }, testInfo) => {
        const file = `${BASELINE}/${name}@${mode.name}.json`;
        const update = testInfo.config.updateSnapshots === 'all' || testInfo.config.updateSnapshots === 'changed';
        test.skip(!update && !existsSync(file), '没有基准：改之前先 pnpm e2e --project=snapshots -u');
        test.setTimeout(90_000);
        await page.clock.setFixedTime(NOW);
        await page.goto(`/${DIR}/${name}.html?${mode.query}`, { waitUntil: 'networkidle' });
        await settle(page);
        const actual = await snapshot(page);
        const summary = `${actual.rows.length} 元素 / ${actual.table.length} 种样式 / ${Object.keys(actual.tokens).length} 令牌`;
        if (update) {
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, JSON.stringify(actual));
          testInfo.annotations.push({ type: 'baseline', description: `已写入 ${file}（${summary}）` });
          return;
        }
        testInfo.annotations.push({ type: 'snapshot', description: summary });
        const expected: Snap = JSON.parse(await readFile(file, 'utf8'));
        const full = compare(expected, actual);
        if (full.length) await testInfo.attach(`${name}@${mode.name}-diff.txt`, { body: full.join('\n'), contentType: 'text/plain' });
        expect(full.length, `${DIR}/${name}@${mode.name} 与基准不同（完整列表见附件）\n${compare(expected, actual, 12).join('\n')}\n`).toBe(0);
      });
    });
  }
}
