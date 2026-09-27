<script setup lang="ts">
import { ref } from "vue";

import AkField from "../../Field/AkField.vue";
import AkCheckbox from "../AkCheckbox.vue";
import AkCheckboxGroup from "../AkCheckboxGroup.vue";

/** 公开招募：一次刷出 5 个标签，最多选 3 个 */
const tags = ["资深干员", "近战位", "输出", "防护", "削弱"];
const picked = ref(["近战位"]);
</script>

<template>
  <AkField label="公开招募标签" :feedback="`已选 ${picked.length} / 3`">
    <AkCheckboxGroup v-model="picked" :max="3">
      <AkCheckbox v-for="t in tags" :key="t" :value="t">{{ t }}</AkCheckbox>
    </AkCheckboxGroup>
  </AkField>
</template>
