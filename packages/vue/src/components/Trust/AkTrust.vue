<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 信赖（%）：0–200 */
    value: number;
    /** 读屏前缀：信赖图标是 ::before 伪元素、读屏读不到，默认补一段隐藏的「信赖」 */
    label?: string;
  }>(),
  { label: "信赖" },
);
</script>

<template>
  <span class="ak-trust"><span v-if="label" class="ak-sr-only">{{ label }}</span>{{ value }}%</span>
</template>
