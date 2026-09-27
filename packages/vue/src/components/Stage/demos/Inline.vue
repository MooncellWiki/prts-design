<script setup lang="ts">
import AkSanity from "../AkSanity.vue";
import AkStageCode from "../AkStageCode.vue";
</script>

<template>
  <ul>
    <li>3星通关主题曲 <AkStageCode href="#">5-8</AkStageCode>；必须编入非助战陈并上场，且使用陈至少歼灭16名敌人</li>
    <li>情报资料一：通关主题曲 <AkStageCode href="#">2-2</AkStageCode> 解锁</li>
    <li>磨难险地 <AkStageCode variant="hard">H6-4</AkStageCode>「乌萨斯的孩子们」消耗 <AkSanity :value="21" /></li>
  </ul>
</template>
