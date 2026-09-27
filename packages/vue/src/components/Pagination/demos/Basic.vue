<script setup lang="ts">
import { ref } from "vue";

import AkPagination from "../AkPagination.vue";

const page = ref(1);
const middle = ref(12);
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkPagination v-model="page" :page-count="24" />
      <span class="ak-fs-sm ak-fg-muted">第 {{ page }} / 24 页</span>
    </div>
    <AkPagination v-model="middle" :page-count="24" />
  </div>
</template>
