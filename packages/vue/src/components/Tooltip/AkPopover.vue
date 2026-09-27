<script setup lang="ts">
/**
 * 弹出卡片（同 Naive 的 NPopover）：比 AkTooltip 大、白底、顶边主色条，能放标题、段落、链接、道具。
 * 默认点击开合（里面常有可点的东西，悬停弹出的卡片键盘用户够不着）；点外面 / Esc 关，焦点在卡片里时还给触发元素。
 */
import { computed, useId, useTemplateRef, type VNode } from "vue";

import { Render, decorateTrigger } from "./trigger";
import { usePopover, type PopoverPlacement, type PopoverTrigger } from "./usePopover";

const props = withDefaults(
  defineProps<{
    /** 标题（粗体一行）；也可以用 #header 插槽 */
    title?: string;
    /** 出现在触发元素的哪一边：bottom（默认）· top · left · right；-start / -end 与触发元素左 / 右缘对齐。不自动翻转，贴边的触发元素自己选 */
    placement?: PopoverPlacement;
    /** 触发方式：click 点击开合（默认）· hover 悬停 + 键盘聚焦 · focus 只看聚焦 · manual 只由 v-model 控制 */
    trigger?: PopoverTrigger;
    /** hover 模式：悬停多久后出现（ms） */
    delay?: number;
    /** hover 模式：移开多久后消失（ms）；这段时间里鼠标能移进卡片里 */
    duration?: number;
    /** 禁用：不再弹出 */
    disabled?: boolean;
  }>(),
  { title: undefined, placement: "bottom", trigger: "click", delay: 100, duration: 100 },
);

/** 是否显示；不绑定时由 trigger 决定 */
const model = defineModel<boolean>({ default: false });

const slots = defineSlots<{
  /** 触发元素：取第一个元素 / 组件；只有文字时自动包一层 <span>，不可聚焦的元素自动补 tabindex="0" */
  trigger?: () => VNode[];
  /** 卡片正文 */
  default?: () => unknown;
  /** 标题行（代替 title） */
  header?: () => unknown;
}>();

const id = useId();
const anchor = useTemplateRef<HTMLElement>("anchor");
const { open, anchorOn, onTriggerClick } = usePopover(props, model, anchor);

/** 点击打开的是非模态对话框（触发元素 aria-expanded / aria-controls）；悬停 / 聚焦打开的等同富文本提示（aria-describedby） */
const isDialog = computed(() => props.trigger === "click" || props.trigger === "manual");
const triggerAttrs = computed(() =>
  isDialog.value
    ? { "aria-haspopup": "dialog", "aria-expanded": open.value, "aria-controls": id, onClick: onTriggerClick }
    : { "aria-describedby": id, onClick: onTriggerClick },
);
</script>

<template>
  <span ref="anchor" class="ak-tip-anchor" v-on="anchorOn">
    <Render :content="decorateTrigger(slots.trigger?.(), triggerAttrs)" />
    <div
      :id="id"
      :role="isDialog ? 'dialog' : 'tooltip'"
      :aria-labelledby="isDialog && (title || $slots.header) ? `${id}-title` : undefined"
      :class="['ak-popover', `ak-popover--${placement}`]"
      :hidden="!open"
    >
      <div v-if="title || $slots.header" :id="`${id}-title`" class="ak-popover__title"><slot name="header">{{ title }}</slot></div>
      <slot />
    </div>
  </span>
</template>
