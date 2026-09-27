<script setup lang="ts">
import AkRange from "../AkRange.vue";

const sniper: [number, number][] = [];
for (let r = -1; r <= 1; r++) for (let c = 0; c <= 3; c++) sniper.push([r, c]);
</script>

<template>
  <div class="ak-flex ak-gap-6 ak-items-end">
    <AkRange :grids="sniper" size="sm" />
    <AkRange :grids="sniper" />
    <AkRange :grids="sniper" size="lg" />
  </div>
</template>
