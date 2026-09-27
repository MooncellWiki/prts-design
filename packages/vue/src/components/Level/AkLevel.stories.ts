import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkLevel from "./AkLevel.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Arknights/Level",
  component: AkLevel,
  tags: ["autodocs"],
  args: { value: 90, variant: "badge" },
  argTypes: {
    value: { control: { type: "number", min: 1, max: 90 } },
    variant: { control: "inline-radio", options: ["default", "badge"] },
  },
  render: args => ({ components: { AkLevel }, setup: () => ({ args }), template: '<AkLevel v-bind="args" />' }),
} satisfies Meta<typeof AkLevel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "读数 / 灰块", ...demo(VariantsDemo) };
