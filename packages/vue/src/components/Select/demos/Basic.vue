<script setup lang="ts">
import { ref } from "vue";

import AkSelect from "../AkSelect.vue";

const professions = [
  { label: "先锋", value: "PIONEER" },
  { label: "近卫", value: "WARRIOR" },
  { label: "重装", value: "TANK" },
  { label: "狙击", value: "SNIPER" },
  { label: "术师", value: "CASTER" },
  { label: "医疗", value: "MEDIC" },
  { label: "辅助", value: "SUPPORT" },
  { label: "特种", value: "SPECIAL" },
];
const potentials = [1, 2, 3, 4, 5, 6].map(n => ({ label: `潜能 ${n}`, value: n }));
const modules = [
  { label: "陈证章（原型）", value: "" },
  { label: "罗德岛制式剑 · SWO-X 3 级", value: "x" },
  { label: "往昔时光 · SWO-Y 3 级", value: "y" },
];

const profession = ref<string | null>(null);
const potential = ref(1);
const mod = ref("x");
</script>

<template>
  <div class="ak-grid-3 ak-gap-4">
    <AkSelect v-model="profession" :options="professions" placeholder="选择职业" label="职业" />
    <AkSelect v-model="potential" :options="potentials" label="潜能" />
    <AkSelect v-model="mod" :options="modules" label="模组" />
  </div>
</template>
