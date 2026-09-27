import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkHero from "./AkHero.vue";
import ActionsDemo from "./demos/Actions.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Arknights/Hero",
  component: AkHero,
  tags: ["autodocs"],
  args: {
    eyebrow: "PRTS.WIKI · NEW SKIN DESIGN SYSTEM",
    title: "AKDS",
    subtitle: "明日方舟网页设计系统",
    description: "以明日方舟官网与游戏内 UI 为视觉母体，按令牌—组件—模式分层，为 prts.wiki 的 MediaWiki 皮肤定义色彩、字体、间距、装饰语言与组件库。",
    bar: true,
    side: true,
  },
  render: args => ({ components: { AkHero }, setup: () => ({ args }), template: '<AkHero v-bind="args" />' }),
} satisfies Meta<typeof AkHero>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "大标题横幅", ...demo(BasicDemo) };
export const Actions: Story = { name: "带按钮 / 无右侧色面", ...demo(ActionsDemo) };
