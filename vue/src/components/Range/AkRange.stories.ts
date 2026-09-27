import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkRange from "./AkRange.vue";
import ShapesDemo from "./demos/Shapes.vue";
import SizesDemo from "./demos/Sizes.vue";

const meta = {
  title: "Arknights/Range",
  component: AkRange,
  tags: ["autodocs"],
  args: {
    grids: [
      [-1, 0],
      [-1, 1],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
    ],
    size: "md",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: args => ({ components: { AkRange }, setup: () => ({ args }), template: '<AkRange v-bind="args" />' }),
} satisfies Meta<typeof AkRange>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Shapes: Story = { name: "范围形状", ...demo(ShapesDemo) };
export const Sizes: Story = { name: "尺寸", ...demo(SizesDemo) };
