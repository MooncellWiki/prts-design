<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkButton from "../../Button/AkButton.vue";
import AkItem from "../../Item/AkItem.vue";
import AkItemList from "../../Item/AkItemList.vue";
import AkPopover from "../AkPopover.vue";

const materials = [
  { id: "3223", name: "近卫双芯片", count: 4 },
  { id: "30115", name: "聚合剂", count: 4 },
  { id: "30074", name: "白马醇", count: 6 },
  { id: "4001", name: "龙门币", count: "180K" },
];
</script>

<template>
  <!-- 示例框留出卡片展开的高度（气泡是绝对定位，不撑开外层） -->
  <div class="ak-flex ak-wrap ak-gap-4 ak-items-start" style="min-height: 200px">
    <AkPopover title="精英二 · 陈" placement="bottom-start">
      <template #trigger><AkButton variant="contrast">精英化材料</AkButton></template>
      <AkItemList class="ak-mt-2">
        <AkItem v-for="m in materials" :key="m.id" :src="asset(`item/framed/${m.id}.png`)" :name="m.name" :count="m.count" size="sm" />
      </AkItemList>
    </AkPopover>
    <p class="ak-m-0">
      所属势力：
      <AkPopover trigger="hover" title="龙门近卫局">
        <template #trigger><span class="ak-term">龙门近卫局</span></template>
        包含以下干员——陈、星熊、诗怀雅。<a href="#">查看势力页</a>
      </AkPopover>
    </p>
  </div>
</template>
