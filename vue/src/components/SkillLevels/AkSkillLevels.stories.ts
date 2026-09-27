import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkSkillLevels from "./AkSkillLevels.vue";
import BasicDemo from "./demos/Basic.vue";
import LinkedDemo from "./demos/Linked.vue";

const meta = {
  title: "Arknights/SkillLevels",
  component: AkSkillLevels,
  tags: ["autodocs"],
  args: { max: 10, masteryIcons: [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`)), label: "技能等级" },
  argTypes: {
    max: { control: "inline-radio", options: [7, 10] },
  },
  render: args => ({ components: { AkSkillLevels }, setup: () => ({ args }), template: '<AkSkillLevels v-bind="args" />' }),
} satisfies Meta<typeof AkSkillLevels>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "等级 1–7 + 专精", ...demo(BasicDemo) };
export const Linked: Story = { name: "配全等级表高亮", ...demo(LinkedDemo) };
