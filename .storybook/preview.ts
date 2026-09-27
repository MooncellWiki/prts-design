import type { Preview } from "@storybook/vue3-vite";
import { h } from "vue";

import "../packages/css/src/index.css";
import demoThemeCss from "../packages/css/src/chrome/demo-theme.css?raw";

// 活动主题示例的素材 url 按站点布局写（/src/chrome/ → ../../preview/assets/），从包目录导入时解析不到——按原文注入，素材指向 staticDirs 的 /preview/
document.head.appendChild(document.createElement("style")).textContent = demoThemeCss.replaceAll("../../preview/assets/", "./preview/assets/");

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
  },
  initialGlobals: { theme: "dark", eventTheme: "off" },
  decorators: [
    (story, ctx) => {
      applyTheme(ctx.globals.theme, ctx.globals.eventTheme === "on");
      /* 组件都是给 wiki 正文用的：包在 .mw-body-content.mw-parser-output 里渲染（同 MW 页面），整页样例（Pages/）不包 */
      if (ctx.parameters.akdsBare) return { render: () => h(story()) };
      return { render: () => h("div", { class: "mw-body-content mw-parser-output" }, [h(story())]) };
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
