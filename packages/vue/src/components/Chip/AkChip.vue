<script setup lang="ts">
/**
 * 可交互的筛选芯片（= Naive 的 NTag checkable）：一个开关按钮，点一下选中 / 取消，aria-pressed 报状态。
 * 选中 = 主色实底 + 左上角三角角标（同 .ak-tab / .ak-card 的选中角标）。
 * data-no-toggle：皮肤 / 预览脚本会在 document 上把所有 .ak-chip 的 is-active / aria-pressed 翻一遍（给模板输出的纯 CSS 芯片用），
 * 状态归 Vue 管的芯片要用它退出，否则两边各翻一次、DOM 与 v-model 对不上。
 */
import type { IconName } from "../../icons";
import AkIcon from "../Icon/AkIcon.vue";

withDefaults(
  defineProps<{
    /** 文字前的图标（芯片自带 6px 间距） */
    icon?: IconName;
  }>(),
  { icon: undefined },
);

/** 是否选中（= Naive 的 checked）；点击切换 */
const checked = defineModel<boolean>({ default: false });

defineSlots<{
  /** 芯片文字 */
  default?: () => unknown;
}>();
</script>

<template>
  <button type="button" :class="['ak-chip', { 'is-active': checked }]" :aria-pressed="checked" data-no-toggle @click="checked = !checked">
    <AkIcon v-if="icon" :name="icon" :size="14" />
    <slot />
  </button>
</template>
