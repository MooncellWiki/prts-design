<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkSkill from "../../Skill/AkSkill.vue";
import AkSkillMatrix, { type SkillMatrixRow } from "../AkSkillMatrix.vue";

/** 陈 · 鞘击：描述只写一遍，{atk_scale} / {stun} 两个变量位各对应矩阵的一行 */
const description =
  "下次攻击使用刀鞘砸向敌人，造成相当于攻击力<@ba.vup>{atk_scale}</>的物理伤害，令命中目标<$ba.stun>晕眩</><@ba.vup>{stun}</>秒";
const rows: SkillMatrixRow[] = [
  { key: "atk_scale", label: "伤害倍率", values: ["200%", "210%", "220%", "230%", "240%", "250%", "260%", "280%", "300%", "320%"] },
  { key: "stun", label: "晕眩（秒）", values: [1, 1, 1, 1.25, 1.25, 1.25, 1.5, 1.5, 1.5, 1.5] },
  { label: "初始", sp: "init", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { label: "消耗", sp: "cost", values: [7, 7, 7, 6, 6, 6, 5, 5, 5, 4] },
];

const terms = { "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能" };
const masteryIcons = [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`));
</script>

<template>
  <AkSkillMatrix :rows="rows" :description="description" :mastery-icons="masteryIcons" :terms="terms" label="鞘击 · 各等级参数">
    <template #header>
      <AkSkill
        name="鞘击"
        :icon="asset('skill/chen_1.png')"
        sp-type="attack"
        trigger="auto"
        unlock="技能1 · 精英零开放"
        :unlock-icon="asset('elite/elite_0.png')"
        :heading-level="3"
      />
    </template>
  </AkSkillMatrix>
</template>
