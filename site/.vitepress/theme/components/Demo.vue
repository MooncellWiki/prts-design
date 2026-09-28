<script setup lang="ts">
/**
 * 示例块：上面是实时渲染（iframe 里挂 AKDS 全套样式 + 作用域根 .ak-scope + wiki 正文容器，与文档站的样式互不干扰，也和 MW 页面上的环境一致），
 * 下面是代码页签——Vue（demo SFC 源码，构建期高亮，由 markdown 插件塞进 #vue 插槽）/ HTML（渲染出的结构，或 html demo 的源码 #html 插槽）。
 * 用法见 site/.vitepress/plugins/demo.ts。
 */
import { useData } from "vitepress";
import { type App, type Component, createApp, onBeforeUnmount, onMounted, ref, useSlots, useTemplateRef, watch } from "vue";

import previewJs from "../../../../preview/preview.js?raw";
import demoThemeRaw from "../../../../packages/css/src/chrome/demo-theme.css?raw";
import akdsCss from "../../../../packages/css/src/index.css?inline";
import { icons } from "../../../../packages/vue/src/icons";

/** 活动主题示例的素材 url 按站点布局写（/src/chrome/ → ../../preview/assets/），从包目录导入解析不到：按原文取，换成站点里的地址 */
const demoThemeCss = demoThemeRaw.replaceAll("../../preview/assets/", `${import.meta.env.BASE_URL}preview/assets/`);
import { serialize } from "../html";

const props = defineProps<{
  /** Vue 示例：Button/Variants → packages/vue/src/components/Button/demos/Variants.vue */
  src?: string;
  /** 纯 HTML 示例（encodeURIComponent 过） */
  html?: string;
  /** Storybook story id */
  story?: string;
  /** 不包 .mw-body-content.mw-parser-output */
  bare?: boolean;
}>();

