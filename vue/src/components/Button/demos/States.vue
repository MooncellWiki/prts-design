<script setup lang="ts">
import AkButton from "../AkButton.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
    <AkButton disabled>禁用</AkButton>
    <AkButton variant="primary" loading>保存中</AkButton>
    <AkButton href="#">链接形态（&lt;a&gt;）</AkButton>
    <AkButton href="#" disabled>禁用的链接</AkButton>
  </div>
</template>
