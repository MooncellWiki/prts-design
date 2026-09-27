<script setup lang="ts">
/**
 * 文字提示（同 Naive 的 NTooltip）：#trigger 里放触发元素，默认插槽是提示内容。
 * 与纯 CSS 的 [data-ak-tip] 分工：那个只是属性里的一句字符串、只能在上方、没有 JS（模板 / AkItem 的 tip 用它）；
 * 这个能放任意内容、四个方向、点击 / 手动触发，触发元素带 aria-describedby，Esc 可关。
 */
import { useId, useTemplateRef, type VNode } from "vue";

import { Render, decorateTrigger } from "./trigger";
import { usePopover, type PopoverPlacement, type PopoverTrigger } from "./usePopover";

const props = withDefaults(
  defineProps<{
    /** 出现在触发元素的哪一边：top（默认）· bottom · left · right；-start / -end 与触发元素左 / 右缘对齐。不自动翻转，贴边的触发元素自己选 */
    placement?: PopoverPlacement;
    /** 触发方式：hover 悬停 + 键盘聚焦（默认）· focus 只看聚焦 · click 点击开合 · manual 只由 v-model 控制 */
    trigger?: PopoverTrigger;
    /** 悬停多久后出现（ms） */
    delay?: number;
    /** 移开多久后消失（ms）；这段时间里鼠标能移进提示里 */
    duration?: number;
    /** 禁用：不再出现 */
    disabled?: boolean;
  }>(),
  { placement: "top", trigger: "hover", delay: 100, duration: 100 },
);

/** 是否显示；不绑定时由 trigger 决定 */
const model = defineModel<boolean>({ default: false });

const slots = defineSlots<{
  /** 触发元素：取第一个元素 / 组件；只有文字时自动包一层 <span>，不可聚焦的元素自动补 tabindex="0" */
  trigger?: () => VNode[];
  /** 提示内容（短句；较长的解释会在 280px 处折行） */
  default?: () => unknown;
}>();

const id = useId();
const anchor = useTemplateRef<HTMLElement>("anchor");
const { open, anchorOn, onTriggerClick } = usePopover(props, model, anchor);
</script>

<template>
  <span ref="anchor" class="ak-tip-anchor" v-on="anchorOn">
    <Render :content="decorateTrigger(slots.trigger?.(), { 'aria-describedby': id, onClick: onTriggerClick })" />
    <span :id="id" role="tooltip" :class="['ak-tooltip', `ak-tooltip--${placement}`]" :hidden="!open"><slot /></span>
  </span>
</template>
