<script setup lang="ts">
import AkTrust from "../AkTrust.vue";
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkTrust :value="0" />
      <AkTrust :value="50" />
      <AkTrust :value="100" />
      <AkTrust :value="200" />
    </div>
    <!-- 模组 / 档案的解锁条件 -->
    <p class="ak-mb-0">解锁需求：<AkTrust :value="50" /></p>
  </div>
</template>
