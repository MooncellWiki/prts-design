<script setup lang="ts">
import { ref } from "vue";

import AkPagination from "../AkPagination.vue";

const a = ref(1);
const b = ref(8);
const c = ref(3);
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkPagination v-model="a" :item-count="236" :page-size="20" />
      <span class="ak-fs-sm ak-fg-muted">共 236 条，每页 20 条</span>
    </div>
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkPagination v-model="b" :page-count="24" :page-slot="5" />
      <span class="ak-fs-sm ak-fg-muted">page-slot = 5（窄处）</span>
    </div>
    <div class="ak-flex ak-wrap ak-gap-4 ak-items-center">
      <AkPagination v-model="c" :page-count="5" disabled />
      <span class="ak-fs-sm ak-fg-muted">禁用</span>
    </div>
  </div>
</template>
