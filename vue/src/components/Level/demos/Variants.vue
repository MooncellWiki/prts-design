<script setup lang="ts">
import AkLevel from "../AkLevel.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
    <AkLevel :value="90" />
    <AkLevel :value="90" variant="badge" />
    <AkLevel :value="1" variant="badge" />
  </div>
</template>
