<script setup lang="ts">
import { ref } from "vue";

import AkSwitch from "../AkSwitch.vue";

const potential = ref(false);
const calc = ref(true);
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkSwitch v-model="potential">
      潜能加成
      <template #checked>按满潜能计算</template>
      <template #unchecked>按 1 潜能计算</template>
    </AkSwitch>
    <AkSwitch v-model="calc" label="算法标记">
      <template #checked>显示加算 / 乘算标记</template>
      <template #unchecked>不显示</template>
    </AkSwitch>
  </div>
</template>
