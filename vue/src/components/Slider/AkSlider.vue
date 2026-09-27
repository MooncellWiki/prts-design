<script setup lang="ts">
import { computed } from "vue";

import { useField } from "../Field/context";

/**
 * 滑杆（同 Naive 的 NSlider）：原生 <input type="range" class="ak-slider">，方形滑块、4px 轨道。
 * 键盘（←→↑↓ 一步、PageUp/PageDown、Home/End）和读屏都是浏览器自己的。其余属性落到 <input> 上。
 */
const props = withDefaults(
  defineProps<{
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 步长 */
    step?: number;
    /** 禁用 */
    disabled?: boolean;
    /** 可访问名（aria-label）：不在 AkField 里、旁边也没有 <label> 时必填 */
    label?: string;
    /** 读屏念的值（aria-valuetext），如 v => `信赖 ${v}%`；不写就念数字 */
    formatValue?: (value: number) => string;
  }>(),
  { min: 0, max: 100, step: 1, label: undefined, formatValue: undefined },
);

/** 当前值 */
const model = defineModel<number>();

const field = useField();
const valueText = computed(() => (props.formatValue && model.value !== undefined ? props.formatValue(model.value) : undefined));
</script>

<template>
  <input
    v-model.number="model"
    type="range"
    class="ak-slider"
    v-bind="field.attrs.value"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :aria-label="label"
    :aria-valuetext="valueText"
  />
</template>
