<script setup lang="ts">
/**
 * 大标题横幅（官网风）：黑底 + 青色 overline + 大号拉丁标题（中文副标） + 青色横条 + 说明，右侧竖直青色色面叠网点。
 * 两套主题下都是黑底白字。是静态的「页头横幅」，不是轮播——首页的活动轮播是页面自己的结构（见文档页说明）。
 */
withDefaults(
  defineProps<{
    /** 大标题（展示字、全大写），拉丁字母最好看：AKDS / RHODES ISLAND */
    title: string;
    /** 标题下的中文副标（正文字体、半号） */
    subtitle?: string;
    /** 标题上方的青色小字（PRTS.WIKI · NEW SKIN DESIGN SYSTEM） */
    eyebrow?: string;
    /** 说明文字（最宽 60 字，70% 白） */
    description?: string;
    /** 标题下的青色横条 */
    bar?: boolean;
    /** 右侧竖直青色色面 */
    side?: boolean;
  }>(),
  { subtitle: undefined, eyebrow: undefined, description: undefined, bar: true, side: true },
);

defineSlots<{
  /** 标题（代替 title / subtitle）；中文副标放 <span class="cn"> */
  title?: () => unknown;
  /** 说明（代替 description），放在 <p> 里——只放行内内容 */
  description?: () => unknown;
  /** 说明下面的内容（按钮等） */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="ak-hero">
    <div v-if="eyebrow" class="ak-hero__eyebrow">{{ eyebrow }}</div>
    <h2 class="ak-hero__title">
      <slot name="title">{{ title }}<span v-if="subtitle" class="cn">{{ subtitle }}</span></slot>
    </h2>
    <div v-if="bar" class="ak-hero__bar" />
    <p v-if="description || $slots.description" class="ak-hero__desc"><slot name="description">{{ description }}</slot></p>
    <slot />
    <div v-if="side" class="ak-hero__side" />
  </div>
</template>
