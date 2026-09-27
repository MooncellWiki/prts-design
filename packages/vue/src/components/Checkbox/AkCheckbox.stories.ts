import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkCheckbox from "./AkCheckbox.vue";
import AkCheckboxGroup from "./AkCheckboxGroup.vue";
import BasicDemo from "./demos/Basic.vue";
import GroupDemo from "./demos/Group.vue";
import IndeterminateDemo from "./demos/Indeterminate.vue";

const meta = {
  title: "Components/Checkbox",
  component: AkCheckbox,
  subcomponents: { AkCheckboxGroup },
  tags: ["autodocs"],
  args: { modelValue: true, size: "md", indeterminate: false, disabled: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"] },
    value: { control: false },
  },
  render: args => ({ components: { AkCheckbox }, setup: () => ({ args }), template: '<AkCheckbox v-bind="args">可公招</AkCheckbox>' }),
} satisfies Meta<typeof AkCheckbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "基本 / 禁用 / 尺寸", ...demo(BasicDemo) };
export const Group: Story = { name: "复选组（最多选 3 个）", ...demo(GroupDemo) };
export const Indeterminate: Story = { name: "半选（全选框）", ...demo(IndeterminateDemo) };
