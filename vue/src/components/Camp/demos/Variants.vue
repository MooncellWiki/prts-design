<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkCamp from "../AkCamp.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
    <AkCamp :src="asset('camp/victoria.png')" name="维多利亚" variant="box" />
    <AkCamp :src="asset('camp/kazimierz.png')" name="卡西米尔" variant="box" />
    <AkCamp :src="asset('camp/ursus.png')" name="乌萨斯" size="lg" logo-only />
    <AkCamp :src="asset('camp/lungmen.png')" name="龙门" size="lg" logo-only />
    <AkCamp :src="asset('camp/iberia.png')" name="伊比利亚" size="lg" variant="box" logo-only />
  </div>
</template>
