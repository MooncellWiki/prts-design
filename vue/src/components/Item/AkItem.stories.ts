import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkItem from "./AkItem.vue";
import BareDemo from "./demos/Bare.vue";
import FramedDemo from "./demos/Framed.vue";
import SizesDemo from "./demos/Sizes.vue";

const meta = {
  title: "Arknights/Item",
  component: AkItem,
  tags: ["autodocs"],
  args: { src: asset("item/framed/30012.png"), name: "固源岩", count: 12, size: "md" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    rarity: { control: "inline-radio", options: [1, 2, 3, 4, 5, 6] },
  },
  render: args => ({ components: { AkItem }, setup: () => ({ args }), template: '<AkItem v-bind="args" />' }),
} satisfies Meta<typeof AkItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Framed: Story = { name: "合成图（默认）", ...demo(FramedDemo) };
export const Sizes: Story = { name: "尺寸 / 状态 / 行内", ...demo(SizesDemo) };
export const Bare: Story = { name: "裸图标 + 稀有度底框", ...demo(BareDemo) };
