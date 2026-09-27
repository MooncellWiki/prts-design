<script setup lang="ts">
import AkAttr from "../AkAttr.vue";
import AkAttrs from "../AkAttrs.vue";

/** 陈 · 精英二满级：四维（强调）+ 部署四项 */
const stats = [
  { name: "HP", zh: "生命上限", value: 2880, accent: true },
  { name: "ATK", zh: "攻击", value: 610, accent: true },
  { name: "DEF", zh: "防御", value: 352, accent: true },
  { name: "RES", zh: "法术抗性", value: 0, accent: true },
  { name: "COST", zh: "部署费用", value: 23 },
  { name: "BLOCK", zh: "阻挡数", value: 2 },
  { name: "INTERVAL", zh: "攻击间隔", value: 1.3, unit: "s" },
  { name: "REDEPLOY", zh: "再部署", value: 70, unit: "s" },
];
</script>

<template>
  <AkAttrs>
    <AkAttr v-for="s in stats" :key="s.name" v-bind="s" />
  </AkAttrs>
</template>
