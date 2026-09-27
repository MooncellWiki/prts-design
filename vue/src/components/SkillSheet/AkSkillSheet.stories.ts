import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkSkill from "../Skill/AkSkill.vue";
import AkSkillSheet from "./AkSkillSheet.vue";
import BasicDemo from "./demos/Basic.vue";
import NotesDemo from "./demos/Notes.vue";

/** 陈 · 赤霄·拔刀（Playground 用） */
const template =
  "对前方范围内最多<@ba.vup>{max_target}</>名敌人造成相当于攻击力<@ba.vup>{atk_scale:0%}</>的<@ba.rem>物理</>和相当于攻击力<@ba.vup>{atk_scale:0%}</>的<@ba.rem>法术</>伤害";
const data = [
  [4, 3.3, 10, 27], [4, 3.4, 10, 27], [4, 3.5, 10, 27], [5, 3.7, 12, 26], [5, 3.8, 12, 26],
  [5, 3.9, 12, 26], [6, 4.1, 14, 25], [6, 4.4, 15, 23], [6, 4.7, 16, 21], [7, 5, 20, 20],
];

const meta = {
  title: "Arknights/SkillSheet",
  component: AkSkillSheet,
  tags: ["autodocs"],
  args: {
    levels: data.map(([max_target, atk_scale, init, cost]) => ({ description: template, vars: { max_target, atk_scale }, init, cost })),
    highlight: 7,
    masteryIcons: [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`)),
    label: "赤霄·拔刀 · 各等级数据",
  },
  argTypes: {
    highlight: { control: { type: "number", min: 1, max: 10 } },
  },
  render: args => ({
    components: { AkSkillSheet, AkSkill },
    setup: () => ({ args, icon: asset("skill/chen_2.png") }),
    template: `<AkSkillSheet v-bind="args">
  <template #header><AkSkill name="赤霄·拔刀" :icon="icon" sp-type="attack" trigger="manual" /></template>
  <template #footer><p>※可对空；先造成法术伤害，后造成物理伤害</p></template>
</AkSkillSheet>`,
  }),
} satisfies Meta<typeof AkSkillSheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "全等级表", ...demo(BasicDemo) };
export const Notes: Story = { name: "范围 + 注释", ...demo(NotesDemo) };
