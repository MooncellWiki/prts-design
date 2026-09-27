<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkElite from "../AkElite.vue";

const icon = (n: number) => asset(`elite/elite_${n}.png`);
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkElite :src="icon(0)" :phase="0" />
      <AkElite :src="icon(1)" :phase="1" />
      <AkElite :src="icon(2)" :phase="2" />
      <AkElite :src="icon(2)" :phase="2" :level="60" />
    </div>
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <!-- 大图标、只放图标：阶段名作 alt -->
      <AkElite :src="asset('elite/elite_0_large.png')" :phase="0" :text="false" size="lg" />
      <AkElite :src="asset('elite/elite_1_large.png')" :phase="1" :text="false" size="lg" />
      <AkElite :src="asset('elite/elite_2_large.png')" :phase="2" :text="false" size="lg" />
    </div>
  </div>
</template>
