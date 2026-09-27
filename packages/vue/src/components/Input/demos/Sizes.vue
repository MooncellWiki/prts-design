<script setup lang="ts">
import AkInput from "../AkInput.vue";
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkInput size="sm" label="小" placeholder="sm · 30px：表格里、工具栏" />
    <AkInput label="默认" placeholder="md · 36px（默认），与按钮同高" />
    <AkInput size="lg" label="大" placeholder="lg · 44px：独立的大输入" />
  </div>
</template>
