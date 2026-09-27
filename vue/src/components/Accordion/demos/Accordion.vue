<script setup lang="ts">
import { ref } from "vue";

import AkTag from "../../Tag/AkTag.vue";
import AkCollapse from "../AkCollapse.vue";
import AkCollapseItem from "../AkCollapseItem.vue";

const files = [
  { name: "basic", title: "基础档案", unlock: "初始开放", text: "【代号】陈　【性别】女　【战斗经验】四年" },
  { name: "health", title: "综合体检测试", unlock: "初始开放", text: "物理强度：优良　战场机动：标准　战斗技巧：卓越" },
  { name: "clinic", title: "临床诊断分析", unlock: "信赖 25%", text: "【应龙门近卫局要求，不予公开】" },
  { name: "story1", title: "档案资料一", unlock: "信赖 50%", text: "陈从来不在人前使用源石技艺……" },
];
const open = ref(["basic"]);
</script>

<template>
  <AkCollapse v-model="open" accordion>
    <AkCollapseItem v-for="f in files" :key="f.name" :name="f.name">
      <template #header>
        {{ f.title }} <AkTag size="sm" variant="outline">{{ f.unlock }}</AkTag>
      </template>
      <p>{{ f.text }}</p>
    </AkCollapseItem>
  </AkCollapse>
</template>
