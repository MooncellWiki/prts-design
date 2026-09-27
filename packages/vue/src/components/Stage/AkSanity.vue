<script setup lang="ts">
/**
 * 理智消耗：六边形 + 数字（游戏内理智图标的剪影，不用图片）。读屏念「理智 6」——六边形是纯装饰，前缀字藏在 sr-only 里。
 */
defineProps<{
  /** 消耗的理智 */
  value: number | string;
}>();
</script>

<template>
  <span class="ak-sanity"><span class="ak-sr-only">理智 </span>{{ value }}</span>
</template>
