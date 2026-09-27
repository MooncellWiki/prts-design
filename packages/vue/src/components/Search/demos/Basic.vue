<script setup lang="ts">
import { ref } from "vue";

import AkKbd from "../../Kbd/AkKbd.vue";
import AkSearch from "../AkSearch.vue";

const q = ref("");
const last = ref("");
</script>

<template>
  <form role="search" class="ak-flex-col ak-gap-2 ak-max-narrow" @submit.prevent>
    <AkSearch v-model="q" placeholder="搜索 PRTS…" shortcut="/" @search="last = $event" />
    <span class="ak-fs-xs ak-fg-muted">在示例里别处按 <AkKbd>/</AkKbd> 聚焦；回车触发 search：{{ last || "—" }}</span>
  </form>
</template>
