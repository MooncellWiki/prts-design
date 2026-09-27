<script setup lang="ts">
import AkArchive from "../AkArchive.vue";

/** 游戏文本原样：换行靠 <p> 的 pre-line 保留 */
const text = `龙门近卫局警司，特别督察组组长。
负责龙门近卫局特别督察组的日常指挥执行工作。
魏彦吾的最得力的下属之一。拥有整个近卫局中最精湛的剑技以及最严苛的态度。态度极度强硬，对人一视同仁。看起来一点都不变通，总是一副凶着脸的样子。`;
</script>

<template>
  <AkArchive kicker="Intel · 未获得时档案" title="情报资料一">
    <template #unlock>通关主题曲 <a class="ak-stage-code" href="#">2-2</a></template>
    <p><b>【陈】</b><br />{{ text }}</p>
  </AkArchive>
</template>
