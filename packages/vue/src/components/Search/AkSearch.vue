<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useTemplateRef } from "vue";

import { useField, useSplitAttrs } from "../Field/context";
import AkIcon from "../Icon/AkIcon.vue";

/**
 * 搜索框：左侧放大镜 + <input type="search" class="ak-input">（+ 右侧快捷键键帽），同页眉里无 JS 时的搜索表单。
 * 站点级搜索外面包 <form role="search">；页内筛选直接用。class / style / data-ak-tip 给外层 .ak-search，其余属性给 <input>。
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 占位提示 */
    placeholder?: string;
    /** 尺寸：sm 30 · md 36 · lg 44（px 高） */
    size?: "sm" | "md" | "lg";
    /** 禁用 */
    disabled?: boolean;
    /** 可访问名（aria-label）；在带标签的 AkField 里时由标签给，否则默认「搜索」 */
    label?: string;
    /** 聚焦快捷键（单个按键，如 "/"）：右侧显示键帽（有字时隐去），在页面上别处按下它就聚焦到这里（正在别的输入框里打字时不抢） */
    shortcut?: string;
  }>(),
  { placeholder: undefined, size: "md", label: undefined, shortcut: undefined },
);

/** 搜索词 */
const model = defineModel<string>();

const emit = defineEmits<{
  /** 在输入框里按了回车 */
  search: [query: string];
}>();

const field = useField();
const attrs = useSplitAttrs();
const name = computed(() => props.label ?? (field.attrs.value.id ? undefined : "搜索"));

const input = useTemplateRef<HTMLInputElement>("input");
/** 监听挂在输入框所在的 document 上（文档站示例在 iframe 里，全局 document 不是它） */
let doc: Document | undefined;
function onDocKey(e: KeyboardEvent) {
  if (!props.shortcut || e.key !== props.shortcut || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  e.preventDefault();
  input.value?.focus();
}
/** 输入法选字时的回车（isComposing）不算 */
function onEnter(e: KeyboardEvent) {
  if (!e.isComposing) emit("search", model.value ?? "");
}
onMounted(() => {
  doc = input.value?.ownerDocument;
  doc?.addEventListener("keydown", onDocKey);
});
onBeforeUnmount(() => doc?.removeEventListener("keydown", onDocKey));
</script>

<template>
  <div v-bind="attrs.root.value" class="ak-search">
    <AkIcon name="search" class="ak-search__icon" />
    <input
      ref="input"
      v-model="model"
      type="search"
      v-bind="{ ...field.attrs.value, ...attrs.control.value }"
      :class="['ak-input', size !== 'md' && `ak-input--${size}`]"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-label="name"
      :aria-keyshortcuts="shortcut"
      @keydown.enter="onEnter"
    />
    <kbd v-if="shortcut && !model" class="ak-search__kbd" aria-hidden="true">{{ shortcut }}</kbd>
  </div>
</template>
