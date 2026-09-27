import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkPhaseTabs from "./AkPhaseTabs.vue";
import BasicDemo from "./demos/Basic.vue";
import MaxDemo from "./demos/Max.vue";

const meta = {
  title: "Arknights/Phase Tabs",
  component: AkPhaseTabs,
  tags: ["autodocs"],
  args: { modelValue: 0, max: 2, icons: [0, 1, 2].map(n => asset(`elite/elite_${n}.png`)), label: "精英阶段" },
  argTypes: {
    modelValue: { control: "inline-radio", options: [0, 1, 2] },
    max: { control: "inline-radio", options: [0, 1, 2] },
  },
  render: args => ({ components: { AkPhaseTabs }, setup: () => ({ args }), template: '<AkPhaseTabs v-bind="args" v-model="args.modelValue" />' }),
} satisfies Meta<typeof AkPhaseTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本（属性计算器控制行）", ...demo(BasicDemo) };
export const Max: Story = { name: "低星干员 / 无图标", ...demo(MaxDemo) };
