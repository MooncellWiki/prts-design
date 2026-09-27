<script setup lang="ts">
import AkSpValue from "../AkSpValue.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <!-- 陈 · 赤霄·绝影 7 级：消耗 36、初始 10；持续给真银斩（25 秒）作例 -->
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
      <AkSpValue kind="cost" :value="36" />
      <AkSpValue kind="init" :value="10" />
      <AkSpValue kind="duration" value="25s" />
    </div>
    <!-- 表头图例：芯片里写字 -->
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
      <AkSpValue kind="init">初始</AkSpValue>
      <AkSpValue kind="cost">消耗</AkSpValue>
      <AkSpValue kind="duration">持续</AkSpValue>
    </div>
  </div>
</template>
