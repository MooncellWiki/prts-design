<script setup lang="ts">
import AkRarity from "../AkRarity.vue";
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-2">
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkRarity :value="6" size="sm" />
      <AkRarity :value="6" />
      <AkRarity :value="6" size="lg" />
    </div>
    <!-- 星形跟字号走：放进标题 / 正文里就是那一行的大小 -->
    <p class="ak-mb-0">陈 <AkRarity :value="6" variant="tier" size="sm" /> 近卫 · 剑豪</p>
  </div>
</template>
