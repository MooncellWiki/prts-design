import type { StorybookConfig } from "@storybook/vue3-vite";
import vue from "@vitejs/plugin-vue";

/**
 * Storybook（≈ primer.style/react/storybook）：Vue 组件的工作台 + 整页样例。
 *   pnpm storybook          开发（:6006）
 *   pnpm build:storybook    → _build/storybook（Pages 站点的 /storybook/）
 * preview/ 整个挂到 /preview/（演示素材 assets/ + 整页样例 home / operator），CSS 包 packages/css/src/ 挂到 /src/（整页样例按 ../src/ 引样式）。
 */
const config: StorybookConfig = {
  stories: ["../packages/vue/src/**/*.stories.ts", "./pages/*.stories.ts"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/vue3-vite", options: { docgen: "vue-component-meta" } },
  // /src = CSS 包（整页样例按 ../src/ 引样式，同 Pages 站点的布局）。preview.ts 从 ../packages/css/src 以模块导入样式，地址不同，不会再被 staticDirs 抢走
  staticDirs: [
    { from: "../preview", to: "/preview" },
    { from: "../packages/css/src", to: "/src" },
  ],
  core: { disableTelemetry: true },
  viteFinal: async config => ({ ...config, plugins: [...(config.plugins ?? []), vue()] }),
};
export default config;
