<script setup lang="ts">
import AkBadge from "../AkBadge.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
    <AkBadge :value="3" />
    <AkBadge :value="12" />
    <AkBadge :value="120" :max="99" label="超过 99 条未读" />
    <AkBadge :value="3" variant="accent" />
    <AkBadge :value="2" variant="danger" label="2 条回退提醒" />
    <AkBadge dot label="有新消息" />
    <AkBadge :value="0" show-zero />
  </div>
</template>
