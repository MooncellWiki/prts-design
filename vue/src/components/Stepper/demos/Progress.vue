<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkStep from "../AkStep.vue";
import AkSteps from "../AkSteps.vue";

const steps = ["技能等级 7", "专精一", "专精二", "专精三"];
const current = ref(2);
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <AkSteps :current="current" label="技能专精进度">
      <AkStep v-for="s in steps" :key="s">{{ s }}</AkStep>
    </AkSteps>
    <div class="ak-flex ak-gap-2 ak-items-center">
      <AkButton size="sm" :disabled="current <= 1" @click="current--">上一步</AkButton>
      <AkButton size="sm" variant="primary" :disabled="current > steps.length" @click="current++">下一步</AkButton>
      <span class="ak-fs-sm ak-fg-muted">current = {{ current }}</span>
    </div>
  </div>
</template>
