<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkOpRow from "../AkOpRow.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6 ak-items-center">
    <AkOpRow name="煌" :avatar="asset('avatar/char_017_huang_2.png')" :rarity="6" meta="强攻手" stars href="#" />
    <AkOpRow name="伊芙利特" :avatar="asset('avatar/char_134_ifrit_2.png')" :rarity="6" meta="阵法术师" href="#" />
    <AkOpRow name="年" :avatar="asset('avatar/char_2014_nian_2.png')" :rarity="6" meta="铁卫" href="#" />
    <AkOpRow name="德克萨斯" :avatar="asset('avatar/char_102_texas_2.png')" :rarity="5" meta="冲锋手" stars href="#" />
    <AkOpRow name="桃金娘" :avatar="asset('avatar/char_151_myrtle_2.png')" :rarity="4" meta="执旗手" stars href="#" />
  </div>
</template>
