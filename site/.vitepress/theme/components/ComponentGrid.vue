<script setup lang="ts">
/** 组件总览：注册表里的组件按分组排成卡片，带 CSS / Vue 两种实现的状态 */
import { useData, withBase } from "vitepress";

import { components, GROUP_LABEL, STATUS_LABEL, type ComponentEntry } from "../../registry";

const { theme } = useData();
const link = (c: ComponentEntry) => withBase(theme.value.akdsTabs?.[c.id]?.length ? `/${c.group}/${c.id}/` : `/${c.group}/${c.id}`);
const groups = (["components", "arknights"] as const).map(g => ({ g, items: components.filter(c => c.group === g).sort((a, b) => a.name.localeCompare(b.name)) }));
</script>

<template>
  <section v-for="{ g, items } in groups" :key="g" class="akd-grid-section">
    <h2 :id="g">{{ GROUP_LABEL[g] }}</h2>
    <div class="akd-grid">
      <a v-for="c in items" :key="c.id" :href="link(c)" class="akd-card">
        <span class="akd-card__name">{{ c.zh }} <span>{{ c.name }}</span></span>
        <span class="akd-card__desc">{{ c.description }}</span>
        <span class="akd-card__impl">
          <span :class="['akd-status', `is-${c.css.status}`]">CSS · {{ STATUS_LABEL[c.css.status] }}</span>
          <span v-if="c.vue" :class="['akd-status', `is-${c.vue.status}`]">Vue · {{ STATUS_LABEL[c.vue.status] }}</span>
        </span>
      </a>
    </div>
  </section>
</template>
