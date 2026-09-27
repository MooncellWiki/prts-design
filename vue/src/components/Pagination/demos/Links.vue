<script setup lang="ts">
import { ref } from "vue";

import AkPagination from "../AkPagination.vue";

const page = ref(3);
/** MW 的列表页按 offset 翻页；示例里用 # 地址，点了不会真的跳走 */
const href = (n: number) => `#offset=${(n - 1) * 50}`;
</script>

<template>
  <AkPagination v-model="page" :page-count="9" :page-href="href" label="页面列表分页" />
</template>
