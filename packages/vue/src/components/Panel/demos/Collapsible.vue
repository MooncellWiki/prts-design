<script setup lang="ts">
import { ref } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkTag from "../../Tag/AkTag.vue";
import AkPanel from "../AkPanel.vue";

const open = ref(false);
/** 陈的潜能提升（gamedata 2.7.61） */
const pots = [
  { lv: 2, text: "部署费用 -1" },
  { lv: 3, text: "再部署时间 -4 秒" },
  { lv: 4, text: "攻击力 +23" },
  { lv: 5, text: "第二天赋效果增强" },
  { lv: 6, text: "部署费用 -1" },
];
</script>

<template>
  <div>
    <AkPanel title="公告" en="Notice" inverse collapsible>
      <p class="ak-fs-sm ak-m-0">反转标题栏 + 可折叠：点标题栏收起；聚焦标题后 Enter / Space 也行。</p>
    </AkPanel>
    <AkPanel v-model="open" title="潜能提升" collapsible title-tag="h3">
      <template #header-extra><AkTag size="sm" variant="outline">5 项</AkTag></template>
      <ul class="ak-m-0 ak-fs-sm">
        <li v-for="p in pots" :key="p.lv">潜能 {{ p.lv }}：{{ p.text }}</li>
      </ul>
    </AkPanel>
    <div class="ak-flex ak-gap-3 ak-items-center">
      <AkButton size="sm" @click="open = !open">{{ open ? "收起潜能提升" : "展开潜能提升" }}</AkButton>
      <span class="ak-fs-sm ak-fg-muted">v-model = {{ open }}</span>
    </div>
  </div>
</template>
