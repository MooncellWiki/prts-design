import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkSkillMatrix from "./AkSkillMatrix.vue";
import BasicDemo from "./demos/Basic.vue";
import LinkedDemo from "./demos/Linked.vue";

const meta = {
  title: "Arknights/SkillMatrix",
  component: AkSkillMatrix,
  tags: ["autodocs"],
  args: {
    // 陈 · 赤霄·拔刀
    description:
      "对前方范围内最多<@ba.vup>{max_target}</>名敌人造成相当于攻击力<@ba.vup>{atk_scale}</>的<@ba.rem>物理</>和相当于攻击力<@ba.vup>{atk_scale}</>的<@ba.rem>法术</>伤害",
    rows: [
      { key: "max_target", label: "目标数", values: [4, 4, 4, 5, 5, 5, 6, 6, 6, 7] },
      { key: "atk_scale", label: "伤害倍率", values: ["330%", "340%", "350%", "370%", "380%", "390%", "410%", "440%", "470%", "500%"] },
      { label: "初始", sp: "init", values: [10, 10, 10, 12, 12, 12, 14, 15, 16, 20] },
      { label: "消耗", sp: "cost", values: [27, 27, 27, 26, 26, 26, 25, 23, 21, 20] },
    ],
    masteryIcons: [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`)),
    label: "赤霄·拔刀 · 各等级参数",
  },
  render: args => ({ components: { AkSkillMatrix }, setup: () => ({ args }), template: '<AkSkillMatrix v-bind="args" />' }),
} satisfies Meta<typeof AkSkillMatrix>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Basic: Story = { name: "参数矩阵", ...demo(BasicDemo) };
export const Linked: Story = { name: "配等级选择器", ...demo(LinkedDemo) };
