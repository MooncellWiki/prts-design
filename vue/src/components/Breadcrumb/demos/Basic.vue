<script setup lang="ts">
import AkBreadcrumb from "../AkBreadcrumb.vue";
import AkBreadcrumbItem from "../AkBreadcrumbItem.vue";

const branch = [
  { text: "干员", href: "#干员" },
  { text: "近卫", href: "#近卫" },
  { text: "剑豪", href: "#剑豪" },
];
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkBreadcrumb>
      <AkBreadcrumbItem href="#首页">首页</AkBreadcrumbItem>
      <AkBreadcrumbItem href="#干员一览">干员一览</AkBreadcrumbItem>
      <AkBreadcrumbItem>陈</AkBreadcrumbItem>
    </AkBreadcrumb>
    <AkBreadcrumb label="职业分支">
      <AkBreadcrumbItem v-for="b in branch" :key="b.text" :href="b.href">{{ b.text }}</AkBreadcrumbItem>
      <AkBreadcrumbItem>陈</AkBreadcrumbItem>
    </AkBreadcrumb>
  </div>
</template>
