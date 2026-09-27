<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkSkill from "../../Skill/AkSkill.vue";
import AkSkillLevels from "../../SkillLevels/AkSkillLevels.vue";
import AkSkillMatrix, { type SkillMatrixRow } from "../AkSkillMatrix.vue";

/** 陈 · 赤霄·绝影：等级选择器与矩阵绑同一个 v-model——点选择器 = 钉住那一列，点矩阵的列 = 选择器跟着变 */
const level = ref<number | undefined>(7);

const description =
  "向周围寻找最近的敌方目标，对其发动<@ba.vup>10</>次连续斩击，每次造成相当于攻击力<@ba.vup>{atk_scale}</>的物理伤害，并在最后一击时使目标<$ba.stun>晕眩</><@ba.vup>{stun}</>秒";
const rows: SkillMatrixRow[] = [
  { key: "atk_scale", label: "伤害倍率", values: ["200%", "210%", "220%", "230%", "240%", "250%", "260%", "280%", "300%", "320%"] },
  { key: "stun", label: "晕眩（秒）", values: [2, 2, 2, 2.5, 2.5, 2.5, 3, 3, 3, 4] },
  { label: "初始", sp: "init", values: [10, 10, 10, 10, 10, 10, 10, 13, 16, 20] },
  { label: "消耗", sp: "cost", values: [40, 40, 40, 38, 38, 38, 36, 34, 32, 30] },
];

const terms = { "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能" };
const masteryIcons = [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`));
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div><AkSkillLevels v-model="level" :mastery-icons="masteryIcons" label="赤霄·绝影 · 技能等级" /></div>
    <AkSkillMatrix v-model="level" :rows="rows" :description="description" :mastery-icons="masteryIcons" :terms="terms" label="赤霄·绝影 · 各等级参数">
      <template #header>
        <AkSkill name="赤霄·绝影" :icon="asset('skill/chen_3.png')" sp-type="attack" trigger="manual" :heading-level="3" />
      </template>
    </AkSkillMatrix>
  </div>
</template>
