<script setup lang="ts">
import { computed, ref } from "vue";

import AkCheckbox from "../AkCheckbox.vue";
import AkCheckboxGroup from "../AkCheckboxGroup.vue";

const professions = ["先锋", "近卫", "重装", "狙击", "术师", "医疗", "辅助", "特种"];
const shown = ref(["近卫", "狙击", "术师"]);

const all = computed({
  get: () => shown.value.length === professions.length,
  set: v => (shown.value = v ? [...professions] : []),
});
const some = computed(() => shown.value.length > 0 && !all.value);
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkCheckbox v-model="all" :indeterminate="some">全部职业</AkCheckbox>
    <AkCheckboxGroup v-model="shown" label="职业">
      <AkCheckbox v-for="p in professions" :key="p" :value="p">{{ p }}</AkCheckbox>
    </AkCheckboxGroup>
  </div>
</template>
