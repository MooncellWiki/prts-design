<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 图标地址：potential/potential_{N−1}.png（游戏图标自带颜色，不随主题反相） */
    src: string;
    /** 潜能 1–6：给出默认 alt「潜能 N」 */
    value?: 1 | 2 | 3 | 4 | 5 | 6;
    /** 可访问名（图标的 alt）：默认「潜能 N」；旁边已有同样的文字时写 "" 当装饰 */
    label?: string;
    /** 去掉深色底座（放进已有深底 / 表头开关这类行内位置） */
    bare?: boolean;
  }>(),
  { value: undefined, label: undefined },
);

const alt = computed(() => props.label ?? (props.value ? `潜能 ${props.value}` : ""));
</script>

<template>
  <span :class="['ak-potential', { 'ak-potential--bare': bare }]"><img :src="src" :alt="alt" /></span>
</template>
