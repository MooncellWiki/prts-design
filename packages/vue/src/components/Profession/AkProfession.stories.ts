import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkProfession from "./AkProfession.vue";
import AkProfessionLabel from "./AkProfessionLabel.vue";
import BranchDemo from "./demos/Branch.vue";
import ProfessionsDemo from "./demos/Professions.vue";
import VariantsDemo from "./demos/Variants.vue";

const meta = {
  title: "Arknights/Profession",
  component: AkProfession,
  subcomponents: { AkProfessionLabel },
  tags: ["autodocs"],
  args: { src: asset("profession/warrior.png"), name: "近卫", size: "lg", variant: "default" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
    variant: { control: "inline-radio", options: ["default", "box", "outline"] },
  },
  render: args => ({ components: { AkProfession }, setup: () => ({ args }), template: '<AkProfession v-bind="args" />' }),
} satisfies Meta<typeof AkProfession>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Professions: Story = { name: "八大职业", ...demo(ProfessionsDemo) };
export const Variants: Story = { name: "尺寸 / 外观", ...demo(VariantsDemo) };
export const Branch: Story = { name: "分支 / 带文字", ...demo(BranchDemo) };
