<script setup lang="ts">
/**
 * 只有页签、没有面板（= Naive 的 NTab）：一排页签当筛选 / 切换外部内容时用，只能直接放在 AkTabs 里。
 * AkTabs 读它的 name / tab / disabled / 默认插槽自己画页签，这个组件本身不会被挂载。
 */
defineProps<{
  /** 标识，= AkTabs 的 v-model 值 */
  name: string | number;
  /** 页签文字（也可以写在默认插槽里） */
  tab?: string;
  /** 禁用：页签不可选，方向键跳过 */
  disabled?: boolean;
}>();

defineSlots<{
  /** 页签内容（代替 tab） */
  default?: () => unknown;
}>();
</script>

<template>
  <slot>{{ tab }}</slot>
</template>
