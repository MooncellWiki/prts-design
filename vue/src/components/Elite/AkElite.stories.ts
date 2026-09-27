import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkElite from "./AkElite.vue";
import PhasesDemo from "./demos/Phases.vue";
import TextDemo from "./demos/Text.vue";

const meta = {
  title: "Arknights/Elite",
  component: AkElite,
  tags: ["autodocs"],
  args: { src: asset("elite/elite_2.png"), phase: 2, level: 90, size: "md" },
  argTypes: {
    phase: { control: "inline-radio", options: [0, 1, 2] },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  render: args => ({ components: { AkElite }, setup: () => ({ args }), template: '<AkElite v-bind="args" />' }),
} satisfies Meta<typeof AkElite>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Phases: Story = { name: "阶段 / 等级 / 大图标", ...demo(PhasesDemo) };
export const Text: Story = { name: "改写文字（材料表 / 专精 / 天赋条件）", ...demo(TextDemo) };
