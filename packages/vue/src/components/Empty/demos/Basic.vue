<script setup lang="ts">
import AkButton from "../../Button/AkButton.vue";
import AkEmpty from "../AkEmpty.vue";
</script>

<template>
  <div class="ak-grid ak-grid-2 ak-gap-4">
    <AkEmpty description="尝试更换筛选条件" />
    <AkEmpty title="没有符合条件的干员" icon="search">
      「近卫 · 六星 · 可公招」没有结果。
      <template #extra>
        <AkButton size="sm" variant="outline">清除筛选</AkButton>
        <AkButton size="sm" variant="ghost" href="#">干员一览</AkButton>
      </template>
    </AkEmpty>
  </div>
</template>
