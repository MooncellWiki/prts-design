<script setup lang="ts">
import { ref } from "vue";

import AkInput from "../../Input/AkInput.vue";
import AkSelect from "../../Select/AkSelect.vue";
import AkField from "../AkField.vue";

const name = ref("");
const profession = ref("WARRIOR");
const note = ref("");
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
</script>

<template>
  <div class="ak-max-narrow">
    <AkField label="干员名称" required feedback="支持中文名 / 代号 / 拼音">
      <AkInput v-model="name" placeholder="例如：陈" />
    </AkField>
    <AkField label="职业">
      <AkSelect v-model="profession" :options="professions" />
    </AkField>
    <AkField label="备注">
      <AkInput v-model="note" type="textarea" placeholder="…" />
    </AkField>
  </div>
</template>
