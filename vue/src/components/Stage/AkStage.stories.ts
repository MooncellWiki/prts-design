import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkSanity from "./AkSanity.vue";
import AkStage from "./AkStage.vue";
import AkStageCode from "./AkStageCode.vue";
import CompactDemo from "./demos/Compact.vue";
import InlineDemo from "./demos/Inline.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Arknights/Stage",
  component: AkStage,
  subcomponents: { AkStageCode, AkSanity },
  tags: ["autodocs"],
  args: { code: "1-7", caption: "Main · Chapter 1", name: "暴君", variant: "default", sanity: 6, level: "LV.30", href: "#" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "hard", "ex", "story"] },
  },
  render: args => ({ components: { AkStage }, setup: () => ({ args }), template: '<AkStage v-bind="args" />' }),
} satisfies Meta<typeof AkStage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Variants: Story = { name: "关卡类型", ...demo(VariantsDemo) };
export const Compact: Story = { name: "紧凑（只有编号 + 名字）", ...demo(CompactDemo) };
export const Inline: Story = { name: "行内关卡号 / 理智", ...demo(InlineDemo) };
