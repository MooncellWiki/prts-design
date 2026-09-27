import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkStat from "./AkStat.vue";
import AkStatRow from "./AkStatRow.vue";
import BasicDemo from "./demos/Basic.vue";
import InlineDemo from "./demos/Inline.vue";

const meta = {
  title: "Components/Stat",
  component: AkStat,
  subcomponents: { AkStatRow },
  tags: ["autodocs"],
  args: { label: "Operators", value: 356, delta: "+4 本月", inline: false },
  argTypes: {
    trend: { control: "inline-radio", options: [undefined, "up", "down"] },
  },
} satisfies Meta<typeof AkStat>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "一排统计 · 变化量 · 单位", ...demo(BasicDemo) };
export const Inline: Story = { name: "行内", ...demo(InlineDemo) };
