<script setup lang="ts">
/** 材料表里横跨两列的分段说明（「达到精英阶段 1 后解锁」），只能直接放在 AkMaterials 里 */
defineSlots<{
  /** 说明文字 */
  default?: () => unknown;
}>();
</script>

<template>
  <span class="ak-materials__divider"><slot /></span>
</template>
