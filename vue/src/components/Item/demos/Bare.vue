<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkItem from "../AkItem.vue";
import AkItemList from "../AkItemList.vue";

const items = [
  { id: "30011", name: "源岩", count: 6 },
  { id: "30012", name: "固源岩", count: 12 },
  { id: "30013", name: "固源岩组", count: 5 },
  { id: "30014", name: "提纯源岩", count: 3 },
  { id: "30135", name: "D32钢", count: 2 },
  { id: "4002", name: "至纯源石", count: 1 },
] as const;
</script>

<template>
  <AkItemList>
    <AkItem
      v-for="(it, i) in items"
      :key="it.id"
      bare
      :rarity="(i + 1) as 1 | 2 | 3 | 4 | 5 | 6"
      :src="asset(`item/${it.id}.png`)"
      :name="it.name"
      :count="it.count"
    />
  </AkItemList>
</template>
