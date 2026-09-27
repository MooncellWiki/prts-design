<script setup lang="ts">
import { ref } from "vue";

import AkSwitch from "../AkSwitch.vue";

const potential = ref(true);
const trust = ref(false);
const demoWeek = ref(false);
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6 ak-items-center">
    <AkSwitch v-model="potential">显示潜能加成</AkSwitch>
    <AkSwitch v-model="trust">信赖满</AkSwitch>
    <AkSwitch v-model="demoWeek" size="sm">演示：特别开放周</AkSwitch>
    <AkSwitch :model-value="true" disabled>已开启（禁用）</AkSwitch>
    <AkSwitch disabled>已关闭（禁用）</AkSwitch>
  </div>
</template>
