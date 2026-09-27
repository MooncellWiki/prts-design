<script setup lang="ts">
import AkProgress from "../AkProgress.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
    <AkProgress circle :percentage="75" label="图鉴收集" />
    <AkProgress circle variant="yellow" :percentage="30" label="信赖" />
    <AkProgress circle variant="success" :percentage="100" label="主线完成度" />
    <AkProgress circle variant="danger" :percentage="12" label="剩余理智">12</AkProgress>
  </div>
</template>
