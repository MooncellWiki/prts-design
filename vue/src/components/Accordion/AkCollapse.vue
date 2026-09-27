<script setup lang="ts">
import { provide } from "vue";

import { collapseKey, type CollapseName } from "./context";

/**
 * 折叠面板组（= Naive 的 NCollapse；CSS 叫 Accordion / .ak-details）：放若干 AkCollapseItem，每项是一个原生 <details>。
 * 本身不输出类名，只是个容器；开合状态收在 v-model 里，accordion 时同一时间只开一项。
 */
const props = defineProps<{
  /** 手风琴：同一时间只展开一项（展开一项时收起其他） */
  accordion?: boolean;
}>();

/** 展开项的 name 数组 */
const expanded = defineModel<CollapseName[]>({ default: () => [] });

defineSlots<{
  /** 若干 AkCollapseItem */
  default?: () => unknown;
}>();

provide(collapseKey, {
  isOpen: name => expanded.value.includes(name),
  set(name, open) {
    const rest = expanded.value.filter(n => n !== name);
    expanded.value = open ? (props.accordion ? [name] : [...rest, name]) : rest;
  },
});

/** ↑ / ↓ / Home / End 在各项标题间移动焦点（WAI-ARIA Accordion 的可选键盘支持）；Enter / 空格开合是 <summary> 自带的 */
function onKey(e: KeyboardEvent) {
  const t = e.target as HTMLElement;
  if (t.tagName !== "SUMMARY") return;
  const heads = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(":scope > details > summary")];
  const i = heads.indexOf(t);
  if (i < 0) return;
  const to =
    e.key === "ArrowDown" ? heads[(i + 1) % heads.length]
    : e.key === "ArrowUp" ? heads[(i - 1 + heads.length) % heads.length]
    : e.key === "Home" ? heads[0]
    : e.key === "End" ? heads.at(-1)
    : undefined;
  if (!to) return;
  e.preventDefault();
  to.focus();
}
</script>

<template>
  <div @keydown="onKey"><slot /></div>
</template>
