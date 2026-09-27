<script setup lang="ts">
/** 全部线稿图标：点击复制名字 */
import { ref } from "vue";

import { AkIcon, icons, type IconName } from "@akds/vue";

const names = Object.keys(icons) as IconName[];
const copied = ref("");
async function copy(n: string) {
  await navigator.clipboard?.writeText(n);
  copied.value = n;
  setTimeout(() => (copied.value = ""), 1200);
}
</script>

<template>
  <div class="akd-icons">
    <button v-for="n in names" :key="n" type="button" class="akd-icons__item" :title="`复制 ${n}`" @click="copy(n)">
      <AkIcon :name="n" :size="24" />
      <code>{{ copied === n ? "已复制" : n }}</code>
    </button>
  </div>
</template>
