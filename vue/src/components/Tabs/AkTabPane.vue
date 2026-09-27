<script setup lang="ts">
/**
 * 一个页签 + 它的面板（= Naive 的 NTabPane），只能直接放在 AkTabs 里。
 * AkTabs 读它的 name / tab / disabled / #tab 画页签，再把它渲染成面板（id、aria-labelledby、hidden 由 AkTabs 补上）。
 */
defineProps<{
  /** 标识，= AkTabs 的 v-model 值 */
  name: string | number;
  /** 页签文字；要第二行小字（「信赖 25%」）或图标时改用 #tab 插槽 */
  tab?: string;
  /** 禁用：页签不可选，方向键跳过 */
  disabled?: boolean;
  /** 面板渲染方式（同 Naive）：if 只渲染当前页（默认）· show 全部渲染、非当前页 hidden · show:lazy 第一次切到时渲染，之后保留 */
  displayDirective?: "if" | "show" | "show:lazy";
}>();

defineSlots<{
  /** 面板内容 */
  default?: () => unknown;
  /** 页签内容（代替 tab） */
  tab?: () => unknown;
}>();
</script>

<template>
  <div class="ak-tabpanel" role="tabpanel" tabindex="0"><slot /></div>
</template>
