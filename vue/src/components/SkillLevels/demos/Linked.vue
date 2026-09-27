<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkSkill from "../../Skill/AkSkill.vue";
import AkSkillSheet, { type SkillSheetLevel } from "../../SkillSheet/AkSkillSheet.vue";
import AkSkillLevels from "../AkSkillLevels.vue";

/** 选中的等级 = 全等级表的高亮行（tr.is-hl） */
const level = ref(7);

/** 陈 · 赤霄·拔刀 */
const template =
  "对前方范围内最多<@ba.vup>{max_target}</>名敌人造成相当于攻击力<@ba.vup>{atk_scale:0%}</>的<@ba.rem>物理</>和相当于攻击力<@ba.vup>{atk_scale:0%}</>的<@ba.rem>法术</>伤害";
// [max_target, atk_scale, 初始, 消耗]：1–7 级 + 专精 Ⅰ–Ⅲ
const data = [
  [4, 3.3, 10, 27], [4, 3.4, 10, 27], [4, 3.5, 10, 27], [5, 3.7, 12, 26], [5, 3.8, 12, 26],
  [5, 3.9, 12, 26], [6, 4.1, 14, 25], [6, 4.4, 15, 23], [6, 4.7, 16, 21], [7, 5, 20, 20],
];
const levels: SkillSheetLevel[] = data.map(([max_target, atk_scale, init, cost]) => ({ description: template, vars: { max_target, atk_scale }, init, cost }));
const masteryIcons = [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`));
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div><AkSkillLevels v-model="level" :mastery-icons="masteryIcons" label="赤霄·拔刀 · 技能等级" /></div>
    <AkSkillSheet :levels="levels" :highlight="level" :mastery-icons="masteryIcons" label="赤霄·拔刀 · 各等级数据">
      <template #header><AkSkill name="赤霄·拔刀" :icon="asset('skill/chen_2.png')" sp-type="attack" trigger="manual" :heading-level="3" /></template>
    </AkSkillSheet>
  </div>
</template>
