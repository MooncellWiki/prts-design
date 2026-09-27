<script setup lang="ts">
import { ref } from "vue";

import AkTab from "../AkTab.vue";
import AkTabPane from "../AkTabPane.vue";
import AkTabs from "../AkTabs.vue";

const tab = ref("op");
const scope = ref("all");
const server = ref("cn");
</script>

<template>
  <div class="ak-flex-col ak-gap-6">
    <AkTabs v-model="tab" label="干员资料">
      <AkTabPane name="op" tab="干员">下划线标签页（默认）：选中项青色下划线 + 左上角标。</AkTabPane>
      <AkTabPane name="skill" tab="技能">技能面板。</AkTabPane>
      <AkTabPane name="module" tab="模组">模组面板。</AkTabPane>
      <AkTabPane name="archive" tab="档案" disabled>档案面板。</AkTabPane>
    </AkTabs>
    <div class="ak-flex ak-wrap ak-gap-6 ak-items-center">
      <AkTabs v-model="scope" variant="pill" label="范围">
        <AkTab name="all" tab="全部" />
        <AkTab name="main" tab="主线" />
        <AkTab name="event" tab="活动" />
      </AkTabs>
      <AkTabs v-model="server" variant="block" label="服务器">
        <AkTab name="cn">国服</AkTab>
        <AkTab name="bili">B 服</AkTab>
        <AkTab name="global">国际服</AkTab>
      </AkTabs>
    </div>
  </div>
</template>
