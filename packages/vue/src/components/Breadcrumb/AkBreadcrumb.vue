<script setup lang="ts">
import { Comment, Fragment, cloneVNode, type VNode } from "vue";

import AkBreadcrumbItem from "./AkBreadcrumbItem.vue";

/**
 * 面包屑（= Naive 的 NBreadcrumb）：<nav> 地标里一条 <ol class="ak-breadcrumb">，里面放 AkBreadcrumbItem。
 * 分隔符是 CSS 画的斜角（li + li::before），不能换字符。外层标 ak-not-prose：正文的列表缩进 / 项目符号不进来。
 * 没有哪一项写了 current 时，最后一项自动标成当前页（aria-current="page"，加粗）——所以这里要读子组件 vnode（同 AkTabs）。
 */
withDefaults(
  defineProps<{
    /** 导航地标的可访问名（nav 的 aria-label） */
    label?: string;
  }>(),
  { label: "面包屑" },
);

const slots = defineSlots<{
  /** 若干 AkBreadcrumbItem，从上级到当前页 */
  default?: () => VNode[];
}>();

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(n => (n.type === Fragment && Array.isArray(n.children) ? flatten(n.children as VNode[]) : n.type === Comment ? [] : [n]));

/** 插槽只能在渲染期调用，所以由模板调用 */
function items(): VNode[] {
  const nodes = flatten(slots.default?.() ?? []);
  const crumbs = nodes.filter(n => n.type === AkBreadcrumbItem);
  if (crumbs.some(n => n.props && "current" in n.props)) return nodes;
  const last = crumbs.at(-1);
  return nodes.map(n => (n === last ? cloneVNode(n, { current: true }) : n));
}

const Render = (p: { nodes: VNode[] }) => p.nodes;
</script>

<template>
  <nav class="ak-not-prose" :aria-label="label">
    <ol class="ak-breadcrumb"><Render :nodes="items()" /></ol>
  </nav>
</template>
