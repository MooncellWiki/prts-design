<script setup lang="ts">
import AkButton from "../AkButton.vue";
</script>

<template>
  <div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
    <AkButton icon="edit" variant="primary">编辑</AkButton>
    <AkButton icon="history">查看历史</AkButton>
    <AkButton icon="arrow-ne" icon-placement="right" variant="ghost">前往现网</AkButton>
    <AkButton icon="search" label="搜索" />
    <AkButton icon="more" label="更多" variant="ghost" />
    <AkButton icon="x" label="关闭" size="sm" variant="ghost" />
  </div>
</template>
