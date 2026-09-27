<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkRange from "../../Range/AkRange.vue";
import AkRichText from "../../RichText/AkRichText.vue";
import AkSkill from "../../Skill/AkSkill.vue";
import AkSkillSheet, { type SkillSheetLevel } from "../AkSkillSheet.vue";

/** 陈 · 赤霄·绝影 */
const template =
  "向周围寻找最近的敌方目标，对其发动<@ba.vup>{times}</>次连续斩击，每次造成相当于攻击力<@ba.vup>{atk_scale:0%}</>的物理伤害，并在最后一击时使目标<$ba.stun>晕眩</><@ba.vup>{stun}</>秒";
// [atk_scale, stun, 初始, 消耗]：1–7 级 + 专精 Ⅰ–Ⅲ
const data = [
  [2, 2, 10, 40], [2.1, 2, 10, 40], [2.2, 2, 10, 40], [2.3, 2.5, 10, 38], [2.4, 2.5, 10, 38],
  [2.5, 2.5, 10, 38], [2.6, 3, 10, 36], [2.8, 3, 13, 34], [3, 3, 16, 32], [3.2, 4, 20, 30],
];
const levels: SkillSheetLevel[] = data.map(([atk_scale, stun, init, cost]) => ({
  description: template,
  vars: { times: 10, atk_scale, stun },
  init,
  cost,
}));

const terms = {
  "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能",
  "ba.invincible": "无敌：无法被不同阵营选中（属于无法选择类效果）；受到的伤害与元素值变为 0；无法触发任何单位未绑定选择器的能力",
  "ba.unblockable": "不可阻挡：无法阻挡 / 被阻挡，自动解除阻挡",
};
const masteryIcons = [1, 2, 3].map(n => asset(`specialized/specialized_tiny_${n}.png`));
/** 技能范围（range_table 的 grids） */
const range: [number, number][] = [[-2, 0], [-1, -1], [-1, 0], [-1, 1], [0, -2], [0, -1], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1], [2, 0]];
</script>

<template>
  <AkSkillSheet :levels="levels" :mastery-icons="masteryIcons" :terms="terms" label="赤霄·绝影 · 各等级数据">
    <template #header>
      <AkSkill
        name="赤霄·绝影"
        :icon="asset('skill/chen_3.png')"
        sp-type="attack"
        trigger="manual"
        unlock="技能3 · 精英二开放"
        :unlock-icon="asset('elite/elite_2.png')"
        :heading-level="3"
      >
        <template #aside><AkRange :grids="range" size="sm" label="技能范围" /></template>
      </AkSkill>
    </template>
    <template #footer>
      <p>※不可对空</p>
      <p><AkRichText text="※技能生效期间，持有效果：<$ba.invincible>无敌</>、<$ba.unblockable>不可阻挡</>" :terms="terms" /></p>
      <p>※若斩击次数未到 10 次之前技能范围内没有目标，立刻中止技能</p>
    </template>
  </AkSkillSheet>
</template>
