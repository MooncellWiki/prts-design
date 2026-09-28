<script setup lang="ts">
/**
 * 皮肤骨架示例：拿预览骨架 preview/_src/skeleton.html（首页 / 干员页样例用的同一份）拼一整页，按「真实视口宽度」排版，再整体缩放进正文列。
 * 为什么不用 ```html demo bare：骨架的形态由视口断点决定（≥1400 目录导轨 · <1400 二级吸顶栏 · <1120 侧栏抽屉 · ≤639 手机），
 * 正文列里的示例 iframe 只有 ~700px 宽，永远落在 <1120 那一档；这里的 iframe 就是给定宽度的视口，里面照常滚动、点击。
 * 骨架里的脚本（sidebar-tree.js · search-palette.js · preview.js · search-mock.js）照常加载，交互与预览页一致。
 *
 *   <SkinFrame />                                        1440 × 900，默认正文
 *   <SkinFrame :width="1024" state="toc" />             打开目录浮层
 *   <SkinFrame highlight=".ak-header" />                 描出一块（CSS 选择器）
 *   <SkinFrame state="palette" query="yh" />             打开搜索面板并输入
 *   state（空格分隔）：nav ≡ 工具卡片 · toc 目录浮层 · sidebar 侧栏抽屉 · user 用户菜单 · more 「更多」菜单 · palette 搜索面板 ·
 *                      flyout 侧栏悬停飞出 · demo 示例活动主题 · condensed 向下滚过（页眉收起）· bottom 滚到页底
 */
import { useData, withBase } from "vitepress";
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";

import skeleton from "../../../../preview/_src/skeleton.html?raw";

const props = withDefaults(
  defineProps<{
    /** 视口宽度（px） */
    width?: number;
    /** 视口高度（px） */
    height?: number;
    /** 初始状态，空格分隔 */
    state?: string;
    /** 描边标出的区域（CSS 选择器） */
    highlight?: string;
    /** 初始滚动位置（px） */
    scroll?: number;
    /** state 含 palette 时预先输入的查询 */
    query?: string;
    /** 图注 */
    caption?: string;
  }>(),
  { width: 1440, height: 900, state: "", highlight: "", scroll: 0, query: "", caption: "" },
);

type FrameWin = Window & { akdsSetTheme?: (mode: string) => void; akdsSetDemoTheme?: (on: boolean) => void };

const PRESETS = [1440, 1280, 1024, 768, 390];
const states = computed(() => new Set(props.state.split(/\s+/).filter(Boolean)));

const { isDark } = useData();
const box = useTemplateRef<HTMLDivElement>("box");
const frame = useTemplateRef<HTMLIFrameElement>("frame");
const vw = ref(props.width);
const boxW = ref(0);
const html = ref("");
const key = ref(0);
const ready = ref(false);
const demo = ref(states.value.has("demo"));
let ro: ResizeObserver | undefined;

const scale = computed(() => (boxW.value ? Math.min(1, boxW.value / vw.value) : 0));
const offset = computed(() => Math.max(0, (boxW.value - vw.value * scale.value) / 2));

/** 示例正文：一段够长的条目，让目录 / 滚动 / 页眉收起都有东西可看 */
const h2 = (t: string) =>
  `<div class="mw-heading mw-heading2"><h2 id="${t}">${t}</h2><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="#">编辑</a><span class="mw-editsection-bracket">]</span></span></div>`;
const h3 = (t: string) => `<div class="mw-heading mw-heading3"><h3 id="${t}">${t}</h3></div>`;
const P = "<p>龙门近卫局特别督察组组长陈，正依合约前来协助罗德岛的任务。生气的时候很可怕，平常也最好别惹她。本段只是占位正文：页眉、侧栏、页面头、目录、页脚都是皮肤骨架，只有这一栏是 wikitext 的解析产物。</p>";
const ARTICLE = [
  `<p><b>陈</b>是游戏《明日方舟》中的六星近卫干员，龙门近卫局特别督察组组长。<a href="#">干员一览</a> · <a href="#" class="new">不存在的页面</a> · <a class="external" href="#">官方网站</a></p>`,
  h2("干员信息"),
  P,
  h3("属性"),
  `<table class="wikitable" style="width:100%"><tr><th></th><th>精英0 1级</th><th>精英0 满级</th><th>精英1 满级</th><th>精英2 满级</th></tr><tr><th>生命上限</th><td class="num">1001</td><td class="num">1431</td><td class="num">1884</td><td class="num">2385</td></tr><tr><th>攻击</th><td class="num">333</td><td class="num">477</td><td class="num">628</td><td class="num">796</td></tr><tr><th>防御</th><td class="num">217</td><td class="num">311</td><td class="num">410</td><td class="num">520</td></tr></table>`,
  h3("天赋"),
  P,
  h2("技能"),
  P,
  `<ul><li>鞘击</li><li>赤霄·拔刀</li><li>赤霄·绝影</li></ul>`,
  h2("后勤技能"),
  P,
  h2("模组"),
  P,
  P,
  h2("人员档案"),
  `<blockquote><p>「博士，现在起由我担任你的护卫。」</p></blockquote>`,
  P,
  h3("基础档案"),
  P,
  h3("综合体检测试"),
  P,
  h2("语音记录"),
  P,
  P,
].join("\n");

