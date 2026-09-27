import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSlider from "./AkSlider.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Components/Slider",
  component: AkSlider,
  tags: ["autodocs"],
  args: { modelValue: 90, min: 1, max: 90, step: 1, disabled: false, label: "等级" },
  argTypes: { formatValue: { control: false } },
  render: args => ({ components: { AkSlider }, setup: () => ({ args }), template: '<AkSlider v-bind="args" />' }),
} satisfies Meta<typeof AkSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本 / 步长 / 禁用", ...demo(BasicDemo) };
