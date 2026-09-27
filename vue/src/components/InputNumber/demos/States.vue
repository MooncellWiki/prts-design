<script setup lang="ts">
import { ref } from "vue";

import AkInputNumber from "../AkInputNumber.vue";

const need = ref<number | null>(null);
const sanity = ref(135);
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6 ak-items-center">
    <AkInputNumber v-model="need" :min="0" placeholder="不限" label="需求数量" />
    <AkInputNumber v-model="sanity" :min="0" :max="135" :show-button="false" label="理智" />
    <AkInputNumber :model-value="3212" readonly label="库存（只读）" />
    <AkInputNumber :model-value="12" disabled label="数量（禁用）" />
  </div>
</template>
