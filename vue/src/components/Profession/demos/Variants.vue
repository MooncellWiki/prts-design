<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkProfession from "../AkProfession.vue";

const src = asset("profession/warrior.png");
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
      <AkProfession :src="src" name="近卫" size="sm" />
      <AkProfession :src="src" name="近卫" />
      <AkProfession :src="src" name="近卫" size="lg" />
      <AkProfession :src="src" name="近卫" size="xl" />
    </div>
    <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
      <AkProfession :src="src" name="近卫" size="lg" variant="box" />
      <AkProfession :src="src" name="近卫" size="lg" variant="outline" />
      <AkProfession :src="src" name="近卫" variant="box" />
      <AkProfession :src="src" name="近卫" variant="outline" />
    </div>
  </div>
</template>
