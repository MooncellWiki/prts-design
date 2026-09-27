import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSelect from "./AkSelect.vue";
import BasicDemo from "./demos/Basic.vue";
import GroupsDemo from "./demos/Groups.vue";
import StatesDemo from "./demos/States.vue";

const meta = {
  title: "Components/Select",
  component: AkSelect,
  tags: ["autodocs"],
  args: {
    options: [
      { label: "先锋", value: "PIONEER" },
      { label: "近卫", value: "WARRIOR" },
      { label: "重装", value: "TANK" },
      { label: "狙击", value: "SNIPER" },
    ],
    placeholder: "选择职业",
    size: "md",
    label: "职业",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    status: { control: "inline-radio", options: [undefined, "error", "success"] },
  },
  render: args => ({ components: { AkSelect }, setup: () => ({ args }), template: '<AkSelect v-bind="args" />' }),
} satisfies Meta<typeof AkSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本", ...demo(BasicDemo) };
export const Groups: Story = { name: "分组 / 禁用项", ...demo(GroupsDemo) };
export const States: Story = { name: "尺寸 / 状态", ...demo(StatesDemo) };
