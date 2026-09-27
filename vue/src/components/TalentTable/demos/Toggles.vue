<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkElite from "../../Elite/AkElite.vue";
import AkRichText from "../../RichText/AkRichText.vue";
import AkCalc, { type CalcKind } from "../AkCalc.vue";
import AkTalentTable, { type TalentRow } from "../AkTalentTable.vue";

/** 陈 · 第二天赋：潜能 5 时每项多一点；攻击力 / 防御力是直接乘算（算法开关打开时标出来） */
const potential = ref(false);
const calc = ref(false);

const items: { label: string; calc?: CalcKind; bonus: number }[] = [
  { label: "攻击力", calc: "mul", bonus: 1 },
  { label: "防御力", calc: "mul", bonus: 1 },
  { label: "物理闪避", bonus: 3 },
];
/** 精英二 / Y模组 2级 / Y模组 3级 下的三项数值 */
const stats = [[5, 5, 10], [11, 11, 15], [15, 15, 18]];
const modules = [undefined, "Y模组 2级", "Y模组 3级"];

/** 描述串（没写 #description 插槽时直接由 AkRichText 渲染；这里要插 AkCalc，所以下面用插槽自己画） */
const rows: TalentRow[] = stats.map((s, i) => ({
  name: "持刀格斗术",
  condition: modules[i],
  description: items.map((it, k) => `${it.label}+${s[k]}%`).join("，"),
  potential: items.map((it, k) => `${it.label}+${s[k] + it.bonus}%<@ba.talpu>（+${it.bonus}%）</>`).join("，"),
}));
</script>

<template>
  <div class="ak-flex-col ak-gap-2">
    <AkTalentTable
      v-model="potential"
      v-model:calc="calc"
      title="第二天赋"
      :rows="rows"
      :potential-rank="5"
      :potential-icon="asset('potential/potential_4.png')"
      calc-toggle
    >
      <template #condition="{ row }">
        <AkElite :src="asset('elite/elite_2.png')" :phase="2" /><template v-if="row.condition"> · {{ row.condition }}</template>
      </template>
      <template #description="{ index, potential: pot }">
        <template v-for="(it, k) in items" :key="k">
          {{ k ? "，" : "" }}{{ it.label }}<AkCalc v-if="it.calc" :kind="it.calc" />+{{ stats[index][k] + (pot ? it.bonus : 0) }}%<AkRichText v-if="pot" variant="talpu">（+{{ it.bonus }}%）</AkRichText>
        </template>
      </template>
      <template #legend><span>详见 <a href="#">游戏数据基础 · 属性基本公式</a></span></template>
    </AkTalentTable>
    <span class="ak-fs-sm ak-fg-muted">潜能加成：{{ potential ? "开" : "关" }} · 算法：{{ calc ? "开" : "关" }}</span>
  </div>
</template>
