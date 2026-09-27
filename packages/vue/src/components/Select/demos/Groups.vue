<script setup lang="ts">
import { ref } from "vue";

import AkSelect from "../AkSelect.vue";

const support = [
  {
    type: "group" as const,
    label: "近卫",
    children: [
      { label: "陈", value: "char_010_chen" },
      { label: "银灰", value: "char_172_svrash" },
      { label: "史尔特尔", value: "char_350_surtr" },
    ],
  },
  {
    type: "group" as const,
    label: "术师",
    children: [
      { label: "艾雅法拉", value: "char_180_amgoat" },
      { label: "伊芙利特", value: "char_134_ifrit" },
    ],
  },
  {
    type: "group" as const,
    label: "医疗",
    children: [
      { label: "闪灵", value: "char_147_shining" },
      { label: "夜莺（已在编队）", value: "char_179_cgbird", disabled: true },
    ],
  },
];

const pick = ref<string | null>(null);
</script>

<template>
  <AkSelect v-model="pick" :options="support" placeholder="选择助战干员" label="助战干员" class="ak-max-narrow" />
</template>
