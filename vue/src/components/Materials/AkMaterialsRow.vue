<script setup lang="ts">
import { cloneVNode, Comment, Fragment, type VNode } from "vue";

import AkItem from "../Item/AkItem.vue";

/**
 * 材料表的一行（= Naive 的 NDescriptionsItem），只能直接放在 AkMaterials 里：输出网格的两格——
 * .ak-materials__label（阶段 / 等级）+ .ak-item-list（材料）。两个根元素，所以不继承属性。
 */
defineOptions({ inheritAttrs: false });

defineProps<{
  /** 左列文字（「1 → 2」「精英阶段 0→1」）；要放精英化图标时用 #label 插槽 */
  label?: string;
}>();

const slots = defineSlots<{
  /** 这一步要的材料：若干 AkItem——没写 size 的按表里的规格画成 sm（40px） */
  default?: () => VNode[];
  /** 左列内容（代替 label） */
  label?: () => unknown;
}>();

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(n => (n.type === Fragment && Array.isArray(n.children) ? flatten(n.children as VNode[]) : n.type === Comment ? [] : [n]));

/** 材料表里的道具统一是 sm：AkItem 不读上下文（不像 AkButton 读 AkButtonGroup 的 size），所以给没写 size 的 AkItem vnode 直接补上 */
const Items = () =>
  flatten(slots.default?.() ?? []).map(n => (n.type === AkItem && n.props?.size === undefined ? cloneVNode(n, { size: "sm" }) : n));
</script>

<template>
  <span class="ak-materials__label"><slot name="label">{{ label }}</slot></span>
  <span class="ak-item-list"><Items /></span>
</template>
