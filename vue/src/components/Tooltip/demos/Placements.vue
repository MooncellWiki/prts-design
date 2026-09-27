<script setup lang="ts">
import AkButton from "../../Button/AkButton.vue";
import AkTooltip from "../AkTooltip.vue";

// 这里用 v-model 让四个提示常显，只为看方向；平时不绑定，悬停 / 聚焦时才出现
</script>

<template>
  <div class="ak-flex ak-wrap ak-justify-center ak-items-center ak-gap-8 ak-p-6">
    <AkTooltip placement="left" trigger="manual" :model-value="true">
      <template #trigger><AkButton size="sm">left</AkButton></template>
      左侧
    </AkTooltip>
    <AkTooltip trigger="manual" :model-value="true">
      <template #trigger><AkButton size="sm">top</AkButton></template>
      上方（默认）
    </AkTooltip>
    <AkTooltip placement="bottom" trigger="manual" :model-value="true">
      <template #trigger><AkButton size="sm">bottom</AkButton></template>
      下方
    </AkTooltip>
    <AkTooltip placement="right" trigger="manual" :model-value="true">
      <template #trigger><AkButton size="sm">right</AkButton></template>
      右侧
    </AkTooltip>
  </div>
</template>
