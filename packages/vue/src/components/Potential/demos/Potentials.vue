<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkPotential from "../AkPotential.vue";

const values = [1, 2, 3, 4, 5, 6] as const;
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
      <AkPotential v-for="n in values" :key="n" :src="asset(`potential/potential_${n - 1}.png`)" :value="n" />
    </div>
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
      <AkPotential v-for="n in values" :key="n" :src="asset(`potential/potential_${n - 1}.png`)" :value="n" bare />
    </div>
  </div>
</template>
