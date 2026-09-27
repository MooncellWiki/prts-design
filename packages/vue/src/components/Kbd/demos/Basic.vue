<script setup lang="ts">
import AkKbd from "../AkKbd.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3 ak-fs-sm">
    <span>按 <AkKbd>/</AkKbd> 或 <AkKbd>Ctrl</AkKbd> + <AkKbd>K</AkKbd> 打开搜索</span>
    <span class="ak-flex ak-wrap ak-gap-4 ak-fg-muted ak-fs-xs">
      <span><AkKbd>↑</AkKbd> <AkKbd>↓</AkKbd> 选择</span>
      <span><AkKbd>↵</AkKbd> 打开</span>
      <span><AkKbd>⇧</AkKbd> <AkKbd>↵</AkKbd> 全文搜索</span>
      <span><AkKbd>Esc</AkKbd> 关闭</span>
    </span>
  </div>
</template>
