import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkProgress from "./AkProgress.vue";
import CircleDemo from "./demos/Circle.vue";
import LineDemo from "./demos/Line.vue";
import StatesDemo from "./demos/States.vue";

const meta = {
  title: "Components/Progress",
  component: AkProgress,
  tags: ["autodocs"],
  args: {
    percentage: 62,
    variant: "accent",
    size: "md",
    label: "信赖 TRUST",
    showIndicator: true,
    stripes: false,
    indeterminate: false,
    circle: false,
  },
  argTypes: {
    percentage: { control: { type: "range", min: 0, max: 100 } },
    variant: { control: "inline-radio", options: ["accent", "yellow", "success", "danger"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    steps: { control: { type: "number", min: 0, max: 12 } },
  },
} satisfies Meta<typeof AkProgress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Line: Story = { name: "线形 · 标签行 · 颜色", ...demo(LineDemo) };
export const States: Story = { name: "粗细 · 斜纹 · 不定 · 分段", ...demo(StatesDemo) };
export const Circle: Story = { name: "环形", ...demo(CircleDemo) };
