<script setup lang="ts">
import { ref } from "vue";

import AkChip from "../AkChip.vue";

const langs = [
  { key: "cn", name: "中文-普通话" },
  { key: "yue", name: "中文-方言" },
  { key: "jp", name: "日文" },
  { key: "en", name: "英文" },
  { key: "kr", name: "韩文" },
];
const lang = ref("cn");
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div class="ak-flex ak-wrap ak-gap-2" role="group" aria-label="语音语种">
      <AkChip v-for="l in langs" :key="l.key" :model-value="lang === l.key" icon="mic" @update:model-value="lang = l.key">
        {{ l.name }}
      </AkChip>
    </div>
    <p class="ak-fs-sm ak-fg-muted ak-m-0">当前：{{ langs.find(l => l.key === lang)?.name }}（再点一次已选中的不会取消）</p>
  </div>
</template>
