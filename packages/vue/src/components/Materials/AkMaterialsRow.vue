<script setup lang="ts">
import { provide } from "vue";

import { itemListKey } from "../Item/context";

/**
 * 材料表的一行（= Naive 的 NDescriptionsItem），只能直接放在 AkMaterials 里：输出网格的两格——
 * .ak-materials__label（阶段 / 等级）+ .ak-item-list（材料）。两个根元素，所以不继承属性。
 */
defineOptions({ inheritAttrs: false });

defineProps<{
  /** 左列文字（「1 → 2」「精英阶段 0→1」）；要放精英化图标时用 #label 插槽 */
  label?: string;
}>();

defineSlots<{
  /** 这一步要的材料：若干 AkItem——没写 size 的按表里的规格画成 sm（40px） */
  default?: () => unknown;
  /** 左列内容（代替 label） */
  label?: () => unknown;
}>();

/** 材料表里的道具统一是 sm：同 AkItemList 的 size，经 provide 给没写 size 的 AkItem */
provide(itemListKey, { size: "sm" });
</script>

<template>
  <span class="ak-materials__label"><slot name="label">{{ label }}</slot></span>
  <span class="ak-item-list"><slot /></span>
</template>
