<script setup lang="ts">
import { asset } from "../../../demo/asset";
import type { Rarity } from "../../Rarity/AkRarity.vue";
import AkOpCard from "../AkOpCard.vue";
import AkOpGrid from "../AkOpGrid.vue";

const PROF = { warrior: "近卫", medic: "医疗", sniper: "狙击", pioneer: "先锋", caster: "术师" } as const;

const ops: { id: string; name: string; sub: string; rarity: Rarity; prof: keyof typeof PROF; elite: 0 | 1 | 2 }[] = [
  { id: "char_010_chen_2", name: "陈", sub: "Ch'en · LM04", rarity: 6, prof: "warrior", elite: 2 },
  { id: "char_172_svrash_2", name: "银灰", sub: "SilverAsh · KJ01", rarity: 6, prof: "warrior", elite: 2 },
  { id: "char_003_kalts_2", name: "凯尔希", sub: "Kal'tsit · R001", rarity: 6, prof: "medic", elite: 2 },
  { id: "char_103_angel_2", name: "能天使", sub: "Exusiai · PL02", rarity: 6, prof: "sniper", elite: 2 },
  { id: "char_102_texas_2", name: "德克萨斯", sub: "Texas · PL03", rarity: 5, prof: "pioneer", elite: 2 },
  { id: "char_002_amiya_1p", name: "阿米娅", sub: "Amiya · R002", rarity: 5, prof: "caster", elite: 1 },
  { id: "char_151_myrtle_2", name: "桃金娘", sub: "Myrtle · PL33", rarity: 4, prof: "pioneer", elite: 2 },
  { id: "char_118_yuki_2", name: "白雪", sub: "ShiraYuki · SN12", rarity: 3, prof: "sniper", elite: 1 },
];
</script>

<template>
  <AkOpGrid>
    <AkOpCard
      v-for="op in ops"
      :key="op.id"
      href="#"
      :name="op.name"
      :sub="op.sub"
      :avatar="asset(`avatar/${op.id}.png`)"
      :rarity="op.rarity"
      :rarity-icon="asset(`rarity/rarity_yellow_${op.rarity - 1}.png`)"
      :profession="PROF[op.prof]"
      :profession-icon="asset(`profession/${op.prof}.png`)"
      :elite="op.elite"
      :elite-icon="asset(`elite/elite_${op.elite}.png`)"
    />
  </AkOpGrid>
</template>
