<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkOpCard from "../AkOpCard.vue";

const chen = {
  name: "陈",
  avatar: asset("avatar/char_010_chen_2.png"),
  rarity: 6,
  rarityIcon: asset("rarity/rarity_yellow_5.png"),
  profession: "近卫",
  elite: 2,
  eliteIcon: asset("elite/elite_2.png"),
} as const;
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-4">
    <div class="ak-flex ak-wrap ak-gap-3 ak-items-end">
      <AkOpCard v-bind="chen" size="sm" :profession-icon="asset('profession/icon_warrior.png')" href="#" />
      <AkOpCard v-bind="chen" sub="Ch'en · LM04" :profession-icon="asset('profession/warrior.png')" href="#" />
      <AkOpCard v-bind="chen" sub="Ch'en · LM04" size="lg" :profession-icon="asset('profession/warrior.png')" href="#" />
    </div>
    <!-- 首页「亮点干员」：sm + 头像同款小职业图标，小字写生日 / 获得方式 -->
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-start">
      <AkOpCard
        name="海沫"
        sub="8 · 23"
        :avatar="asset('mainpage/avatar/haimo.png')"
        :rarity="4"
        :rarity-icon="asset('rarity/rarity_yellow_3.png')"
        profession="近卫"
        :profession-icon="asset('profession/icon_warrior.png')"
        size="sm"
        href="#"
      />
      <AkOpCard
        name="珊比"
        sub="重装 · 五星"
        :avatar="asset('mainpage/avatar/shanbi.png')"
        :rarity="5"
        :rarity-icon="asset('rarity/rarity_yellow_4.png')"
        profession="重装"
        :profession-icon="asset('profession/icon_tank.png')"
        size="sm"
        href="#"
      />
      <AkOpCard
        name="予愿安洁莉娜"
        sub="特种 · 五星"
        :avatar="asset('mainpage/avatar/angelina-wish.png')"
        :rarity="5"
        :rarity-icon="asset('rarity/rarity_yellow_4.png')"
        profession="特种"
        :profession-icon="asset('profession/icon_special.png')"
        size="sm"
        href="#"
      />
    </div>
  </div>
</template>
