import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkInput from "./AkInput.vue";
import AkInputGroup from "./AkInputGroup.vue";
import BasicDemo from "./demos/Basic.vue";
import GroupDemo from "./demos/Group.vue";
import SizesDemo from "./demos/Sizes.vue";
import StatesDemo from "./demos/States.vue";

const meta = {
  title: "Components/Input",
  component: AkInput,
  subcomponents: { AkInputGroup },
  tags: ["autodocs"],
  args: { type: "text", size: "md", placeholder: "例如：陈", label: "干员名称" },
  argTypes: {
    type: { control: "inline-radio", options: ["text", "textarea", "password", "email", "url", "tel"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    status: { control: "inline-radio", options: [undefined, "error", "success"] },
  },
  render: args => ({ components: { AkInput }, setup: () => ({ args }), template: '<AkInput v-bind="args" />' }),
} satisfies Meta<typeof AkInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "单行 / 多行", ...demo(BasicDemo) };
export const Sizes: Story = { name: "尺寸", ...demo(SizesDemo) };
export const States: Story = { name: "状态", ...demo(StatesDemo) };
export const Group: Story = { name: "前后缀 / 输入组", ...demo(GroupDemo) };
