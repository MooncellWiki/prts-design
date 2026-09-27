<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkProfession from "../AkProfession.vue";

const professions = [
  { id: "pioneer", name: "先锋" },
  { id: "warrior", name: "近卫" },
  { id: "tank", name: "重装" },
  { id: "sniper", name: "狙击" },
  { id: "caster", name: "术师" },
  { id: "medic", name: "医疗" },
  { id: "support", name: "辅助" },
  { id: "special", name: "特种" },
];
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
    <AkProfession v-for="p in professions" :key="p.id" :src="asset(`profession/${p.id}.png`)" :name="p.name" size="lg" />
  </div>
</template>
