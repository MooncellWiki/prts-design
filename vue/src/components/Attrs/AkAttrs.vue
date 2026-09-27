<script setup lang="ts">
/** 属性表：若干 AkAttr 排成等宽网格（每格最窄 140px，放不下换行），格间 1px 缝线 */
defineProps<{
  /** 紧凑：名 / 值左右排开、数值缩到正文字号（档案里的综合体检、侧栏读数） */
  compact?: boolean;
}>();

defineSlots<{
  /** 若干 AkAttr */
  default?: () => unknown;
}>();
</script>

<template>
  <div :class="['ak-attrs', { 'ak-attrs--compact': compact }]"><slot /></div>
</template>
