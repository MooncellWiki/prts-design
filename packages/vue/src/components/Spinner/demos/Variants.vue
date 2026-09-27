<script setup lang="ts">
import AkSpinner from "../AkSpinner.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-8 ak-items-center">
    <AkSpinner />
    <AkSpinner color="var(--ak-yellow-500)" label="正在同步" />
    <AkSpinner variant="bars" />
    <AkSpinner description="正在读取干员数据…" />
    <AkSpinner variant="bars" description="连接神经网络" />
  </div>
</template>
