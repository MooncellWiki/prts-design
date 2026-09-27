<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 图标地址：specialized/specialized_N.png */
    src: string;
    /** 专精 1–3：给出默认 alt「专精 N」 */
    value?: 1 | 2 | 3;
    /** 可访问名（图标的 alt）：默认「专精 N」；旁边已有同样的文字时写 "" 当装饰 */
    label?: string;
    /** 去掉深色底座 */
    bare?: boolean;
  }>(),
  { value: undefined, label: undefined },
);

const alt = computed(() => props.label ?? (props.value ? `专精 ${props.value}` : ""));
</script>

<template>
  <span :class="['ak-spec', { 'ak-spec--bare': bare }]"><img :src="src" :alt="alt" /></span>
</template>
