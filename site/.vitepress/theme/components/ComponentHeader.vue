<script setup lang="ts">
/**
 * 组件页头（≈ primer.style 组件页的页头）：分组 · 标题 · 一句话 · 每种实现一行（状态 + 源码 / Storybook / 现网模板）· 概览 / 指南 / 可访问性 页签。
 * 由 Layout 的 doc-before 插槽挂上；frontmatter 里有 component: <id> 的页才显示。
 */
import { useData, withBase } from "vitepress";
import { computed } from "vue";

import { components, GROUP_LABEL, REPO, STATUS_LABEL } from "../../registry";

const { frontmatter, page, theme } = useData();
const c = computed(() => components.find(x => x.id === frontmatter.value.component));
const tabs = computed(() => (c.value ? ((theme.value.akdsTabs?.[c.value.id] as string[] | undefined) ?? []) : []));
const TAB_LABEL: Record<string, string> = { index: "概览", guidelines: "指南", accessibility: "可访问性" };
const current = computed(() => page.value.relativePath.split("/").pop()!.replace(/\.md$/, ""));
const tabLink = (t: string) => withBase(`/${c.value!.group}/${c.value!.id}/${t === "index" ? "" : t}`);
const storybook = computed(() =>
  c.value?.storybook ? `${import.meta.env.DEV ? "http://localhost:6006/" : `${import.meta.env.BASE_URL}storybook/`}?path=/docs/${c.value.storybook}--docs` : "",
);
</script>

<template>
  <header v-if="c" class="akd-ch">
    <div class="akd-ch__eyebrow">{{ GROUP_LABEL[c.group] }}</div>
    <h1 class="akd-ch__title">{{ c.zh }}<span>{{ c.name }}</span></h1>
    <p class="akd-ch__desc">{{ c.description }}</p>
    <dl class="akd-ch__impl">
      <div>
        <dt>CSS</dt>
        <dd>
          <span :class="['akd-status', `is-${c.css.status}`]">{{ STATUS_LABEL[c.css.status] }}</span>
          <a v-for="f in c.css.files" :key="f" :href="`${REPO}/blob/master/src/${f}`" target="_blank" rel="noopener"><code>src/{{ f }}</code></a>
          <template v-if="c.template">
            <span class="akd-ch__sep">现网</span>
            <a :href="`https://prts.wiki/w/${c.template}`" target="_blank" rel="noopener"><code>{{ c.template }}</code></a>
          </template>
        </dd>
      </div>
      <div v-if="c.vue">
        <dt>Vue</dt>
        <dd>
          <span :class="['akd-status', `is-${c.vue.status}`]">{{ STATUS_LABEL[c.vue.status] }}</span>
          <code>import { {{ c.vue.components.join(", ") }} } from "@akds/vue"</code>
          <a v-if="storybook" :href="storybook" target="_blank" rel="noopener">Storybook ↗</a>
          <a :href="`${REPO}/tree/master/vue/src/components/${c.vue.dir}`" target="_blank" rel="noopener">源码 ↗</a>
        </dd>
      </div>
    </dl>
    <nav v-if="tabs.length > 1" class="akd-ch__tabs" aria-label="页签">
      <a v-for="t in tabs" :key="t" :href="tabLink(t)" :class="{ 'is-active': t === current }" :aria-current="t === current ? 'page' : undefined">
        {{ TAB_LABEL[t] }}
      </a>
    </nav>
  </header>
</template>
