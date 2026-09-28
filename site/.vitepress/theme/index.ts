import { type Theme, useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h, watchEffect } from "vue";

import "../../../packages/css/src/fonts.css";
import "../../../packages/css/src/tokens.css";
import "./style.css";
import ComponentGrid from "./components/ComponentGrid.vue";
import ComponentHeader from "./components/ComponentHeader.vue";
import CssClasses from "./components/CssClasses.vue";
import Demo from "./components/Demo.vue";
import IconGrid from "./components/IconGrid.vue";
import PageFrame from "./components/PageFrame.vue";
import PropsTable from "./components/PropsTable.vue";
import TokenTable from "./components/TokenTable.vue";

export default {
  extends: DefaultTheme,
  // 组件页头挂在正文之前（frontmatter 有 component: <id> 的页才出现）
  Layout: () => h(DefaultTheme.Layout, null, { "doc-before": () => h(ComponentHeader) }),
  enhanceApp({ app }) {
    for (const [name, c] of Object.entries({ Demo, PropsTable, CssClasses, ComponentGrid, TokenTable, IconGrid, PageFrame })) app.component(name, c);
  },
  setup() {
    // PRTS Design 令牌按 html[data-theme] 切明暗，跟着 VitePress 的外观开关走
    const { isDark } = useData();
    watchEffect(() => {
      if (typeof document !== "undefined") document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "light");
    });
  },
} satisfies Theme;
