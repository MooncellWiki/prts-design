<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 等级 */
    value: number;
    /** 外观：default 纯读数 · badge 主题灰块（24px 高，与阶段选择器 / 开关 / 信赖同一条线；是读数不是按钮，不反白） */
    variant?: "default" | "badge";
  }>(),
  { variant: "default" },
);
</script>

<template>
  <span :class="['ak-level', variant === 'badge' && 'ak-level--badge']">
    <span class="ak-level__lv">LV</span><span class="ak-level__n">{{ value }}</span>
  </span>
</template>
