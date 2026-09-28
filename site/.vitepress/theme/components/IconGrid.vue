<script setup lang="ts">
/** 全部线稿图标：点击复制名字（Vue 的 <AkIcon name> / sprite 的 #i-*），或整段内联 <svg>（纯 HTML 页面没有 sprite，直接贴这段） */
import { ref } from "vue";

import { AkIcon, icons, type IconName } from "@mooncellwiki/prts-design-vue";

const names = Object.keys(icons) as IconName[];
const mode = ref<"name" | "svg">("name");
const copied = ref("");
/** 与 AkIcon 渲染出的结构相同；尺寸不写，由外层 CSS 定（.ak-btn__icon 等），单独用时自己加 width / height */
const svg = (n: IconName) => `<svg class="ak-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[n]}</svg>`;
async function copy(n: IconName) {
  await navigator.clipboard?.writeText(mode.value === "svg" ? svg(n) : n);
  copied.value = n;
  setTimeout(() => (copied.value = ""), 1200);
}
</script>

<template>
  <div class="akd-icons__mode" role="radiogroup" aria-label="点击复制">
    <span>点击复制</span>
    <button type="button" role="radio" :aria-checked="mode === 'name'" @click="mode = 'name'">名字</button>
    <button type="button" role="radio" :aria-checked="mode === 'svg'" @click="mode = 'svg'">内联 SVG</button>
  </div>
  <div class="akd-icons">
    <button v-for="n in names" :key="n" type="button" class="akd-icons__item" :title="`复制 ${n}`" @click="copy(n)">
      <AkIcon :name="n" :size="24" />
      <code>{{ copied === n ? "已复制" : n }}</code>
    </button>
  </div>
</template>
