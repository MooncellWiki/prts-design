import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkDivider from "./AkDivider.vue";
import VariantsDemo from "./demos/Variants.vue";
import VerticalDemo from "./demos/Vertical.vue";

const meta = {
  title: "Components/Divider",
  component: AkDivider,
  tags: ["autodocs"],
  args: { variant: "accent", vertical: false },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "accent", "stripes"] },
  },
  render: args => ({ components: { AkDivider }, setup: () => ({ args }), template: '<AkDivider v-bind="args" />' }),
} satisfies Meta<typeof AkDivider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "变体 / 文字", ...demo(VariantsDemo) };
export const Vertical: Story = { name: "竖线", ...demo(VerticalDemo) };
