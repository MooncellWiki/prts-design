<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkItem from "../AkItem.vue";
import AkItemList from "../AkItemList.vue";

const f = (id: string) => asset(`item/framed/${id}.png`);
</script>

<template>
  <div class="ak-flex-col ak-gap-4">
    <AkItemList>
      <AkItem :src="f('3302')" name="技巧概要·卷2" :count="8" size="sm" />
      <AkItem :src="f('3303')" name="技巧概要·卷3" :count="8" />
      <AkItem :src="f('2004')" name="高级作战记录" count="99+" size="lg" />
      <AkItem :src="f('30104')" name="RMA70-24" :count="0" disabled />
      <AkItem :src="f('4001')" name="龙门币" :count="30000" inline />
      <AkItem :src="f('30135')" name="D32钢" :count="2" insufficient inline />
    </AkItemList>
    <!-- 整排定尺寸：AkItemList 的 size 给里面没写 size 的道具；道具自己写了以自己为准（同 AkButtonGroup） -->
    <AkItemList size="sm">
      <AkItem :src="f('30011')" name="源岩" :count="6" />
      <AkItem :src="f('30012')" name="固源岩" :count="12" />
      <AkItem :src="f('30013')" name="固源岩组" :count="5" />
      <AkItem :src="f('30014')" name="提纯源岩" :count="3" size="md" />
    </AkItemList>
  </div>
</template>
