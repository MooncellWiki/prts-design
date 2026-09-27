import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSkeleton from "./AkSkeleton.vue";
import LayoutDemo from "./demos/Layout.vue";
import ShapesDemo from "./demos/Shapes.vue";

const meta = {
  title: "Components/Skeleton",
  component: AkSkeleton,
  tags: ["autodocs"],
  args: { text: true, repeat: 3 },
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
  },
  render: args => ({ components: { AkSkeleton }, setup: () => ({ args }), template: '<div><AkSkeleton v-bind="args" /></div>' }),
} satisfies Meta<typeof AkSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Shapes: Story = { name: "形状 / 尺寸", ...demo(ShapesDemo) };
export const Layout: Story = { name: "拼成列表占位", ...demo(LayoutDemo) };
