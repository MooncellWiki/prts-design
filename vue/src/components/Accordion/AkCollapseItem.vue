<script setup lang="ts">
import { computed, inject, nextTick, ref, useId, useTemplateRef } from "vue";

import { collapseKey, type CollapseName } from "./context";

/**
 * 折叠面板的一项（= Naive 的 NCollapseItem）：原生 <details class="ak-details"> + <summary> + .ak-details__body。
 * 开合交给浏览器（点击 / Enter / 空格，页内查找命中时自动展开），toggle 事件里同步回 AkCollapse 的 v-model；
 * <summary> 自带按钮语义与展开状态，不另加 aria-expanded。单独用（不放在 AkCollapse 里）时自己记开合。
 */
const props = defineProps<{
  /** 标识，= AkCollapse 的 v-model 数组里的值；不写时自动生成（只能靠点击开合） */
  name?: CollapseName;
  /** 标题；要放图标 / 标签时改用 #header 插槽 */
  title?: string;
}>();

defineSlots<{
  /** 标题（代替 title） */
  header?: () => unknown;
  /** 展开后的内容（正文排版照常生效） */
  default?: () => unknown;
}>();

const id = useId();
const key = computed(() => props.name ?? id);
const group = inject(collapseKey, null);
const local = ref(false);
const open = computed(() => (group ? group.isOpen(key.value) : local.value));

const el = useTemplateRef<HTMLDetailsElement>("el");
function onToggle() {
  const now = el.value!.open;
  if (now === open.value) return;
  if (group) group.set(key.value, now);
  else local.value = now;
  // v-model 没接住（绑了固定值、不更新）时把 DOM 拨回去，保持与状态一致
  nextTick(() => {
    if (el.value && el.value.open !== open.value) el.value.open = open.value;
  });
}
</script>

<template>
  <details ref="el" class="ak-details" :open="open" @toggle="onToggle">
    <summary :id="`${id}-head`" :aria-controls="`${id}-body`"><slot name="header">{{ title }}</slot></summary>
    <div :id="`${id}-body`" class="ak-details__body"><slot /></div>
  </details>
</template>
