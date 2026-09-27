<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkProfession from "../AkProfession.vue";
import AkProfessionLabel from "../AkProfessionLabel.vue";

const branches = [
  { id: "lord", name: "领主" },
  { id: "centurion", name: "强攻手" },
  { id: "charger", name: "冲锋手" },
  { id: "corecaster", name: "中坚术师" },
  { id: "physician", name: "医师" },
];
</script>

<template>
  <div class="ak-flex ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkProfessionLabel :src="asset('subprofession/sword.png')" name="剑豪" en="Swordmaster" href="#" />
      <AkProfessionLabel v-for="b in branches" :key="b.id" :src="asset(`subprofession/${b.id}.png`)" :name="b.name" />
    </div>
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <!-- 职业名：图标换成职业图标 -->
      <AkProfessionLabel name="近卫" en="Guard">
        <template #icon><AkProfession :src="asset('profession/warrior.png')" size="sm" :tip="false" /></template>
      </AkProfessionLabel>
      <!-- 只要分支图标（表格里一列） -->
      <AkProfession :src="asset('subprofession/sword.png')" name="剑豪" branch />
      <AkProfession :src="asset('subprofession/musha.png')" name="武者" branch />
    </div>
  </div>
</template>
