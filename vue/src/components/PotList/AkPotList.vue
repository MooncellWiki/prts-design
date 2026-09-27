<script setup lang="ts">
import { provide } from "vue";

import { potListKey } from "./context";

/** 潜能提升一览（同现网 {{潜能提升}} 的五格表）：潜能 2–6 各一格 AkPot，自动折行 */
const props = defineProps<{
  /** 当前潜能 1–6：潜能等级不超过它的格子点亮（顶部青条 + 青色小标）；不写都不亮 */
  value?: number;
}>();

defineSlots<{
  /** 若干 AkPot */
  default?: () => unknown;
}>();

provide(potListKey, props);
</script>

<template>
  <div class="ak-pot-list" role="list"><slot /></div>
</template>
