<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkSkill from "../../Skill/AkSkill.vue";
import AkSkillSheet, { type SkillSheetLevel } from "../AkSkillSheet.vue";

/** 陈 · 鞘击：描述模板（skill_table 原样）+ 每级的 blackboard / 初始 / 消耗 */
const template =
  "下次攻击使用刀鞘砸向敌人，造成相当于攻击力<@ba.vup>{atk_scale:0%}</>的物理伤害，令命中目标<$ba.stun>晕眩</><@ba.vup>{stun}</>秒";
// [atk_scale, stun, 初始, 消耗]：1–7 级 + 专精 Ⅰ–Ⅲ
const data = [
  [2, 1, 0, 7], [2.1, 1, 0, 7], [2.2, 1, 0, 7], [2.3, 1.25, 0, 6], [2.4, 1.25, 0, 6],
  [2.5, 1.25, 0, 6], [2.6, 1.5, 0, 5], [2.8, 1.5, 0, 5], [3, 1.5, 0, 5], [3.2, 1.5, 0, 4],
];
const levels: SkillSheetLevel[] = data.map(([atk_scale, stun, init, cost]) => ({ description: template, vars: { atk_scale, stun }, init, cost }));

const terms = { "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能" };
const masteryIcons = [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`));
</script>

<template>
  <AkSkillSheet :levels="levels" :highlight="7" :mastery-icons="masteryIcons" :terms="terms" label="鞘击 · 各等级数据">
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
  </AkSkillSheet>
</template>
