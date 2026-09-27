<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkPot from "../AkPot.vue";
import AkPotList from "../AkPotList.vue";

const icon = (n: number) => asset(`potential/potential_${n - 1}.png`);
</script>

<template>
  <!-- 陈的潜能提升（现网 {{潜能提升}}）；属性计算器选了潜能 4：2–4 点亮 -->
  <AkPotList :value="4">
    <AkPot :level="2" :src="icon(2)">部署费用<span class="ak-rt-vup">-1</span></AkPot>
    <AkPot :level="3" :src="icon(3)">再部署时间<span class="ak-rt-vup">-4秒</span></AkPot>
    <AkPot :level="4" :src="icon(4)">攻击力<span class="ak-rt-vup">+23</span></AkPot>
    <AkPot :level="5" :src="icon(5)">第二天赋效果增强</AkPot>
    <AkPot :level="6" :src="icon(6)">部署费用<span class="ak-rt-vup">-1</span></AkPot>
  </AkPotList>
</template>
