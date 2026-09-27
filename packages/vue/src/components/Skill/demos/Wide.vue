<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkRange from "../../Range/AkRange.vue";
import AkSkill from "../AkSkill.vue";

/** 赤霄·拔刀的技能范围（range_table 的 grids，相对自身） */
const range: [number, number][] = [[-1, 0], [-1, 1], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1]];
/* 右侧槽：开放条件 + 技能范围（写了 unlock 或 #aside 就是三栏的宽卡） */
</script>

<template>
  <AkSkill
    name="赤霄·拔刀"
    :icon="asset('skill/chen_2.png')"
    sp-type="attack"
    trigger="manual"
    :cost="25"
    :init="14"
    unlock="技能2 · 精英一开放"
    :unlock-icon="asset('elite/elite_1.png')"
  >
    <template #aside><AkRange :grids="range" size="sm" label="技能范围" /></template>
    对前方范围内最多 6 名敌人造成相当于攻击力 410% 的物理和法术伤害
  </AkSkill>
</template>
