<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkButton from "../../Button/AkButton.vue";
import AkItem from "../../Item/AkItem.vue";
import AkItemList from "../../Item/AkItemList.vue";
import AkDialog from "../AkDialog.vue";

const open = ref(false);
const result = ref("");
const materials = [
  { id: "3223", name: "近卫双芯片", count: 4 },
  { id: "30115", name: "聚合剂", count: 4 },
  { id: "30074", name: "白马醇", count: 6 },
  { id: "4001", name: "龙门币", count: "180K" },
];
</script>

<template>
  <!-- 示例框留出对话框的高度：模态对话框在示例 iframe 的视口里居中 -->
  <div class="ak-flex ak-gap-3 ak-items-start" style="min-height: 320px">
    <AkButton variant="primary" @click="open = true">打开对话框</AkButton>
    <span v-if="result" class="ak-fs-sm ak-fg-muted ak-py-2">{{ result }}</span>
    <AkDialog
      v-model="open"
      title="确认精英化"
      positive-text="确认"
      negative-text="取消"
      @positive-click="result = '已精英化至精英二'"
      @negative-click="result = '已取消'"
    >
      将「陈」精英化至 <b>精英二</b>，消耗以下材料：
      <AkItemList class="ak-mt-2">
        <AkItem v-for="m in materials" :key="m.id" :src="asset(`item/framed/${m.id}.png`)" :name="m.name" :count="m.count" />
      </AkItemList>
    </AkDialog>
  </div>
</template>
