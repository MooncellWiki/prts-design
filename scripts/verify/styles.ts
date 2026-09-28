/**
 * 样式回归：把预览页每个元素（含 ::before / ::after）的计算样式 + <html> 上全部 --ak-* 令牌的计算值拍成快照，前后两份逐项比对。
 * 用来保证「令牌改由 JSON 生成」「CSS 按组件拆文件」这类重构视觉零变化。
 *
 *   node scripts/verify/styles.ts snap <标签> [页面…]      → _verify/<标签>/<页面>@<模式>.json
 *   node scripts/verify/styles.ts diff <标签A> <标签B>      → 逐页逐模式列出不同的元素 / 属性
 *   PAGES_DIR=dist node scripts/verify/styles.ts snap …     → 拍 dist/ 单文件版（默认 preview/）
 *   node scripts/verify/styles.ts hosts [标签]              → 跨宿主比对：对照页 preview/gallery.html 在 akds / vector / bare 三个宿主 × 暗 / 亮下拍快照
 *                                                              （_verify/<标签，默认 hosts>/gallery@<宿主>-<主题>.json），以 akds 为基准，
 *                                                              每个 [data-gallery] 里的元素（含伪元素）在另两个宿主上必须逐属性相同，否则退出码 1。
 *                                                              vector 宿主要先 node scripts/fetch-vector-css.ts（夹具不入库；没有就只比 bare 并警告）
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
const CHROME_ARGS = ['--hide-scrollbars', '--font-render-hinting=none', ...(process.env.CI ? ['--no-sandbox'] : [])];   // CI（GitHub Actions 的 Ubuntu 24.04）不给 Chrome 用户命名空间沙箱
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

/* 在页面里跑：返回 { rows: [路径, 本体样式 id, ::before id, ::after id, (withClass 时) 类名][], table: 样式串[], tokens: {--ak-*: 值} } */
function dump(skip: string, withClass = false) {
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
  const rows: ([string, number, number, number] | [string, number, number, number, string])[] = [];
  for (const el of document.querySelectorAll('html, html *')) {
    if (el.closest(skip) || el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
    const row: [string, number, number, number] = [path(el), intern(ser(getComputedStyle(el))), pseudo(el, '::before'), pseudo(el, '::after')];
    rows.push(withClass ? [...row, el.getAttribute('class') ?? ''] : row);
  }
  const tokens: Record<string, string> = {};
  const rcs = getComputedStyle(document.documentElement);
  for (let i = 0; i < rcs.length; i++) { const p = rcs[i]; if (p.startsWith('--')) tokens[p] = rcs.getPropertyValue(p).trim(); }
  return { rows, table: [...table.keys()], tokens };
}

async function snap(label: string, pages: string[]) {
  const srv = await serve();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: CHROME_ARGS });
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

/* ── 跨宿主：同一份组件 HTML（preview/gallery.html）在 AKDS 皮肤 / Vector 2022 / 站外三种页面上的计算样式必须一样 ── */
const HOSTS = ['akds', 'vector', 'bare'] as const;
type HostName = (typeof HOSTS)[number];
const HOST_THEMES = ['dark', 'light'];
/**
 * 允许的差异（逐条注明原因）。只有这些——字体不在白名单里：font-family 的计算值是声明的字体列表，三个宿主应当完全一样，不一样就是真泄漏。
 *   hosts：哪些宿主上允许；el：元素条件（标签 / 类名，不写 = 任何元素）；props：属性
 */
const ALLOW: { hosts: HostName[]; el?: (tag: string, cls: string[]) => boolean; props: string[]; why: string }[] = [
  {
    hosts: ['vector', 'bare'], el: (_, c) => c.includes('ak-item--bare'), props: ['background-image'],
    why: '游戏素材（道具稀有度底框）只随皮肤走（base/skin-assets.css）：别的皮肤只加载 skins.akds.components、站外只有 standalone.css，没有底框（var() 回退 none）',
  },
  {
    hosts: ['vector', 'bare'], el: t => /^h[1-6]$/.test(t), props: ['scroll-margin-top', 'scroll-margin-block-start'],
    why: 'AKDS 正文标题给固定页眉让出的锚点偏移（base/typography.css），只在皮肤页面上有意义，不影响渲染',
  },
  {
    hosts: ['vector'], props: ['animation-delay'],
    why: 'Vector 自己的减弱动效规则（* { animation-delay: -0.01ms !important }）：快照一律模拟 prefers-reduced-motion，平时不生效；动画时长仍由作用域的 .01ms 规则统一',
  },
];

type Row = [string, number, number, number, string?];
type HostSnap = { rows: Row[]; table: string[]; sections: string[] };

