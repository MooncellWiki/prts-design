import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";

/**
 * 整页样例：页面是文档而不是组件（自带 <html> 类、<head> 里的页面样式、现网 Widget 的 jQuery / 脚本），
 * 所以原样跑 preview/*.html（scripts/build-preview.py 从 preview/_src 生成），用 iframe 挂进来；主题 / 活动主题经 URL 参数传给页面的 preview.js。
 */
const page = (file: string): StoryObj => ({
  parameters: { layout: "fullscreen", akdsBare: true, a11y: { disable: true }, controls: { disable: true } },
  render: (_args, { globals }) => ({
    render: () =>
      h("iframe", {
        src: `../preview/${file}?theme=${globals.theme}&demo=${globals.eventTheme === "on" ? 1 : 0}`,
        title: file,
        style: "display: block; width: 100%; height: 100vh; border: 0",
      }),
  }),
});

export default { title: "Pages/整页样例", tags: ["!autodocs"] } satisfies Meta;

export const Home: StoryObj = { name: "首页设计稿", ...page("home.html") };
export const Operators: StoryObj = { name: "干员一览（列表 / 筛选页）", ...page("operators.html") };
export const Items: StoryObj = { name: "道具一览（列表 / 筛选页）", ...page("items.html") };
export const Recruit: StoryObj = { name: "公招计算（工具页）", ...page("recruit.html") };
export const Operator: StoryObj = { name: "干员页样例（陈）", ...page("operator.html") };
