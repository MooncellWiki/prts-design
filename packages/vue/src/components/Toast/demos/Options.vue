<script setup lang="ts">
import { h, useTemplateRef } from "vue";

import AkButton from "../../Button/AkButton.vue";
import AkToastProvider from "../AkToastProvider.vue";

// 也可以拿 provider 的 ref 直接调，方法和 useToast() 一样
const toaster = useTemplateRef("toaster");

const sticky = () => toaster.value?.warning("编辑冲突：另一位编辑者刚刚保存了本页", { title: "请先合并", duration: 0 });
const quick = () => toaster.value?.success("已复制 --ak-accent", { duration: 1500, closable: false });
const rich = () =>
  toaster.value?.info(() => ["已提交到 ", h("a", { href: "#" }, "Special:最近更改"), "，刷新后可见"], { duration: 8000 });
</script>

<template>
  <div>
    <AkToastProvider ref="toaster" :max="3">
      <div class="ak-flex ak-wrap ak-gap-3">
        <AkButton @click="sticky">常驻（duration: 0）</AkButton>
        <AkButton @click="quick">1.5 秒、不带 ✕</AkButton>
        <AkButton @click="rich">带链接的正文</AkButton>
        <AkButton variant="ghost" @click="toaster?.destroyAll()">全部关掉</AkButton>
      </div>
    </AkToastProvider>
  </div>
</template>
