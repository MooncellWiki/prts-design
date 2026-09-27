<script setup lang="ts">
import { computed } from "vue";

import { isWideTip } from "../RichText/parse";
import { SP_VALUE_CLASS, SP_VALUE_NAME, SP_VALUE_TIP, type SpValueKind } from "./sp";

const props = withDefaults(
  defineProps<{
    /** 哪一枚芯片：cost 消耗（荧光绿闪电）· init 初始（▶）· duration 持续（⏱） */
    kind: SpValueKind;
    /** 数值；也可以写在默认插槽里（表头图例写「消耗」「初始」这种字） */
    value?: number | string;
    /** 悬停提示（data-ak-tip）：默认是这一项的说明（「消耗：该技能所需要消耗的技力数」），可改写；false 关掉 */
    tip?: string | false;
  }>(),
  { value: undefined, tip: undefined },
);

defineSlots<{
  /** 芯片里的字（代替 value） */
  default?: () => unknown;
}>();

/*
 * 图形是 CSS mask，读屏只念得出数字：写 value 时在数字前补一个看不见的名字（.ak-sr-only「消耗」）。
 * 提示长（一句话）时用可折行的宽气泡 .ak-tip--wide。
 */
const tipText = computed(() => (props.tip === false ? undefined : (props.tip ?? SP_VALUE_TIP[props.kind])));
</script>

<template>
  <span :class="[SP_VALUE_CLASS[kind], isWideTip(tipText) && 'ak-tip--wide']" :data-ak-tip="tipText">
    <slot><span class="ak-sr-only">{{ SP_VALUE_NAME[kind] }}</span>{{ value }}</slot>
  </span>
</template>
