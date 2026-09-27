<script setup lang="ts">
export type CalcKind = "add" | "mul" | "fadd" | "fmul";

defineProps<{
  /** 进公式的方式：add 直接加算（绿 +）· mul 直接乘算（蓝 +）· fadd 最终加算（橙 +）· fmul 最终乘算（橙 ×） */
  kind: CalcKind;
}>();

/* 算法标记：只在 AkTalentTable 打开「算法」开关（.is-calc）时显示，紧贴在数值前；读屏念「直接乘算」，悬停同 */
const TEXT: Record<CalcKind, string> = { add: "直接加算", mul: "直接乘算", fadd: "最终加算", fmul: "最终乘算" };
</script>

<template>
  <i :class="['ak-calc', `ak-calc--${kind}`]" role="img" :aria-label="TEXT[kind]" :title="TEXT[kind]" />
</template>
