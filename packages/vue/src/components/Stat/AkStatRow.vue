<script setup lang="ts">
/** 一排统计卡片：自动铺满（每格至少 120px，放不下就换行），间距 12 */
defineSlots<{
  /** 若干 AkStat */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="ak-stat-row"><slot /></div>
</template>
