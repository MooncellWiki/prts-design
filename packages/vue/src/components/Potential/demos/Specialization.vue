<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkSpecialization from "../AkSpecialization.vue";

const values = [1, 2, 3] as const;
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
    <AkSpecialization v-for="n in values" :key="n" :src="asset(`specialized/specialized_${n}.png`)" :value="n" />
    <AkSpecialization v-for="n in values" :key="`b${n}`" :src="asset(`specialized/specialized_${n}.png`)" :value="n" bare />
  </div>
</template>
