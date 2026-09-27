import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSpinner from "./AkSpinner.vue";
import VariantsDemo from "./demos/Variants.vue";
import WrapDemo from "./demos/Wrap.vue";

const meta = {
  title: "Components/Spinner",
  component: AkSpinner,
  tags: ["autodocs"],
  args: { variant: "diamond", description: "正在读取干员数据…" },
  argTypes: {
    variant: { control: "inline-radio", options: ["diamond", "bars"] },
    color: { control: "select", options: [undefined, "var(--ak-yellow-500)", "var(--ak-fg)", "var(--ak-danger)"] },
  },
  render: args => ({ components: { AkSpinner }, setup: () => ({ args }), template: '<AkSpinner v-bind="args" />' }),
} satisfies Meta<typeof AkSpinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "样子 / 说明", ...demo(VariantsDemo) };
export const Wrap: Story = { name: "包住内容", ...demo(WrapDemo) };
