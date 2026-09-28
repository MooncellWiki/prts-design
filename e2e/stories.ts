/**
 * 组件自检：无头 Chrome 打开 Storybook story / 文档站页面，报渲染是否成功 + 控制台错误 / Vue 警告，并截图。
 * 需要先开着 pnpm storybook（:6006）/ pnpm dev:docs（:5173）。
 *
 *   node e2e/stories.ts components-chip arknights-rarity     按 story id 前缀（= 注册表 storybook 字段）挑 story
 *   node e2e/stories.ts --docs /components/chip /arknights/rarity   文档站页面（示例在 iframe 里，逐个查）
 *   THEME=light node e2e/stories.ts …                          亮色（默认暗）
 *
 * 截图 → _verify/stories/<id>.png、_verify/docs/<路径>.png；有错误时退出码 1。
 */
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import puppeteer, { type Page } from "puppeteer-core";

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SB = process.env.SB ?? "http://localhost:6006";
const DOCS = process.env.DOCS ?? "http://localhost:5173";
const THEME = process.env.THEME ?? "dark";
const root = resolve(import.meta.dirname, "..");

const args = process.argv.slice(2);
const docsMode = args[0] === "--docs";
const targets = docsMode ? args.slice(1) : args;
if (!targets.length) {
  console.error("用法：node e2e/stories.ts <story id 前缀…> | --docs <路径…>");
  process.exit(2);
}

/** 收集控制台错误 / 警告与未捕获异常（favicon 404 之类的噪声除外） */
function collect(page: Page) {
  const problems: string[] = [];
  page.on("console", m => {
    if (m.type() !== "error" && m.type() !== "warn") return;
    const t = m.text();
    const url = m.location()?.url ?? "";
    if (/favicon|\[vite\]|Download the Vue Devtools|DevTools/i.test(t + url)) return;
    if (/^Failed to load resource/.test(t)) return; // 同一个请求 response 里已经报了带地址的 HTTP 4xx
    problems.push(`${m.type()}: ${t.slice(0, 300)}${url ? `  @ ${url}` : ""}`);
  });
  page.on("pageerror", e => problems.push(`pageerror: ${String(e).slice(0, 300)}`));
  page.on("requestfailed", r => {
    if (!/favicon/.test(r.url())) problems.push(`requestfailed: ${r.url()}`);
  });
  page.on("response", r => {
    if (r.status() >= 400 && !/favicon/.test(r.url())) problems.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  return problems;
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars"] });
let failed = 0;

try {
  if (!docsMode) {
    await mkdir(resolve(root, "_verify/stories"), { recursive: true });
    const index = (await (await fetch(`${SB}/index.json`)).json()) as { entries: Record<string, { id: string; type: string }> };
    const ids = Object.values(index.entries)
      .filter(e => e.type === "story" && targets.some(p => e.id.startsWith(p)))
      .map(e => e.id);
    if (!ids.length) {
      console.error(`Storybook 里没有以 ${targets.join(" / ")} 开头的 story（新文件要等 Storybook 重新索引，或检查 title）`);
      process.exit(1);
    }
    for (const id of ids) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });
      const problems = collect(page);
      await page.goto(`${SB}/iframe.html?id=${id}&viewMode=story&globals=theme:${THEME}`, { waitUntil: "networkidle0" });
      const state = await page
        .waitForFunction(
          () => {
            const err = document.querySelector<HTMLElement>(".sb-show-errordisplay .sb-errordisplay");
            if (err) return { ok: false, text: err.innerText.slice(0, 600) };
            const r = document.querySelector("#storybook-root");
            return r && r.children.length ? { ok: true, text: "" } : false;
          },
          { timeout: 15000 },
        )
        .then(h => h.jsonValue() as Promise<{ ok: boolean; text: string }>)
        .catch(() => ({ ok: false, text: "15 秒内没有渲染出内容" }));
      await new Promise(r => setTimeout(r, 300));
      await page.screenshot({ path: resolve(root, `_verify/stories/${id}.png`) });
      const bad = !state.ok || problems.length > 0;
      failed += bad ? 1 : 0;
      console.log(`${bad ? "✗" : "✓"} ${id}${state.text ? `\n    ${state.text.replace(/\s+/g, " ")}` : ""}`);
      for (const p of problems) console.log(`    ${p}`);
      await page.close();
    }
  } else {
    await mkdir(resolve(root, "_verify/docs"), { recursive: true });
    for (const path of targets) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 });
      const problems = collect(page);
      await page.evaluateOnNewDocument(t => localStorage.setItem("vitepress-theme-appearance", t), THEME);
      const res = await page.goto(`${DOCS}${path}`, { waitUntil: "networkidle0" });
      await new Promise(r => setTimeout(r, 1500)); // 示例 iframe 异步挂载
      const info = await page.evaluate(() => {
        const is404 = !!document.querySelector(".NotFound");
        const frames = [...document.querySelectorAll("iframe")].map(f => {
          const d = f.contentDocument;
          const body = d?.body;
          return { h: Math.round(f.getBoundingClientRect().height), empty: !body || body.innerText.trim() === "" && !body.querySelector("img,svg,[class^='ak-'],[class*=' ak-']") };
        });
        const header = document.querySelector(".akds-component-header, [class*='ComponentHeader'], h1")?.textContent?.trim().slice(0, 60) ?? "";
        const propsTables = document.querySelectorAll("table").length;
        return { is404, frames, header, propsTables };
      });
      const emptyFrames = info.frames.filter(f => f.empty || f.h < 20).length;
      const bad = (res?.status() ?? 200) >= 400 || info.is404 || emptyFrames > 0 || problems.length > 0;
      failed += bad ? 1 : 0;
      const file = path.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "index";
      await page.screenshot({ path: resolve(root, `_verify/docs/${file}.png`), fullPage: true });
      console.log(`${bad ? "✗" : "✓"} ${path}  页头「${info.header}」· 示例 ${info.frames.length} 个${emptyFrames ? `（${emptyFrames} 个空白）` : ""} · 表格 ${info.propsTables} 张${info.is404 ? " · 404" : ""}`);
      for (const p of problems) console.log(`    ${p}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
