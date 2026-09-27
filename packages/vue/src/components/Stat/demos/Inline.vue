<script setup lang="ts">
import AkStat from "../AkStat.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-6 ak-items-baseline">
    <AkStat inline label="干员" :value="356" />
    <AkStat inline label="关卡" value="1,204" />
    <AkStat inline label="今日编辑" value="2.3" delta="+8%">
      <template #suffix>k</template>
    </AkStat>
  </div>
</template>
