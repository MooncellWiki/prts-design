import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import { icons } from "../../icons";
import AkEmpty from "./AkEmpty.vue";
import BasicDemo from "./demos/Basic.vue";
import CodeDemo from "./demos/Code.vue";

const meta = {
  title: "Components/Empty",
  component: AkEmpty,
  tags: ["autodocs"],
  args: { title: "暂无数据", description: "尝试更换筛选条件", icon: "empty" },
  argTypes: {
    icon: { control: "select", options: [false, ...Object.keys(icons)] },
  },
  render: args => ({ components: { AkEmpty }, setup: () => ({ args }), template: '<AkEmpty v-bind="args" />' }),
} satisfies Meta<typeof AkEmpty>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基础 / 操作", ...demo(BasicDemo) };
export const Code: Story = { name: "状态码（404）", ...demo(CodeDemo) };
