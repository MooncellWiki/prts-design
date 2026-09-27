import type { Component } from "vue";

/**
 * 把 demos/*.vue 包成一条 story：Storybook 与文档站共用同一批示例（文档站直接挂这些 SFC，Storybook 这里挂）。
 * 用法：export const Variants: Story = { name: "变体", ...demo(VariantsDemo) };   —— name 要写在字面量里，Storybook 静态索引才读得到
 */
export const demo = (c: Component) => ({
  render: () => ({ components: { Demo: c }, template: "<Demo />" }),
  parameters: { controls: { disable: true }, actions: { disable: true } },
});
