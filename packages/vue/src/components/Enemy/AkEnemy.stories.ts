import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { demo } from "../../demo/story";
import AkEnemy from "./AkEnemy.vue";
import RanksDemo from "./demos/Ranks.vue";

const meta = {
  title: "Arknights/Enemy",
  component: AkEnemy,
  tags: ["autodocs"],
  args: { name: "碎骨", code: "B003", variant: "boss", level: 4, levelMax: 4 },
  argTypes: {
    variant: { control: "inline-radio", options: ["normal", "elite", "boss"] },
    level: { control: { type: "range", min: 0, max: 4 } },
  },
  render: args => ({ components: { AkEnemy }, setup: () => ({ args }), template: '<AkEnemy v-bind="args" />' }),
} satisfies Meta<typeof AkEnemy>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Ranks: Story = { name: "级别", ...demo(RanksDemo) };
