<script setup lang="ts">
import AkButton from "../AkButton.vue";
import AkButtonGroup from "../AkButtonGroup.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
    <AkButtonGroup label="页面操作">
      <AkButton icon="edit">编辑</AkButton>
      <AkButton icon="history">历史</AkButton>
      <AkButton icon="star" label="监视" />
    </AkButtonGroup>
    <AkButtonGroup label="导出" size="sm">
      <AkButton>JSON</AkButton>
      <AkButton>CSV</AkButton>
      <AkButton icon="print" label="打印" />
    </AkButtonGroup>
  </div>
</template>
