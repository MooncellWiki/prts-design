<script setup lang="ts">
import AkEnemy from "../AkEnemy.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkEnemy variant="boss" code="B003" name="碎骨" :level="4" />
    <AkEnemy variant="elite" code="E020" name="萨卡兹大剑手" :level="2" />
    <AkEnemy code="N001" name="源石虫" :level="1" />
  </div>
</template>
