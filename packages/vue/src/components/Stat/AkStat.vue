<script setup lang="ts">
/** 统计数字（同 Naive 的 NStatistic）：小号大写的名称 + 大号等宽数字 + 可选的变化量；一排放进 AkStatRow */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 名称（小号大写 overline：Operators / Edits / 24h）；要带格式时用 #label 插槽 */
    label?: string;
    /** 数值，原样显示（千分位等格式由调用方先排好：「1,204」）；也可以写在默认插槽里 */
    value?: string | number;
    /** 变化量（「+4 本月」「-12%」），显示在数值下面 */
    delta?: string;
    /** 变化方向（颜色取游戏富文本的升 / 降色）；不写时按 delta 开头的 + / - 判断 */
    trend?: "up" | "down";
    /** 行内：一行「名称 数值」，不要卡片框（放进正文 / 表格里） */
    inline?: boolean;
  }>(),
  { label: undefined, value: undefined, delta: undefined, trend: undefined },
);

defineSlots<{
  /** 数值（代替 value） */
  default?: () => unknown;
  /** 名称（代替 label） */
  label?: () => unknown;
  /** 数值前面的内容（货币符号、图标） */
  prefix?: () => unknown;
  /** 数值后面的小字单位（渲染成 <small>：2.3<small>k</small>） */
  suffix?: () => unknown;
}>();

const direction = computed(() => props.trend ?? (/^\+/.test(props.delta ?? "") ? "up" : /^[-−]/.test(props.delta ?? "") ? "down" : undefined));
</script>

<template>
  <div :class="['ak-stat', inline && 'ak-stat--inline']">
    <span v-if="label || $slots.label" class="ak-stat__label"><slot name="label">{{ label }}</slot></span>
    <span class="ak-stat__value">
      <slot name="prefix" /><slot>{{ value }}</slot><small v-if="$slots.suffix"><slot name="suffix" /></small>
    </span>
    <span v-if="delta" :class="['ak-stat__delta', direction && `ak-stat__delta--${direction}`]">{{ delta }}</span>
  </div>
</template>
