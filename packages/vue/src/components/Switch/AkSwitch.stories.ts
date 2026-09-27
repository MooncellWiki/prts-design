import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSwitch from "./AkSwitch.vue";
import BasicDemo from "./demos/Basic.vue";
import StateTextDemo from "./demos/StateText.vue";

const meta = {
  title: "Components/Switch",
  component: AkSwitch,
  tags: ["autodocs"],
  args: { modelValue: true, size: "md", disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
  render: args => ({ components: { AkSwitch }, setup: () => ({ args }), template: '<AkSwitch v-bind="args">显示潜能加成</AkSwitch>' }),
} satisfies Meta<typeof AkSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本 / 尺寸 / 禁用", ...demo(BasicDemo) };
export const StateText: Story = { name: "状态文字", ...demo(StateTextDemo) };
