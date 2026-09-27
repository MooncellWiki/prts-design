import type { Meta, StoryObj } from "@storybook/vue3-vite";

import { asset } from "../../demo/asset";
import { demo } from "../../demo/story";
import AkItem from "../Item/AkItem.vue";
import AkMaterials from "./AkMaterials.vue";
import AkMaterialsDivider from "./AkMaterialsDivider.vue";
import AkMaterialsRow from "./AkMaterialsRow.vue";
import MasteryDemo from "./demos/Mastery.vue";
import PromotionDemo from "./demos/Promotion.vue";
import SkillDemo from "./demos/Skill.vue";

const meta = {
  title: "Arknights/Materials",
  component: AkMaterials,
  subcomponents: { AkMaterialsRow, AkMaterialsDivider },
  tags: ["autodocs"],
  render: () => ({
    components: { AkMaterials, AkMaterialsRow, AkMaterialsDivider, AkItem },
    setup: () => ({ f: (id: string) => asset(`item/framed/${id}.png`) }),
    template: `<AkMaterials>
  <AkMaterialsRow label="3 → 4"><AkItem :src="f('3302')" name="技巧概要·卷2" :count="8" /><AkItem :src="f('30022')" name="糖" :count="5" /></AkMaterialsRow>
  <AkMaterialsDivider>达到精英阶段 1 后解锁</AkMaterialsDivider>
  <AkMaterialsRow label="4 → 5"><AkItem :src="f('3302')" name="技巧概要·卷2" :count="8" /><AkItem :src="f('30032')" name="聚酸酯" :count="4" /></AkMaterialsRow>
</AkMaterials>`,
  }),
} satisfies Meta<typeof AkMaterials>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Promotion: Story = { name: "精英化材料", ...demo(PromotionDemo) };
export const Skill: Story = { name: "技能升级材料", ...demo(SkillDemo) };
export const Mastery: Story = { name: "专精训练", ...demo(MasteryDemo) };
