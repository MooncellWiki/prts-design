<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkTag from "../../Tag/AkTag.vue";
import AkOpCard from "../AkOpCard.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-start">
    <!-- rail：头像底之外另加一条稀有度色左边条 -->
    <AkOpCard
      variant="rail"
      name="煌"
      sub="Blaze · 强攻手"
      :avatar="asset('avatar/char_017_huang_2.png')"
      :rarity="6"
      :rarity-icon="asset('rarity/rarity_yellow_5.png')"
      profession="近卫"
      :profession-icon="asset('profession/warrior.png')"
      href="#"
    />
    <!-- 不传星级原图：画 CSS 星形；不传职业 / 精英图标就不显示 -->
    <AkOpCard name="年" sub="Nian · 铁卫" :avatar="asset('avatar/char_2014_nian_2.png')" :rarity="6" href="#" />
    <!-- 异格一览：sm + current（青色描边、aria-current） -->
    <div class="ak-flex ak-gap-2">
      <AkOpCard
        current
        size="sm"
        name="陈"
        title="陈（原型）"
        :avatar="asset('avatar/char_010_chen_2.png')"
        :rarity="6"
        :rarity-icon="asset('rarity/rarity_yellow_5.png')"
        profession="近卫"
        :profession-icon="asset('profession/icon_warrior.png')"
        href="#"
      />
      <AkOpCard
        size="sm"
        name="假日威龙陈"
        title="假日威龙陈"
        :avatar="asset('avatar/char_1013_chen2_2.png')"
        :rarity="6"
        :rarity-icon="asset('rarity/rarity_yellow_5.png')"
        profession="狙击"
        :profession-icon="asset('profession/icon_sniper.png')"
        href="#"
      />
    </div>
    <!-- #badge：右上角角标（首页凭证兑换的「兑」） -->
    <AkOpCard
      size="sm"
      name="逻各斯"
      sub="黄票兑换"
      :avatar="asset('mainpage/avatar/logos.png')"
      :rarity="5"
      :rarity-icon="asset('rarity/rarity_yellow_4.png')"
      profession="术师"
      :profession-icon="asset('profession/icon_caster.png')"
      href="#"
    >
      <template #badge><AkTag variant="yellow" size="sm">兑</AkTag></template>
    </AkOpCard>
  </div>
</template>