const demos = import.meta.glob<{ default: Component }>("../../../../packages/vue/src/components/*/demos/*.vue");
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${Object.entries(icons)
  .map(([n, m]) => `<symbol id="i-${n}" viewBox="0 0 24 24">${m}</symbol>`)
  .join("")}</svg>`;
const FRAME_CSS = "html,body{margin:0}body{padding:20px 24px;background:var(--ak-bg-canvas)}#root>:last-child{margin-bottom:0}";

const { isDark } = useData();
const slots = useSlots();
const frame = useTemplateRef<HTMLIFrameElement>("frame");
const tab = ref<"" | "vue" | "html">("");
const markup = ref({ text: "", html: "" });
const copied = ref(false);
let app: App | undefined;
let ro: ResizeObserver | undefined;
let mo: MutationObserver | undefined;
let disposed = false; // 示例 SFC 是异步加载的：加载完之前组件可能已经卸载（快速翻页）

const storybookBase = import.meta.env.DEV ? "http://localhost:6006/" : `${import.meta.env.BASE_URL}storybook/`;

/** 同 preview.js 的 applyTheme：MW clientpref 类 + data-theme */
function applyTheme(doc: Document) {
  const dark = isDark.value;
  const h = doc.documentElement;
  h.setAttribute("data-theme", dark ? "dark" : "light");
  h.setAttribute("data-default-theme", dark ? "dark" : "light");
  h.classList.remove("skin-theme-clientpref-os", "skin-theme-clientpref-day", "skin-theme-clientpref-night", "ak-theme-demo");
  h.classList.add(dark ? "skin-theme-clientpref-night" : "skin-theme-clientpref-day");
}

onMounted(async () => {
  const f = frame.value!;
  const doc = f.contentDocument!;
  doc.open();
  doc.write(
    `<!DOCTYPE html><html lang="zh-CN" class="client-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
      `<style>${akdsCss}</style><style>${demoThemeCss}</style><style>${FRAME_CSS}</style></head>` +
      `<body>${SPRITE}<div id="root" class="ak-scope${props.bare ? "" : " mw-body-content mw-parser-output"}"></div></body></html>`,
  );
  doc.close();
  applyTheme(doc);
  const root = doc.getElementById("root")!;
  // 示例里的链接只是样子：点了别让 iframe 跳走（about:blank 的相对地址会解析到文档页本身）
  doc.addEventListener("click", e => {
    if ((e.target as Element).closest?.("a[href]")) e.preventDefault();
  });

  if (props.src) {
    const [dir, name] = props.src.split("/");
    const load = demos[`../../../../packages/vue/src/components/${dir}/demos/${name}.vue`];
    if (!load) root.textContent = `找不到示例 ${props.src}`;
    else {
      const mod = await load();
      if (disposed) return;
      app = createApp(mod.default);
      app.mount(root);
    }
  } else if (props.html) {
    // 示例沿用预览页的相对素材路径 assets/…，站点里在 preview/assets/ 下
    root.innerHTML = decodeURIComponent(props.html).replace(/(["'(])assets\//g, `$1${import.meta.env.BASE_URL}preview/assets/`);
    // 预览站的交互脚本（页签 / 芯片 / 对话框 / Toast / 折叠面板 …都是 document 级事件委托），行为与预览页一致
    const s = doc.createElement("script");
    s.textContent = previewJs;
    doc.body.appendChild(s);
    applyTheme(doc); // preview.js 初始化时会按自己的记忆打主题，压回文档站当前的
  }

  /**
   * iframe 高度 = 内容高度；打开着的浮层也算进去：下拉 / 气泡是 absolute、对话框在 top layer、Toast 是 fixed，都不撑高 body，
   * 不量的话会被 iframe 裁掉（以前靠示例里写死 min-height 预留）。浮层关掉后自然缩回。
   */
  const OVERLAYS = "dialog[open], .ak-toasts, .ak-menu, .ak-popover, .ak-tooltip";
  let settle = 0;
  const fit = () => {
    let h = doc.body.getBoundingClientRect().height;
    for (const el of doc.querySelectorAll<HTMLElement>(OVERLAYS)) {
      const r = el.getBoundingClientRect();
      if (!r.height) continue;
      // 对话框居中、Toast 贴底：要的是「装得下」（对话框有视口高度上限，iframe 矮时会被压扁——取内容全高 scrollHeight）；
      // 下拉 / 气泡挂在触发元素下面：要的是「底边露得出来」
      h = Math.max(h, el.matches("dialog, .ak-toasts") ? Math.max(r.height, el.scrollHeight) + 48 : r.bottom + 8);
    }
    const px = `${Math.ceil(h)}px`;
    // iframe 变高后，受视口高度约束的浮层（对话框）会跟着长，再量一次直到稳定（最多 5 轮，防来回振荡）
    if (f.style.height !== px && settle++ < 5) requestAnimationFrame(fit);
    else settle = 0;
    f.style.height = px;
  };
  ro = new ResizeObserver(fit);
  ro.observe(doc.body);
  fit();
  const refresh = () => {
    markup.value = serialize(root);
    fit();
  };
  mo = new MutationObserver(refresh);
  // 看整个 body：Toast 容器 / 对话框可能被 Teleport 到 #root 外面
  mo.observe(doc.body, { subtree: true, childList: true, attributes: true, characterData: true });
  refresh();
});

watch(isDark, () => {
  const doc = frame.value?.contentDocument;
  if (doc) applyTheme(doc);
});

onBeforeUnmount(() => {
  disposed = true;
  app?.unmount();
  ro?.disconnect();
  mo?.disconnect();
});

const toggle = (t: "vue" | "html") => (tab.value = tab.value === t ? "" : t);
async function copyMarkup() {
  await navigator.clipboard.writeText(markup.value.text);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <div class="akd-demo vp-raw">
    <iframe ref="frame" class="akd-demo__frame" title="示例" />
    <div class="akd-demo__bar">
      <button v-if="slots.vue" type="button" :class="{ 'is-on': tab === 'vue' }" @click="toggle('vue')">Vue</button>
      <button type="button" :class="{ 'is-on': tab === 'html' }" @click="toggle('html')">HTML</button>
      <span class="akd-demo__spacer" />
      <a v-if="story" :href="`${storybookBase}?path=/story/${story}`" target="_blank" rel="noopener">Storybook ↗</a>
    </div>
    <div v-show="tab === 'vue'" class="akd-demo__code"><slot name="vue" /></div>
    <div v-show="tab === 'html'" class="akd-demo__code">
      <slot name="html">
        <div class="language-html akd-demo__markup">
          <button type="button" class="akd-demo__copy" @click="copyMarkup">{{ copied ? "已复制" : "复制" }}</button>
          <span class="lang">html</span>
          <pre><code v-html="markup.html" /></pre>
        </div>
        <p class="akd-demo__note">上面是组件实际渲染出的结构——MW 模板 / Lua 照这个输出即可得到同样的外观。</p>
      </slot>
    </div>
  </div>
</template>
