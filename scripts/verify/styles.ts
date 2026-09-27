/**
 * 样式回归：把预览页每个元素（含 ::before / ::after）的计算样式 + <html> 上全部 --ak-* 令牌的计算值拍成快照，前后两份逐项比对。
 * 用来保证「令牌改由 JSON 生成」「CSS 按组件拆文件」这类重构视觉零变化。
 *
 *   node scripts/verify/styles.ts snap <标签> [页面…]      → _verify/<标签>/<页面>@<模式>.json
 *   node scripts/verify/styles.ts diff <标签A> <标签B>      → 逐页逐模式列出不同的元素 / 属性
 *   PAGES_DIR=dist node scripts/verify/styles.ts snap …     → 拍 dist/ 单文件版（默认 preview/）
 *
 * 模式 = 主题（?theme=）× 视口 × 配色偏好；一律 prefers-reduced-motion: reduce（动画直接落到终态、首页轮播不自动播，快照才稳定）。
 * 干员页的「干员信息」舞台是现网 Widget 原样（不归本仓库管，图片从现网拉、时序不定），整棵子树跳过；页面里的 Date 冻结在 NOW。
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

const root = resolve(import.meta.dirname, '../..');
const outDir = join(root, '_verify');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES = ['home', 'operator'];   // 5 张展示页（index / chrome / mediawiki / components / arknights）已退役；_verify/base 里还有它们的旧快照
const DIR = process.env.PAGES_DIR ?? 'preview';   // PAGES_DIR=dist 拍单文件版（须是仓库顶层目录：单文件版里的思源黑体按 ../src/fonts/ 引，本服务器把 /src/ 映射到 packages/css/src/）
const SKIP = '.charinfo-container, .charimg-m';
const NOW = Date.parse('2026-09-27T12:00:00+08:00');   // 页面里的时间冻结在这一刻：首页时钟 / 倒计时 / 今日开放状态才可复现

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

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.TTF': 'font/ttf', '.gif': 'image/gif', '.webp': 'image/webp',
};

function serve(): Promise<{ url: string; close: () => void }> {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    try {
      // 预览页按站点布局引 ../src/…（Pages 上 /src/ = CSS 包），仓库里对应 packages/css/src/
      const body = await readFile(join(root, path.startsWith('/src/') ? `packages/css${path}` : path));
      res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end();
    }
  });
  return new Promise(ok => server.listen(0, '127.0.0.1', () => {
    const { port } = server.address() as { port: number };
    ok({ url: `http://127.0.0.1:${port}`, close: () => server.close() });
  }));
}

/* 在页面里跑：返回 { rows: [路径, 本体样式 id, ::before id, ::after id][], table: 样式串[], tokens: {--ak-*: 值} } */
function dump(skip: string) {
  const table = new Map<string, number>();
  const intern = (s: string) => { let id = table.get(s); if (id === undefined) { id = table.size; table.set(s, id); } return id; };
  const ser = (cs: CSSStyleDeclaration) => {
    const out: string[] = [];
    for (let i = 0; i < cs.length; i++) { const p = cs[i]; if (!p.startsWith('--')) out.push(p + ':' + cs.getPropertyValue(p)); }
    return out.join('\n').replaceAll(location.origin, '');   // 端口每次不同
  };
  const path = (el: Element) => {
    const seg: string[] = [];
    for (let e: Element | null = el; e && e !== document.documentElement; e = e.parentElement) {
      let i = 1; for (let s = e.previousElementSibling; s; s = s.previousElementSibling) if (s.tagName === e.tagName) i++;
      seg.push(e.tagName.toLowerCase() + (e.id ? '#' + e.id.replace(/^swiper-wrapper-\w+$/, 'swiper-wrapper') : '') + ':' + i);   // Swiper 的随机 id
    }
    return seg.reverse().join('>');
  };
  const pseudo = (el: Element, p: string) => {
    const cs = getComputedStyle(el, p);
    return cs.content === 'none' || cs.content === 'normal' ? -1 : intern(ser(cs));
  };
  const rows: [string, number, number, number][] = [];
  for (const el of document.querySelectorAll('html, html *')) {
    if (el.closest(skip) || el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    rows.push([path(el), intern(ser(getComputedStyle(el))), pseudo(el, '::before'), pseudo(el, '::after')]);
  }
  const tokens: Record<string, string> = {};
  const rcs = getComputedStyle(document.documentElement);
  for (let i = 0; i < rcs.length; i++) { const p = rcs[i]; if (p.startsWith('--')) tokens[p] = rcs.getPropertyValue(p).trim(); }
  return { rows, table: [...table.keys()], tokens };
}

async function snap(label: string, pages: string[]) {
  const srv = await serve();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
  const dir = join(outDir, label);
  await mkdir(dir, { recursive: true });
  try {
    for (const name of pages) {
      for (const mode of MODES) {
        const page = await browser.newPage();
        await page.setViewport({ width: mode.width, height: mode.height, isMobile: !!mode.mobile, hasTouch: !!mode.mobile, deviceScaleFactor: 1 });
        await page.emulateMediaFeatures([
          { name: 'prefers-reduced-motion', value: 'reduce' },
          { name: 'prefers-color-scheme', value: mode.scheme ?? 'light' },
        ]);
        await page.evaluateOnNewDocument((now: number) => {
          try { localStorage.clear(); } catch { /* 无痕 */ }
          const Real = Date;
          globalThis.Date = class extends Real {
            constructor(...a: []) { if (a.length) super(...a); else super(now); }
            static now() { return now; }
          } as DateConstructor;
        }, NOW);
        await page.goto(`${srv.url}/${DIR}/${name}.html?${mode.query}`, { waitUntil: 'networkidle2', timeout: 60_000 }).catch(e => console.warn(`  ${name}@${mode.name}: ${e.message}`));
        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 300));
        const data = await page.evaluate(dump, SKIP);
        await writeFile(join(dir, `${name}@${mode.name}.json`), JSON.stringify(data));
        console.log(`${label}  ${name}@${mode.name}  ${data.rows.length} 元素 / ${data.table.length} 种样式 / ${Object.keys(data.tokens).length} 令牌`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
    srv.close();
  }
}

type Snap = { rows: [string, number, number, number][]; table: string[]; tokens: Record<string, string> };
/** 自定义属性的计算值是原文（不解析），比较前把写法归一：空白、#abc → #aabbcc、.10 → 0.1 */
const normToken = (v: string | undefined) => v === undefined ? v : v.replace(/\s+/g, '')
  .replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
  .replace(/(?<![\d.])\.(\d)/g, '0.$1').replace(/(\.\d*?)0+\b/g, '$1').replace(/\.(?!\d)/g, '').toLowerCase();
const props = (s: string | undefined) => new Map((s ?? '').split('\n').filter(Boolean).map(l => { const i = l.indexOf(':'); return [l.slice(0, i), l.slice(i + 1)] as [string, string]; }));

async function diff(a: string, b: string) {
  const files = (await readdir(join(outDir, a))).filter(f => f.endsWith('.json')).sort();
  let bad = 0;
  for (const f of files) {
    const A: Snap = JSON.parse(await readFile(join(outDir, a, f), 'utf8'));
    let B: Snap;
    try { B = JSON.parse(await readFile(join(outDir, b, f), 'utf8')); } catch { console.log(`✗ ${f}: ${b} 里没有`); bad++; continue; }
    const out: string[] = [];
    for (const k of new Set([...Object.keys(A.tokens), ...Object.keys(B.tokens)])) {
      if (normToken(A.tokens[k]) !== normToken(B.tokens[k])) out.push(`  令牌 ${k}: ${A.tokens[k] ?? '∅'} → ${B.tokens[k] ?? '∅'}`);
    }
    const body = (r: [string, number, number, number]) => !r[0].startsWith('head:');   // <head> 里的 link / style / meta 不渲染
    const mb = new Map(B.rows.filter(body).map(r => [r[0], r]));
    const ma = new Map(A.rows.filter(body).map(r => [r[0], r]));
    for (const p of ma.keys()) if (!mb.has(p)) out.push(`  元素只在 ${a}: ${p}`);
    for (const p of mb.keys()) if (!ma.has(p)) out.push(`  元素只在 ${b}: ${p}`);
    let shown = 0, count = 0;
    for (const [p, ra] of ma) {
      const rb = mb.get(p); if (!rb) continue;
      for (const [slot, tag] of [[1, ''], [2, '::before'], [3, '::after']] as const) {
        const sa = ra[slot] < 0 ? undefined : A.table[ra[slot]], sb = rb[slot] < 0 ? undefined : B.table[rb[slot]];
        if (sa === sb) continue;
        count++;
        if (shown++ >= 12) continue;
        const pa = props(sa), pb = props(sb);
        const d = [...new Set([...pa.keys(), ...pb.keys()])].filter(k => pa.get(k) !== pb.get(k)).slice(0, 6).map(k => `${k}: ${pa.get(k) ?? '∅'} → ${pb.get(k) ?? '∅'}`);
        out.push(`  ${p}${tag}\n      ${sa === undefined ? '（伪元素只在 ' + b + '）' : sb === undefined ? '（伪元素只在 ' + a + '）' : d.join('\n      ')}`);
      }
    }
    if (count > 12) out.push(`  …共 ${count} 处样式不同`);
    if (out.length) { bad++; console.log(`✗ ${f}\n${out.join('\n')}`); } else console.log(`✓ ${f}`);
  }
  console.log(bad ? `\n${bad} 份快照有差异` : '\n全部一致');
  process.exitCode = bad ? 1 : 0;
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'snap' && args[0]) await snap(args[0], args.length > 1 ? args.slice(1) : PAGES);
else if (cmd === 'diff' && args.length === 2) await diff(args[0], args[1]);
else { console.error('用法：node scripts/verify/styles.ts snap <标签> [页面…] | diff <标签A> <标签B>'); process.exitCode = 2; }
