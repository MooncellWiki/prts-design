<script setup lang="ts">
import AkButton from "../../Button/AkButton.vue";
import AkEmpty from "../AkEmpty.vue";
</script>

<template>
  <AkEmpty code="404" title="页面不存在">
    PRTS 里还没有「<b>陈（假日威龙）/语音记录</b>」这个页面。
    <template #extra>
      <AkButton size="sm" variant="primary" icon="edit">创建此页面</AkButton>
      <AkButton size="sm" icon="search">搜索站内</AkButton>
    </template>
  </AkEmpty>
</template>
