<script setup lang="ts">
import AkStage from "../AkStage.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkStage href="#" code="1-7" caption="Main · Chapter 1" name="暴君" :sanity="6" level="LV.30" />
    <AkStage href="#" code="H6-4" caption="Hard" variant="hard" name="乌萨斯的孩子们" :sanity="21" level="E2 LV.40" />
    <AkStage href="#" code="TO-EX-8" caption="EX" variant="ex" name="有袋鼷兽奇遇">
      <template #meta><span>SideStory · 直到大地变成一颗酸橙</span></template>
    </AkStage>
    <AkStage href="#" code="RF-ST-1" caption="Story" variant="story" name="怒号光明">
      <template #meta><span>剧情关卡</span></template>
    </AkStage>
  </div>
</template>
