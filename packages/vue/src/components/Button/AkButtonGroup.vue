<script setup lang="ts">
import { provide } from "vue";

import { buttonGroupKey, type ButtonSize } from "./context";

/** 一排贴在一起的按钮（同 Naive 的 NButtonGroup，纯容器）；多选一的分段控件用单选组，不用它 */
const props = defineProps<{
  /** 组内按钮的默认尺寸（按钮自己写了 size 以按钮为准） */
  size?: ButtonSize;
  /** 读屏用的组名：一组有意义的动作时写 */
  label?: string;
}>();

defineSlots<{
  /** 若干 AkButton */
  default?: () => unknown;
}>();

provide(buttonGroupKey, props);
</script>

<template>
  <div class="ak-btn-group" role="group" :aria-label="label"><slot /></div>
</template>
