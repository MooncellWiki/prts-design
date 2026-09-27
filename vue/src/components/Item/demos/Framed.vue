<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkItem from "../AkItem.vue";
import AkItemList from "../AkItemList.vue";

const f = (id: string) => asset(`item/framed/${id}.png`);
</script>

<template>
  <AkItemList>
    <AkItem :src="f('30011')" name="源岩" :count="6" />
    <AkItem :src="f('30012')" name="固源岩" :count="12" />
    <AkItem :src="f('30013')" name="固源岩组" :count="5" />
    <AkItem :src="f('30014')" name="提纯源岩" :count="3" />
    <AkItem :src="f('30135')" name="D32钢" :count="2" insufficient />
    <AkItem :src="f('4002')" name="至纯源石" :count="1" />
    <AkItem :src="f('4001')" name="龙门币" count="30K" />
    <AkItem :src="f('3223')" name="近卫双芯片" :count="4" />
    <AkItem :src="f('mod_unlock_token')" name="模组数据块" :count="4" />
  </AkItemList>
</template>
