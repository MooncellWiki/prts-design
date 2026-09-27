<script setup lang="ts">
import AkStage from "../AkStage.vue";

/** 首页「近期新增」：SideStory「直到大地变成一颗酸橙」· 踏上归家长途 */
const stages = [
  ["TO-EX-1", "电影防沉迷"],
  ["TO-EX-2", "邮包流水线"],
  ["TO-EX-3", "地下捉迷藏"],
  ["TO-EX-4", "处处是一撮毛"],
  ["TO-EX-5", "“勒柄嘘混”"],
  ["TO-EX-6", "信使？术师！"],
  ["TO-EX-7", "卡特斯三个窝"],
  ["TO-EX-8", "有袋鼷兽奇遇"],
] as const;
</script>

<template>
  <div class="ak-grid-auto ak-gap-2">
    <AkStage v-for="[code, name] in stages" :key="code" href="#" :code="code" :name="name" />
  </div>
</template>
