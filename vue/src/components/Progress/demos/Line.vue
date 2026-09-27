<script setup lang="ts">
import AkProgress from "../AkProgress.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkProgress label="信赖 TRUST" :percentage="100">200 / 200</AkProgress>
    <AkProgress label="理智 SANITY" variant="yellow" :percentage="62">84 / 135</AkProgress>
    <AkProgress label="本周剿灭 · 合成玉" variant="success" :percentage="67">1200 / 1800</AkProgress>
    <AkProgress label="素材缺口" variant="danger" :percentage="18" />
  </div>
</template>
