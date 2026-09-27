<script setup lang="ts">
import AkButton from "../AkButton.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
    <AkButton size="xs">XS</AkButton>
    <AkButton size="sm">SM</AkButton>
    <AkButton>MD</AkButton>
    <AkButton size="lg">LG</AkButton>
    <AkButton size="xl" variant="primary">XL 主动作</AkButton>
  </div>
</template>
