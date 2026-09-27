<script setup lang="ts">
import AkProgress from "../AkProgress.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <!-- 没有 label 时写 aria-label 给读屏 -->
    <AkProgress size="sm" :percentage="30" aria-label="sm" />
    <AkProgress :percentage="50" aria-label="md" />
    <AkProgress size="lg" stripes :percentage="40" aria-label="上传文件" />
    <AkProgress label="正在同步 Cargo 表" indeterminate :show-indicator="false" />
    <AkProgress label="关卡星级" :steps="3" :percentage="67">2 / 3</AkProgress>
  </div>
</template>
