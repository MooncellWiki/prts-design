import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkInputNumber from "./AkInputNumber.vue";
import BasicDemo from "./demos/Basic.vue";
import StatesDemo from "./demos/States.vue";

const meta = {
  title: "Components/InputNumber",
  component: AkInputNumber,
  tags: ["autodocs"],
  args: { modelValue: 12, min: 0, max: 99, step: 1, showButton: true, disabled: false, readonly: false, label: "数量" },
  render: args => ({ components: { AkInputNumber }, setup: () => ({ args }), template: '<AkInputNumber v-bind="args" />' }),
} satisfies Meta<typeof AkInputNumber>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "上下限 / 步长", ...demo(BasicDemo) };
export const States: Story = { name: "状态", ...demo(StatesDemo) };
