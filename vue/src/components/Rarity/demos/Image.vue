<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkRarity from "../AkRarity.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
    <!-- 黄星原图：两套主题都不变 -->
    <AkRarity :value="6" :src="asset('rarity/rarity_yellow_5.png')" />
    <AkRarity :value="5" :src="asset('rarity/rarity_yellow_4.png')" />
    <AkRarity :value="4" :src="asset('rarity/rarity_yellow_3.png')" />
    <!-- 白星原图：亮色主题下反相为黑 -->
    <AkRarity :value="6" :src="asset('rarity/rarity_5.png')" glyph />
    <AkRarity :value="3" :src="asset('rarity/rarity_2.png')" glyph />
  </div>
</template>
