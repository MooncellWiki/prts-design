import type { Preview } from "@storybook/vue3-vite";
import { h, ref } from "vue";

import akdsCss from "../packages/css/src/index.css?inline";
import standaloneCss from "../packages/css/src/standalone.css?inline";
import fontsCss from "../packages/css/src/fonts.css?inline";
import demoThemeCss from "../packages/css/src/chrome/demo-theme.css?raw";

// 活动主题示例的素材 url 按站点布局写（/src/chrome/ → ../../preview/assets/），从包目录导入时解析不到——按原文注入，素材指向 staticDirs 的 /preview/
document.head.appendChild(document.createElement("style")).textContent = demoThemeCss.replaceAll("../../preview/assets/", "./preview/assets/");

/**
 * 宿主（工具栏「宿主」）：同一个组件在三种页面上应当一模一样（对照页 preview/gallery.html 与 e2e/hosts.spec.ts 同一张表）——
 *   akds    皮肤全套 index.css（= prts.wiki 上的 Skin:Arknights）
 *   vector  Vector 2022 的样式夹具（scripts/fetch-vector-css.ts 抓取，入库只作回归测试，不随站点发布）+ standalone.css + fonts.css + 站点自定义样式 site.css（= prts.wiki 上别的皮肤 + mw.loader.using("skins.akds.components")；
 *           MW 上动态加载的样式插在 site.styles 之前，所以 site.css 排在组件样式之后）
 *   bare    只有 standalone.css（= 站外页面 + npm 包）
 */
type Host = "akds" | "vector" | "bare";
const VECTOR_CSS = "./preview/vendor/vector/vector.css";
const SITE_CSS = "./preview/vendor/vector/site.css";
const WRAPPER: Record<Host, string> = {
  akds: "ak-scope mw-body-content mw-parser-output",
  vector: "vector-body mw-body-content mw-parser-output ak-scope",
  bare: "ak-scope",
};
const sheet = document.head.appendChild(document.createElement("style"));
const vectorLink = Object.assign(document.createElement("link"), { rel: "stylesheet", href: VECTOR_CSS });
const siteLink = Object.assign(document.createElement("link"), { rel: "stylesheet", href: SITE_CSS });
/** 夹具在不在：null = 还没查；没抓过就在 story 顶上提示一行，不报错 */
const vectorOk = ref<boolean | null>(null);
let host: Host | undefined;

function applyHost(next: Host) {
  if (next === host) return;
  host = next;
  sheet.textContent = next === "akds" ? akdsCss : next === "vector" ? fontsCss + standaloneCss : standaloneCss;
  document.documentElement.dataset.akdsHost = next; // preview-head.html：vector 宿主下画布让给 Vector 自己的底色
  if (next !== "vector") { vectorLink.remove(); siteLink.remove(); return; }
  if (vectorOk.value === null)
    fetch(VECTOR_CSS, { method: "HEAD" })
      .then(r => (vectorOk.value = r.ok && !!r.headers.get("content-type")?.includes("css")))
      .catch(() => (vectorOk.value = false));
  document.head.insertBefore(vectorLink, sheet); // 宿主样式在前，组件样式在后（MW 上动态加载的模块也插在皮肤样式之后）
  sheet.after(siteLink); // 站点自定义样式（Common.css …）在组件样式之后（MW 上动态加载的模块插在 site.styles 之前）
}

/** 同预览页 preview.js：终端（暗）/ 档案（亮）/ 跟随系统，MW 的 clientpref 类 + data-theme 两套一起打 */
function applyTheme(mode: string, demo: boolean) {
  const html = document.documentElement;
  html.removeAttribute("data-theme");
  html.classList.remove("skin-theme-clientpref-os", "skin-theme-clientpref-day", "skin-theme-clientpref-night");
  if (mode === "light") html.setAttribute("data-theme", "light"), html.classList.add("skin-theme-clientpref-day");
  else if (mode === "dark") html.setAttribute("data-theme", "dark"), html.classList.add("skin-theme-clientpref-night");
  else html.classList.add("skin-theme-clientpref-os");
  html.classList.toggle("ak-theme-demo", demo);
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "主题",
      toolbar: {
        title: "主题",
        icon: "mirror",
        dynamicTitle: true,
        items: [
          { value: "dark", title: "终端（暗）" },
          { value: "light", title: "档案（亮）" },
          { value: "os", title: "跟随系统" },
        ],
      },
    },
    eventTheme: {
      description: "示例活动主题（只覆盖令牌 §2d 的接口变量）",
      toolbar: {
        title: "活动主题",
        icon: "paintbrush",
        dynamicTitle: true,
        items: [
          { value: "off", title: "活动主题：关" },
          { value: "on", title: "活动主题：开" },
        ],
      },
    },
    host: {
      description: "宿主页面：AKDS 皮肤全套 / prts.wiki 上的 Vector 2022 / 站外（只有 standalone.css）",
      toolbar: {
        title: "宿主",
        icon: "browser",
        dynamicTitle: true,
        items: [
          { value: "akds", title: "宿主：AKDS 皮肤" },
          { value: "vector", title: "宿主：Vector 2022" },
          { value: "bare", title: "宿主：站外" },
        ],
      },
    },
  },
  initialGlobals: { theme: "dark", eventTheme: "off", host: "akds" },
  decorators: [
    (story, ctx) => {
      applyTheme(ctx.globals.theme, ctx.globals.eventTheme === "on");
      const current = (ctx.globals.host ?? "akds") as Host;
      applyHost(current);
      /* 组件都是给 wiki 正文用的：包在作用域 + .mw-body-content.mw-parser-output 里渲染（同 MW 页面），整页样例（Pages/）不包（页面自带 body.skin-akds） */
      if (ctx.parameters.akdsBare) return { render: () => h(story()) };
      return {
        render: () => [
          current === "vector" && vectorOk.value === false
            ? h("p", { style: "margin: 0 0 12px; font: 13px/1.5 system-ui; color: #b86f00" }, "Vector 样式夹具不随站点发布（在仓库的 preview/vendor/vector/，只作回归测试），本地开 Storybook 才有。现在等于「站外」宿主。")
            : null,
          h("div", { class: WRAPPER[current] }, [h(story())]),
        ],
      };
    },
  ],
  parameters: {
    layout: "padded",
    backgrounds: { disable: true },
    controls: { expanded: true, sort: "requiredFirst" },
    options: { storySort: { order: ["Components", "Arknights", "Pages"] } },
    a11y: { test: "todo" },
  },
};
export default preview;
