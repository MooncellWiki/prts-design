import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkCalc from "./AkCalc.vue";
import AkTalentTable from "./AkTalentTable.vue";
import BasicDemo from "./demos/Basic.vue";
import TogglesDemo from "./demos/Toggles.vue";

const meta = {
  title: "Arknights/TalentTable",
  component: AkTalentTable,
  subcomponents: { AkCalc },
  tags: ["autodocs"],
  args: {
    // 陈 · 第二天赋
    title: "第二天赋",
    rows: [
      {
        name: "持刀格斗术",
        condition: "精英二",
        description: "攻击力+5%，防御力+5%，物理闪避+10%",
        potential: "攻击力+6%<@ba.talpu>（+1%）</>，防御力+6%<@ba.talpu>（+1%）</>，物理闪避+13%<@ba.talpu>（+3%）</>",
      },
      {
        name: "持刀格斗术",
        condition: "精英二 · Y模组 2级",
        description: "攻击力+11%，防御力+11%，物理闪避+15%",
        potential: "攻击力+12%<@ba.talpu>（+1%）</>，防御力+12%<@ba.talpu>（+1%）</>，物理闪避+18%<@ba.talpu>（+3%）</>",
      },
      {
        name: "持刀格斗术",
        condition: "精英二 · Y模组 3级",
        description: "攻击力+15%，防御力+15%，物理闪避+18%",
        potential: "攻击力+16%<@ba.talpu>（+1%）</>，防御力+16%<@ba.talpu>（+1%）</>，物理闪避+21%<@ba.talpu>（+3%）</>",
      },
    ],
    potentialRank: 5,
    potentialIcon: asset("potential/potential_4.png"),
  },
  render: args => ({ components: { AkTalentTable }, setup: () => ({ args }), template: '<AkTalentTable v-bind="args" />' }),
} satisfies Meta<typeof AkTalentTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "条件表", ...demo(BasicDemo) };
export const Toggles: Story = { name: "潜能 / 算法开关", ...demo(TogglesDemo) };
