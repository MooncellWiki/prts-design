<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkAvatar from "../AkAvatar.vue";
import AkAvatarGroup from "../AkAvatarGroup.vue";

/** 第一小队（12 人），画 3 枚、其余收成 +9 */
const squad = [
  { src: asset("avatar/char_102_texas_2.png"), alt: "德克萨斯" },
  { src: asset("avatar/char_112_siege_2.png"), alt: "推进之王" },
  { src: asset("avatar/char_148_nearl_2.png"), alt: "临光" },
  { src: asset("avatar/char_010_chen_2.png"), alt: "陈" },
  { src: asset("avatar/char_172_svrash_2.png"), alt: "银灰" },
  { src: asset("avatar/char_103_angel_2.png"), alt: "能天使" },
  { src: asset("avatar/char_2014_nian_2.png"), alt: "年" },
  { src: asset("avatar/char_2025_shu_2.png"), alt: "黍" },
  { src: asset("avatar/char_147_shining_2.png"), alt: "闪灵" },
  { src: asset("avatar/char_134_ifrit_2.png"), alt: "伊芙利特" },
  { src: asset("avatar/char_180_amgoat_2.png"), alt: "艾雅法拉" },
  { src: asset("avatar/char_017_huang_2.png"), alt: "煌" },
];
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6 ak-items-center">
    <AkAvatarGroup :options="squad" :max="3" size="sm" label="第一小队" />
    <AkAvatarGroup :options="squad.slice(0, 5)" label="助战干员" />
    <AkAvatarGroup size="lg">
      <AkAvatar :src="asset('avatar/char_002_amiya_1p.png')" alt="阿米娅" />
      <AkAvatar :src="asset('avatar/char_003_kalts_2.png')" alt="凯尔希" />
      <AkAvatar>DR</AkAvatar>
    </AkAvatarGroup>
  </div>
</template>
