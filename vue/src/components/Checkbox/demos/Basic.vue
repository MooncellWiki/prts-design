<script setup lang="ts">
import { ref } from "vue";

import AkCheckbox from "../AkCheckbox.vue";

const recruitable = ref(true);
const limited = ref(false);
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
    <AkCheckbox v-model="recruitable">可公招</AkCheckbox>
    <AkCheckbox v-model="limited">限定</AkCheckbox>
    <AkCheckbox :model-value="true" disabled>已精二（禁用）</AkCheckbox>
    <AkCheckbox disabled>未实装（禁用）</AkCheckbox>
    <AkCheckbox size="sm" :model-value="true">sm · 16px</AkCheckbox>
  </div>
</template>
