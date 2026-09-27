<script setup lang="ts">
import { reactive } from "vue";

import AkChip from "../AkChip.vue";

const profession = reactive({ guard: true, sniper: false, caster: false });
const rarity = reactive({ six: true, five: false });
const recruit = reactive({ yes: false, favorite: false });
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center" role="group" aria-label="职业">
      <span class="ak-overline">职业</span>
      <AkChip v-model="profession.guard">近卫</AkChip>
      <AkChip v-model="profession.sniper">狙击</AkChip>
      <AkChip v-model="profession.caster">术师</AkChip>
    </div>
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center" role="group" aria-label="稀有度">
      <span class="ak-overline">稀有度</span>
      <AkChip v-model="rarity.six">六星</AkChip>
      <AkChip v-model="rarity.five">五星</AkChip>
    </div>
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center" role="group" aria-label="其他">
      <span class="ak-overline">其他</span>
      <AkChip v-model="recruit.yes">可公招</AkChip>
      <AkChip v-model="recruit.favorite" icon="star">已收藏</AkChip>
    </div>
  </div>
</template>
