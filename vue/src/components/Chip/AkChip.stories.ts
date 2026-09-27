import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import { icons } from "../../icons";
import AkChip from "./AkChip.vue";
import FilterDemo from "./demos/Filter.vue";
import SingleDemo from "./demos/Single.vue";

const meta = {
  title: "Components/Chip",
  component: AkChip,
  tags: ["autodocs"],
  args: { modelValue: true },
  argTypes: {
    icon: { control: "select", options: [undefined, ...Object.keys(icons)] },
  },
  render: args => ({
    components: { AkChip },
    setup: () => ({ args }),
    template: '<AkChip v-bind="args" @update:model-value="args.modelValue = $event">近卫</AkChip>',
  }),
} satisfies Meta<typeof AkChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Filter: Story = { name: "筛选（多选）", ...demo(FilterDemo) };
export const Single: Story = { name: "单选（语音语种）", ...demo(SingleDemo) };
