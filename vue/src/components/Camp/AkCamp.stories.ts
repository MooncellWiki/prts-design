import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkCamp from "./AkCamp.vue";
import BasicDemo from "./demos/Basic.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Arknights/Camp",
  component: AkCamp,
  tags: ["autodocs"],
  args: { src: asset("camp/lgd.png"), name: "龙门近卫局", size: "md", variant: "default", logoOnly: false },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
    variant: { control: "inline-radio", options: ["default", "box"] },
  },
  render: args => ({ components: { AkCamp }, setup: () => ({ args }), template: '<AkCamp v-bind="args" />' }),
} satisfies Meta<typeof AkCamp>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "徽标 + 名字", ...demo(BasicDemo) };
export const Variants: Story = { name: "深底方块 / 大号仅徽标", ...demo(VariantsDemo) };
