<script setup lang="ts">
import AkKv from "../AkKv.vue";
import AkKvItem from "../AkKvItem.vue";

/** 人员档案「基础档案」 */
const profile = [
  ["代号", "陈"],
  ["性别", "女"],
  ["战斗经验", "四年"],
  ["出身地", "龙门"],
  ["生日", "7月7日"],
  ["种族", "龙"],
  ["身高", "168cm"],
  ["矿石病感染情况", "未公开"],
] as const;
</script>

<template>
  <AkKv>
    <AkKvItem v-for="[k, v] in profile" :key="k" :term="k">{{ v }}</AkKvItem>
  </AkKv>
</template>
