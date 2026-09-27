<script setup lang="ts">
import { provide } from "vue";

import { buttonGroupKey } from "../Button/context";
import { inputGroupKey, type InputSize } from "./context";

/** 把输入框和按钮拼成一条（同 Naive 的 NInputGroup）：相邻边重叠、中间不留圆角。前后缀文字用 AkInput 的 #prefix / #suffix */
const props = defineProps<{
  /** 组内输入框与按钮的默认尺寸（各自写了 size 以各自为准） */
  size?: InputSize;
}>();

defineSlots<{
  /** AkInput（可带 #prefix / #suffix）与 AkButton */
  default?: () => unknown;
}>();

provide(inputGroupKey, props);
provide(buttonGroupKey, props);
</script>

<template>
  <div class="ak-input-group"><slot /></div>
</template>
