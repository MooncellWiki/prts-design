<script setup lang="ts">
import AkRarity, { type Rarity } from "../AkRarity.vue";

const stars: Rarity[] = [6, 5, 4, 3, 2, 1];
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-2">
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkRarity v-for="n in stars" :key="n" :value="n" />
    </div>
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkRarity v-for="n in stars" :key="n" :value="n" variant="white" />
    </div>
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkRarity v-for="n in stars" :key="n" :value="n" variant="tier" />
    </div>
  </div>
</template>
