<script setup lang="ts">
import AkMessage from "../AkMessage.vue";
</script>

<template>
  <div>
    <AkMessage variant="accent" banner :show-icon="false">
      网页活动<b>「罗德岛录像带」</b>进行中 · 08.20 10:00 — 08.30 03:59
    </AkMessage>
    <AkMessage variant="danger" banner stripes>数据库维护中：09-28 04:00 – 06:00 暂停编辑，页面只读。</AkMessage>
  </div>
</template>