async function hostSnap(label: string): Promise<HostName[]> {
  const vectorOk = await readFile(join(root, 'preview/vendor/vector/vector.css')).then(() => true, () => false);
  const hosts = HOSTS.filter(h => h !== 'vector' || vectorOk);
  if (!vectorOk) console.warn('⚠ 没有 Vector 样式夹具（preview/vendor/vector/vector.css），这次只比 akds ↔ bare；先跑 node scripts/fetch-vector-css.ts');
  const srv = await serve();
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: CHROME_ARGS });
  const dir = join(outDir, label);
  await mkdir(dir, { recursive: true });
  try {
    for (const theme of HOST_THEMES) {
      for (const host of hosts) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: 'light' }]);
        await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch { /* 无痕 */ } });
        // 夹具里的图标是 https://prts.wiki/… 的绝对地址：只比计算值，不出网
        await page.setRequestInterception(true);
        page.on('request', r => (r.url().startsWith(srv.url) || r.url().startsWith('data:') ? r.continue() : r.abort()));
        await page.goto(`${srv.url}/preview/gallery.html?host=${host}&theme=${theme}&demo=0`, { waitUntil: 'networkidle0', timeout: 60_000 });
        await page.evaluate(() => document.fonts.ready);
        await new Promise(r => setTimeout(r, 300));
        const data = await page.evaluate(dump, SKIP, true);
        const sections = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('[data-gallery]')].map(s => s.dataset.gallery!));
        await writeFile(join(dir, `gallery@${host}-${theme}.json`), JSON.stringify({ rows: data.rows, table: data.table, sections }));
        console.log(`${label}  gallery@${host}-${theme}  ${data.rows.length} 元素 / ${data.table.length} 种样式 / ${sections.length} 块`);
        await page.close();
      }
    }
  } finally {
    await browser.close();
    srv.close();
  }
  return hosts;
}

async function hostDiff(label: string, hosts: HostName[]) {
  let bad = 0;
  const allowed = ALLOW.map(() => 0);
  for (const theme of HOST_THEMES) {
    const load = async (h: HostName): Promise<HostSnap> => JSON.parse(await readFile(join(outDir, label, `gallery@${h}-${theme}.json`), 'utf8'));
    const base = await load('akds');
    // 只看 [data-gallery] 块里的元素：路径里第一个 section:k 就是第 k 块（块都是 #gallery-root 下的兄弟）
    const inGallery = (s: HostSnap) => new Map(s.rows.filter(r => /(^|>)section:\d+/.test(r[0])).map(r => [r[0], r]));
    const sectionOf = (s: HostSnap, p: string) => s.sections[Number(p.match(/(?:^|>)section:(\d+)/)![1]) - 1];
    const A = inGallery(base);
    for (const host of hosts.filter(h => h !== 'akds')) {
      const other = await load(host);
      const B = inGallery(other);
      const out = new Map<string, string[]>();   // 块 → 问题
      const add = (sec: string, line: string) => (out.get(sec) ?? out.set(sec, []).get(sec)!).push(line);
      for (const p of A.keys()) if (!B.has(p)) add(sectionOf(base, p), `  元素只在 akds：${p}`);
      for (const [p, ra] of A) {
        const rb = B.get(p);
        if (!rb) continue;
        const cls = (ra[4] ?? '').trim().split(/\s+/).filter(Boolean);
        const tagName = p.split('>').pop()!.replace(/[#:].*$/, '');
        for (const [slot, tag] of [[1, ''], [2, '::before'], [3, '::after']] as const) {
          const sa = ra[slot] < 0 ? undefined : base.table[ra[slot]], sb = rb[slot] < 0 ? undefined : other.table[rb[slot]];
          if (sa === sb) continue;
          const short = `${p.replace(/^.*?(section:\d+)/, '$1')}${tag}${cls.length ? `  .${cls.join('.')}` : ''}`;
          if (sa === undefined || sb === undefined) { add(sectionOf(base, p), `  ${short}\n      （伪元素只在 ${sa === undefined ? host : 'akds'}）`); continue; }
          const pa = props(sa), pb = props(sb);
          const d = [...new Set([...pa.keys(), ...pb.keys()])].filter(k => pa.get(k) !== pb.get(k)).filter(k => {
            const i = ALLOW.findIndex(w => w.hosts.includes(host) && w.props.includes(k) && (!w.el || (!tag && w.el(tagName, cls))));
            if (i >= 0) allowed[i]++;
            return i < 0;
          });
          if (d.length) add(sectionOf(base, p), `  ${short}\n      ${d.map(k => `${k}: ${pa.get(k) ?? '∅'} → ${pb.get(k) ?? '∅'}`).join('\n      ')}`);
        }
      }
      if (!out.size) { console.log(`✓ ${host}@${theme}：与 akds 一致`); continue; }
      bad++;
      console.log(`✗ ${host}@${theme}：${[...out.values()].reduce((n, l) => n + l.length, 0)} 处与 akds 不同`);
      for (const [sec, lines] of out) {
        console.log(` [${sec}]`);
        for (const l of lines.slice(0, 15)) console.log(l);
        if (lines.length > 15) console.log(`  …共 ${lines.length} 处`);
      }
    }
  }
  ALLOW.forEach((w, i) => allowed[i] && console.log(`  白名单放过 ${allowed[i]} 处 ${w.props.join(' / ')}：${w.why}`));
  console.log(bad ? `\n${bad} 组宿主 × 主题有泄漏` : '\n各宿主一致');
  process.exitCode = bad ? 1 : 0;
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'snap' && args[0]) await snap(args[0], args.length > 1 ? args.slice(1) : PAGES);
else if (cmd === 'diff' && args.length === 2) await diff(args[0], args[1]);
else if (cmd === 'hosts' && args.length <= 1) { const label = args[0] ?? 'hosts'; await hostDiff(label, await hostSnap(label)); }
else { console.error('用法：node scripts/verify/styles.ts snap <标签> [页面…] | diff <标签A> <标签B> | hosts [标签]'); process.exitCode = 2; }
