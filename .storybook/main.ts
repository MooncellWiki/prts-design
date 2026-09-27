import type { StorybookConfig } from "@storybook/vue3-vite";
import vue from "@vitejs/plugin-vue";

/**
 * Storybook（≈ primer.style/react/storybook）：Vue 组件的工作台 + 整页样例。
 *   pnpm storybook          开发（:6006）
 *   pnpm build:storybook    → _build/storybook（Pages 站点的 /storybook/）
 * preview/ 整个挂到 /preview/（演示素材 assets/ + 整页样例 home / operator），src/ 挂到 /src/（整页样例按 ../src/ 引样式）。
 */
const config: StorybookConfig = {
  stories: ["../vue/src/**/*.stories.ts", "../vue/pages/*.stories.ts"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/vue3-vite", options: { docgen: "vue-component-meta" } },
  // 开发时 Vite 本来就按仓库根目录供文件；/src 再挂 staticDirs 会抢在 Vite 前面，把 preview.ts 里 import 的 CSS 当纯文本返回（模块加载失败、所有 story 空白）
  staticDirs: [{ from: "../preview", to: "/preview" }, ...(process.argv.includes("build") ? [{ from: "../src", to: "/src" }] : [])],
  core: { disableTelemetry: true },
  viteFinal: async config => ({ ...config, plugins: [...(config.plugins ?? []), vue()] }),
};
export default config;
