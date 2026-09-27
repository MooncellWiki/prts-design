<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkItem from "../../Item/AkItem.vue";
import AkMaterials from "../AkMaterials.vue";
import AkMaterialsRow from "../AkMaterialsRow.vue";

/** 陈 · 精英化材料：左列放精英化图标用 #label 插槽 */
const f = (id: string) => asset(`item/framed/${id}.png`);
const e = (n: number) => asset(`elite/elite_${n}.png`);
</script>

<template>
  <AkMaterials>
    <AkMaterialsRow>
      <template #label><img :src="e(0)" alt="" />→<img :src="e(1)" alt="" /> 精英阶段 0→1</template>
      <AkItem :src="f('4001')" name="龙门币" count="3w" />
      <AkItem :src="f('3221')" name="近卫芯片" :count="5" />
      <AkItem :src="f('30012')" name="固源岩" :count="12" />
      <AkItem :src="f('30062')" name="装置" :count="3" />
    </AkMaterialsRow>
    <AkMaterialsRow>
      <template #label><img :src="e(1)" alt="" />→<img :src="e(2)" alt="" /> 精英阶段 1→2</template>
      <AkItem :src="f('4001')" name="龙门币" count="18w" />
      <AkItem :src="f('3223')" name="近卫双芯片" :count="4" />
      <AkItem :src="f('30115')" name="聚合剂" :count="4" />
      <AkItem :src="f('30074')" name="白马醇" :count="6" />
    </AkMaterialsRow>
  </AkMaterials>
</template>
