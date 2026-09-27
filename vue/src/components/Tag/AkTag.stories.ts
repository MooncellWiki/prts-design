import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkTag from "./AkTag.vue";
import DetailsDemo from "./demos/Details.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Components/Tag",
  component: AkTag,
  tags: ["autodocs"],
  args: { variant: "accent-soft", size: "md" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "accent", "accent-soft", "yellow", "info", "success", "warning", "danger", "danger-solid", "new", "inverse"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: args => ({ components: { AkTag }, setup: () => ({ args }), template: '<AkTag v-bind="args">近卫</AkTag>' }),
} satisfies Meta<typeof AkTag>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "变体", ...demo(VariantsDemo) };
export const Details: Story = { name: "尺寸 / 标签字 / 圆点 / 可移除", ...demo(DetailsDemo) };
