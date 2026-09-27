<script setup lang="ts">
/**
 * 区块标题：中文标题 + Bender 大写英文副题（「技能 SKILLS」），左侧主色粗竖条；右侧可放「查看全部 ›」这类附加。
 * Naive 没有对应组件（最近的是 NPageHeader 的 title / subtitle / #extra）。标题元素是真正的 h1–h6，进页面大纲。
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 标题（也可写在默认插槽里） */
    title?: string;
    /** 英文副题（Bender 大写灰字）：并排时跟在标题右边，stack 时叠在标题上方当眉题（「Chapter 08」） */
    en?: string;
    /** 标题级别，渲染成 h1–h6 */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** 外观：bar 左侧主色粗竖条（默认）· underline 底线 + 左段 120px 主色粗线 */
    variant?: "bar" | "underline";
    /** 英文叠在标题上方（章节号、活动代号） */
    stack?: boolean;
    /** 尺寸：md = h2 字号（默认）· lg = display 字号（专题页 / 活动页头） */
    size?: "md" | "lg";
  }>(),
  { title: undefined, en: undefined, level: 2, variant: "bar", size: "md" },
);

defineSlots<{
  /** 标题内容（代替 title） */
  default?: () => unknown;
  /** 右侧附加（链接、开关），推到最右 */
  extra?: () => unknown;
}>();

const classes = computed(() => [
  "ak-heading",
  props.variant === "underline" && "ak-heading--underline",
  props.size === "lg" && "ak-heading--lg",
  { "ak-heading--stack": props.stack },
]);
</script>

<template>
  <div :class="classes">
    <span v-if="en && stack" class="ak-heading__en" lang="en">{{ en }}</span>
    <component :is="`h${level}`" class="ak-heading__title"><slot>{{ title }}</slot></component>
    <span v-if="en && !stack" class="ak-heading__en" lang="en">{{ en }}</span>
    <span v-if="$slots.extra" class="ak-heading__aside"><slot name="extra" /></span>
  </div>
</template>
