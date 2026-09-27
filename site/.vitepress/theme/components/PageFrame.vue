<script setup lang="ts">
/** 整页样例：原样跑 preview/<page>.html（皮肤骨架 + 页面，含现网 Widget），主题跟文档站走 */
import { useData, withBase } from "vitepress";
import { computed } from "vue";

const props = defineProps<{ page: string; height?: string }>();
const { isDark } = useData();
const url = computed(() => withBase(`/preview/${props.page}?theme=${isDark.value ? "dark" : "light"}&demo=0`));
</script>

<template>
  <div class="akd-page vp-raw">
    <div class="akd-page__bar">
      <code>preview/{{ page }}</code>
      <a :href="url" target="_blank" rel="noopener">单独打开 ↗</a>
    </div>
    <iframe :key="url" :src="url" :title="page" :style="{ height: height ?? '85vh' }" />
  </div>
</template>
