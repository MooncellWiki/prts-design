<script setup lang="ts">
import { provide } from "vue";

import { itemListKey, type ItemSize } from "./context";

/** 一排道具：换行、间距 6 / 8 */
const props = defineProps<{
  /** 里面道具的默认尺寸（道具自己写了 size 以道具为准，同 AkButtonGroup） */
  size?: ItemSize;
}>();

defineSlots<{
  /** 若干 AkItem */
  default?: () => unknown;
}>();

provide(itemListKey, props);
</script>

<template>
  <div class="ak-item-list"><slot /></div>
</template>
