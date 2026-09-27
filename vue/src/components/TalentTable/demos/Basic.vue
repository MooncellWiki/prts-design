<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkElite from "../../Elite/AkElite.vue";
import AkTalentTable, { type TalentRow } from "../AkTalentTable.vue";

/** 陈 · 第一天赋：同一个天赋名的几行合并成一格；条件格用插槽放精英化图标 */
const rows: (TalentRow & { phase: 1 | 2; module?: string })[] = [
  { name: "呵斥", phase: 1, description: "在场时每5秒回复全场友方角色1点攻击/受击技力" },
  { name: "呵斥", phase: 2, description: "在场时每4秒回复全场友方角色1点攻击/受击技力" },
  { name: "呵斥", phase: 2, module: "X模组 2级", description: "在场时每3秒回复全场友方角色1点攻击/受击技力" },
  { name: "呵斥", phase: 2, module: "X模组 3级", description: "在场时每3秒回复全场友方角色1点攻击/受击技力，自身额外回复1点技力" },
];
</script>

<template>
  <AkTalentTable title="第一天赋" :rows="rows">
    <template #condition="{ index }">
      <AkElite :src="asset(`elite/elite_${rows[index].phase}.png`)" :phase="rows[index].phase" />
      <template v-if="rows[index].module"> · {{ rows[index].module }}</template>
    </template>
  </AkTalentTable>
</template>
