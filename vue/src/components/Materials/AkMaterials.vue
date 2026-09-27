<script setup lang="ts">
/**
 * 材料表（= Naive 的 NDescriptions 那种「标签 → 内容」两列）：左列阶段 / 等级，右列这一步要的材料。
 * 里面放 AkMaterialsRow（一行）与 AkMaterialsDivider（横跨两列的分段说明）。
 */
defineSlots<{
  /** 若干 AkMaterialsRow / AkMaterialsDivider */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="ak-materials"><slot /></div>
</template>
