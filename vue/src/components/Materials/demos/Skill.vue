<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkItem from "../../Item/AkItem.vue";
import AkMaterials from "../AkMaterials.vue";
import AkMaterialsDivider from "../AkMaterialsDivider.vue";
import AkMaterialsRow from "../AkMaterialsRow.vue";

/** 陈 · 技能升级材料（1→7，所有技能共用）：数据驱动时 v-for 即可；精英一之后的几级前面加一条分段说明 */
const f = (id: string) => asset(`item/framed/${id}.png`);
const steps = [
  { label: "1 → 2", items: [["3301", "技巧概要·卷1", 5]] },
  { label: "2 → 3", items: [["3301", "技巧概要·卷1", 5], ["30011", "源岩", 6], ["30061", "破损装置", 4]] },
  { label: "3 → 4", items: [["3302", "技巧概要·卷2", 8], ["30022", "糖", 5]] },
  { label: "4 → 5", divider: "达到精英阶段 1 后解锁", items: [["3302", "技巧概要·卷2", 8], ["30032", "聚酸酯", 4], ["30042", "异铁", 4]] },
  { label: "5 → 6", items: [["3302", "技巧概要·卷2", 8], ["30063", "全新装置", 4]] },
  { label: "6 → 7", items: [["3303", "技巧概要·卷3", 8], ["30073", "扭转醇", 5], ["30053", "酮凝集组", 4]] },
] as { label: string; divider?: string; items: [id: string, name: string, count: number][] }[];
</script>

<template>
  <AkMaterials>
    <template v-for="s in steps" :key="s.label">
      <AkMaterialsDivider v-if="s.divider">{{ s.divider }}</AkMaterialsDivider>
      <AkMaterialsRow :label="s.label">
        <AkItem v-for="[id, name, count] in s.items" :key="id" :src="f(id)" :name="name" :count="count" />
      </AkMaterialsRow>
    </template>
  </AkMaterials>
</template>
