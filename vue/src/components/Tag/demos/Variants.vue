<script setup lang="ts">
import AkTag from "../AkTag.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
    <AkTag>默认</AkTag>
    <AkTag variant="outline">描边</AkTag>
    <AkTag variant="accent">强调</AkTag>
    <AkTag variant="accent-soft">浅强调</AkTag>
    <AkTag variant="yellow">黄</AkTag>
    <AkTag variant="info">信息</AkTag>
    <AkTag variant="success">成功</AkTag>
    <AkTag variant="warning">警告</AkTag>
    <AkTag variant="danger">危险</AkTag>
    <AkTag variant="danger-solid">BREAKING</AkTag>
    <AkTag variant="inverse">反转</AkTag>
    <AkTag variant="new">NEW</AkTag>
  </div>
</template>
