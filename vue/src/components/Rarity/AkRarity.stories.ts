import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkRarity from "./AkRarity.vue";
import ImageDemo from "./demos/Image.vue";
import SizesDemo from "./demos/Sizes.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Arknights/Rarity",
  component: AkRarity,
  tags: ["autodocs"],
  args: { value: 6, variant: "default", size: "lg" },
  argTypes: {
    value: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
    variant: { control: "inline-radio", options: ["default", "white", "tier"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: args => ({ components: { AkRarity }, setup: () => ({ args }), template: '<AkRarity v-bind="args" />' }),
} satisfies Meta<typeof AkRarity>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "颜色", ...demo(VariantsDemo) };
export const Sizes: Story = { name: "尺寸 / 行内", ...demo(SizesDemo) };
export const Image: Story = { name: "游戏原图", ...demo(ImageDemo) };
