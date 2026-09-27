<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkCamp from "../AkCamp.vue";

const camps = [
  ["rhodes", "罗德岛"],
  ["lgd", "龙门近卫局"],
  ["kjerag", "谢拉格"],
  ["penguin", "企鹅物流"],
  ["rhine", "莱茵生命"],
  ["laterano", "拉特兰"],
  ["siracusa", "叙拉古"],
] as const;
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
    <AkCamp v-for="[id, name] in camps" :key="id" :src="asset(`camp/${id}.png`)" :name="name" />
  </div>
</template>