function build(dark: boolean) {
  const theme = dark ? "dark" : "light";
  const fill: Record<string, string> = {
    title: "陈 - PRTS",
    head: props.highlight ? `<style>${props.highlight}{outline:2px dashed #ff4d8d!important;outline-offset:-2px}</style>` : "",
    nav: '        <li class="is-active"><a href="#">皮肤骨架示例</a></li>',
    crumb: '<ul class="ak-breadcrumb ak-m-0"><li><a href="#">首页</a></li><li><a href="#">干员一览</a></li><li aria-current="page">陈</li></ul>',
    indicators: "",
    h1: "陈",
    h1en: "Ch'en · LM04",
    actions: '<li id="ca-watch"><a href="#" title="将本页面加入监视列表"><svg class="ak-icon"><use href="#i-star"/></svg><span>监视</span></a></li>',
    content: ARTICLE,
    lastmod: "2026年8月29日 (六) 17:40",
    cats: ["干员", "近卫干员", "近战位干员", "属于龙门近卫局的干员"].map(c => `<li><a href="#">${c}</a></li>`).join(""),
    hiddencats: '<div class="mw-hidden-catlinks mw-hidden-cats-hidden">隐藏分类：​<ul><li><a href="#">对原文有修正的页面</a></li></ul></div>',
  };
  return (
    skeleton
      .replace(/^\s*<!--[\s\S]*?-->\s*/, "") // 骨架文件头的「这是模板」注释
      // 骨架按 preview/ 目录写的相对地址（../src/…、assets/…、preview.js）：base 必须在任何带地址的元素之前
      .replace(/<html[^>]*>/, `<html lang="zh-CN" class="client-nojs skin-theme-clientpref-${dark ? "night" : "day"}" data-theme="${theme}" data-default-theme="${theme}">`)
      .replace("<head>", `<head><base href="${withBase("/preview/")}">`)
      .replace(/\{\{(\w+)\}\}/g, (_, k: string) => fill[k] ?? "")
      // <base> 管得住真正的加载，但 Chromium 的预加载扫描器在 srcdoc 里不认它：相对地址先按文档页的地址白发一轮（/chrome/assets/… 404）——直接写成绝对地址
      .replace(/(\s(?:src|href)=")(?![a-z][\w+.-]*:|\/|#)([^"]*)"/gi, (_, attr: string, rel: string) => `${attr}${new URL(rel, `http://x${withBase("/preview/")}`).pathname}"`)
  );
}

/** 预览脚本切主题 / 活动主题时会写 localStorage（预览站的记忆）：示例里切换不该改掉它 */
function keepStore(fn: () => void) {
  const saved = ["akds-theme", "akds-demo-theme"].map(k => [k, localStorage.getItem(k)] as const);
  try {
    fn();
  } finally {
    for (const [k, v] of saved) v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v);
  }
}

const win = () => (ready.value ? (frame.value?.contentWindow as FrameWin | null) : null);
function applyTheme() {
  const w = win();
  if (w?.akdsSetTheme) keepStore(() => w.akdsSetTheme!(isDark.value ? "dark" : "light"));
}
function applyDemo() {
  const w = win();
  if (w?.akdsSetDemoTheme) keepStore(() => w.akdsSetDemoTheme!(demo.value));
}

function onLoad() {
  const f = frame.value;
  if (!f || !html.value) return;
  let href = "";
  try {
    href = f.contentWindow?.location.href ?? "";
  } catch {
    /* 跨源：被带走了 */
  }
  if (href === "about:blank") return;
  if (href !== "about:srcdoc") {
    // 骨架里的脚本把示例带离了页面（如搜索面板无结果时回车 = MW 的 Go）：重新装回
    ready.value = false;
    key.value++;
    return;
  }
  const w = f.contentWindow as FrameWin;
  const doc = w.document;
  ready.value = true;
  applyTheme();
  applyDemo();
  // 示例里的焦点不带着文档页滚动（面板打开时会聚焦输入框）
  const proto = (w as unknown as typeof globalThis).HTMLElement.prototype;
  const focus = proto.focus;
  proto.focus = function (this: HTMLElement, o?: FocusOptions) {
    focus.call(this, { ...o, preventScroll: true });
  };
  // 链接只是样子：页内锚点自己滚（scrollIntoView 会连文档页一起滚），其余不跳
  doc.addEventListener("click", e => {
    demo.value = doc.documentElement.classList.contains("ak-theme-demo"); // 侧栏里的「示例活动主题」也能切
    const a = (e.target as Element).closest?.("a[href]");
    if (!a) return;
    e.preventDefault();
    const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
    const t = a.getAttribute("href")!.startsWith("#") && id ? doc.getElementById(id) : null;
    if (t) w.scrollTo({ top: t.getBoundingClientRect().top + w.scrollY - (parseFloat(w.getComputedStyle(t).scrollMarginTop) || 0), behavior: "smooth" });
  });

  const s = states.value;
  if (props.scroll) w.scrollTo(0, props.scroll);
  if (s.has("bottom")) w.scrollTo(0, doc.documentElement.scrollHeight);
  if (s.has("condensed")) {
    w.scrollTo(0, Math.max(props.scroll, 480));
    doc.documentElement.classList.add("ak-condensed");
  }
  if (s.has("nav")) (doc.getElementById("ak-nav-toggle") as HTMLInputElement | null)?.click();
  if (s.has("toc")) {
    // 不点 label：那样焦点会落到 checkbox 上、按钮出一圈焦点框
    const cb = doc.getElementById("ak-toc-toggle") as HTMLInputElement | null;
    if (cb) {
      cb.checked = true;
      cb.dispatchEvent(new Event("change"));
    }
  }
  if (s.has("sidebar")) (doc.querySelector(".ak-local-nav__menu") as HTMLElement | null)?.click();
  if (s.has("user")) doc.querySelector("#ak-user-menu details")?.setAttribute("open", "");
  if (s.has("more")) doc.querySelector(".ak-page-tools__more details")?.setAttribute("open", "");
  if (s.has("flyout")) {
    const label = [...doc.querySelectorAll(".ak-sidebar .ak-tree__branch:not(.is-open) > .ak-tree__label")].find(l => l.textContent?.trim() === "档案");
    label?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
  }
  if (s.has("palette")) {
    const trigger = doc.querySelector<HTMLElement>(vw.value < 640 ? ".ak-header__search-toggle" : ".ak-search-trigger");
    trigger?.click();
    if (props.query) {
      const input = doc.querySelector<HTMLInputElement>(".ak-palette__form input");
      if (input) {
        input.value = props.query;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }
}

function reset() {
  ready.value = false;
  vw.value = props.width;
  demo.value = states.value.has("demo");
  key.value++;
}

onMounted(() => {
  html.value = build(isDark.value);
  ro = new ResizeObserver(([e]) => (boxW.value = e.contentRect.width));
  ro.observe(box.value!);
});
onBeforeUnmount(() => ro?.disconnect());
watch(isDark, applyTheme);
watch(demo, applyDemo);
</script>

<template>
  <figure class="akd-skin vp-raw">
    <div class="akd-skin__bar">
      <span class="akd-skin__label">视口</span>
      <button v-for="w in PRESETS" :key="w" type="button" :class="{ 'is-on': vw === w }" @click="vw = w">{{ w }}</button>
      <label class="akd-skin__demo"><input v-model="demo" type="checkbox" />示例活动主题</label>
      <span class="akd-skin__spacer" />
      <button type="button" title="回到初始状态" @click="reset">重置</button>
    </div>
    <div ref="box" class="akd-skin__box" :style="{ height: `${Math.round(height * scale)}px` }">
      <iframe
        :key="key"
        ref="frame"
        title="皮肤骨架示例"
        :srcdoc="html || undefined"
        :style="{ width: `${vw}px`, height: `${height}px`, transform: `translateX(${offset}px) scale(${scale})`, visibility: ready ? 'visible' : 'hidden' }"
        @load="onLoad"
      />
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.akd-skin { margin: 16px 0 28px; border: 1px solid var(--ak-border); }
.akd-skin__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 2px; padding: 0 8px; border-bottom: 1px solid var(--ak-border); background: var(--ak-bg-surface); font: 700 12px/1 var(--ak-font-label); letter-spacing: .04em; color: var(--ak-fg-muted); }
.akd-skin__label { margin-right: 6px; }
.akd-skin__bar button { padding: 7px 8px; border-bottom: 2px solid transparent; color: var(--ak-fg-muted); font: inherit; }
.akd-skin__bar button:hover { color: var(--ak-fg); }
.akd-skin__bar button.is-on { color: var(--ak-accent); border-bottom-color: var(--ak-accent); }
.akd-skin__demo { display: inline-flex; align-items: center; gap: 6px; margin-left: 12px; cursor: pointer; }
.akd-skin__spacer { flex: 1; }
.akd-skin__box { position: relative; overflow: hidden; background: var(--ak-bg-canvas); }
.akd-skin__box iframe { position: absolute; top: 0; left: 0; display: block; border: 0; transform-origin: 0 0; background: var(--ak-bg-canvas); }
.akd-skin figcaption { padding: 8px 12px; border-top: 1px solid var(--ak-border); font-size: 12px; color: var(--ak-fg-muted); }
</style>
