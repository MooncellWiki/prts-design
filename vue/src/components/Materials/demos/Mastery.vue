<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkElite from "../../Elite/AkElite.vue";
import AkItem from "../../Item/AkItem.vue";
import AkMaterials from "../AkMaterials.vue";
import AkMaterialsRow from "../AkMaterialsRow.vue";

/** 陈 · 赤霄·绝影的专精训练：左列可以放别的组件（这里是精英化 / 专精标记） */
const f = (id: string) => asset(`item/framed/${id}.png`);
const mastery = [
  [["3303", "技巧概要·卷3", 8], ["30104", "RMA70-24", 4], ["30083", "轻锰矿", 5]],
  [["3303", "技巧概要·卷3", 12], ["30024", "糖聚块", 4], ["30104", "RMA70-24", 8]],
  [["3303", "技巧概要·卷3", 15], ["30135", "D32钢", 6], ["30044", "异铁块", 5]],
] as [id: string, name: string, count: number][][];
</script>

<template>
  <AkMaterials>
    <AkMaterialsRow v-for="(items, i) in mastery" :key="i">
      <template #label><AkElite :src="asset(`specialized/specialized_tiny_${i + 1}.png`)" :text="`专精 ${['Ⅰ', 'Ⅱ', 'Ⅲ'][i]}`" /></template>
      <AkItem v-for="[id, name, count] in items" :key="id" :src="f(id)" :name="name" :count="count" />
    </AkMaterialsRow>
  </AkMaterials>
</template>
