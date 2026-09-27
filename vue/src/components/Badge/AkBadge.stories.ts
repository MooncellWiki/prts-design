import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkBadge from "./AkBadge.vue";
import VariantsDemo from "./demos/Variants.vue";
import WrapDemo from "./demos/Wrap.vue";

const meta = {
  title: "Components/Badge",
  component: AkBadge,
  tags: ["autodocs"],
  args: { value: 12, variant: "default", show: true },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "accent", "danger"] },
    value: { control: "text" },
  },
  render: args => ({ components: { AkBadge }, setup: () => ({ args }), template: '<AkBadge v-bind="args" />' }),
} satisfies Meta<typeof AkBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "颜色 / 封顶 / 圆点", ...demo(VariantsDemo) };
export const Wrap: Story = { name: "骑在内容上", ...demo(WrapDemo) };
