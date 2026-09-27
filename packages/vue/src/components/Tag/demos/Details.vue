<script setup lang="ts">
import { ref } from "vue";

import AkTag from "../AkTag.vue";

const filters = ref(["近卫", "六星", "可公招"]);
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-2 ak-items-center">
      <AkTag size="sm">SM</AkTag>
      <AkTag>MD</AkTag>
      <AkTag size="lg">LG</AkTag>
      <AkTag variant="accent-soft" caps>v0.1 draft</AkTag>
      <AkTag variant="outline" caps size="sm">gamedata 2.7.61</AkTag>
      <AkTag variant="success" dot>已同步</AkTag>
    </div>
    <div class="ak-tags">
      <AkTag v-for="f in filters" :key="f" variant="outline" removable @remove="filters = filters.filter(x => x !== f)">{{ f }}</AkTag>
    </div>
  </div>
</template>
