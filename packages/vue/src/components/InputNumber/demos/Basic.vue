<script setup lang="ts">
import { ref } from "vue";

import AkField from "../../Field/AkField.vue";
import AkInputNumber from "../AkInputNumber.vue";

const level = ref(90);
const trust = ref(100);
const potential = ref(1);
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6">
    <AkField label="等级" feedback="精英二 1–90">
      <AkInputNumber v-model="level" :min="1" :max="90" />
    </AkField>
    <AkField label="信赖（%）" feedback="每步 10">
      <AkInputNumber v-model="trust" :min="0" :max="200" :step="10" />
    </AkField>
    <AkField label="潜能">
      <AkInputNumber v-model="potential" :min="1" :max="6" />
    </AkField>
  </div>
</template>
