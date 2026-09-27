import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSearch from "./AkSearch.vue";
import BasicDemo from "./demos/Basic.vue";
import SizesDemo from "./demos/Sizes.vue";

const meta = {
  title: "Components/Search",
  component: AkSearch,
  tags: ["autodocs"],
  args: { placeholder: "搜索 PRTS…", size: "md", shortcut: "/", disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  render: args => ({ components: { AkSearch }, setup: () => ({ args }), template: '<AkSearch v-bind="args" />' }),
} satisfies Meta<typeof AkSearch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "快捷键 / 回车搜索", ...demo(BasicDemo) };
export const Sizes: Story = { name: "尺寸 / 在字段里", ...demo(SizesDemo) };
