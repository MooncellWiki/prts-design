import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkSkill from "./AkSkill.vue";
import CardsDemo from "./demos/Cards.vue";
import StatesDemo from "./demos/States.vue";
import WideDemo from "./demos/Wide.vue";

const meta = {
  title: "Arknights/Skill",
  component: AkSkill,
  tags: ["autodocs"],
  args: {
    name: "赤霄·绝影",
    icon: asset("skill/chen_3.png"),
    spType: "attack",
    trigger: "manual",
    cost: 36,
    init: 10,
  },
  argTypes: {
    spType: { control: "inline-radio", options: ["auto", "attack", "hit", "passive"] },
    trigger: { control: "inline-radio", options: [undefined, "manual", "auto"] },
    headingLevel: { control: "inline-radio", options: [2, 3, 4, 5, 6] },
  },
  render: args => ({
    components: { AkSkill },
    setup: () => ({ args }),
    template: '<AkSkill v-bind="args">向周围寻找最近的敌方目标，对其发动 10 次连续斩击，每次造成相当于攻击力 260% 的物理伤害</AkSkill>',
  }),
} satisfies Meta<typeof AkSkill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Cards: Story = { name: "技能卡", ...demo(CardsDemo) };
export const States: Story = { name: "未解锁", ...demo(StatesDemo) };
export const Wide: Story = { name: "右侧槽（开放条件 / 范围）", ...demo(WideDemo) };
