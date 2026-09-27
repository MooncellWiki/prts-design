import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkTalent from "./AkTalent.vue";
import BasicDemo from "./demos/Basic.vue";

const meta = {
  title: "Arknights/Talent",
  component: AkTalent,
  tags: ["autodocs"],
  args: { name: "呵斥", requirements: [{ icon: asset("elite/elite_2.png"), text: "精英二 · 1级" }] },
  render: args => ({
    components: { AkTalent },
    setup: () => ({ args }),
    template: '<AkTalent v-bind="args">在场时每4秒回复全场友方角色1点攻击/受击技力</AkTalent>',
  }),
} satisfies Meta<typeof AkTalent>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "天赋卡", ...demo(BasicDemo) };
