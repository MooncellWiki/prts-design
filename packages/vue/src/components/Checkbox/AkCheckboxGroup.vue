<script setup lang="ts">
import { provide } from "vue";

import { useField } from "../Field/context";
import { checkboxGroupKey, type CheckSize, type CheckValue } from "./context";

/** 一组复选框（同 Naive 的 NCheckboxGroup）：v-model 是勾上的 value 数组。role="group"，组名来自 AkField 的标签或 label */
const props = withDefaults(
  defineProps<{
    /** 整组禁用 */
    disabled?: boolean;
    /** 最多勾几个：选满后没勾的变成禁用（公开招募最多选 3 个标签） */
    max?: number;
    /** 最少勾几个：到了之后勾着的不能再取消 */
    min?: number;
    /** 组内勾选框的尺寸 */
    size?: CheckSize;
    /** 竖排（默认横排、放不下换行） */
    vertical?: boolean;
    /** 读屏用的组名（aria-label）；放在带标签的 AkField 里时不用写 */
    label?: string;
  }>(),
  { max: undefined, min: undefined, size: undefined, label: undefined },
);

/** 勾上的 value 数组 */
const model = defineModel<CheckValue[]>({ default: () => [] });

defineSlots<{
  /** 若干 AkCheckbox（各写 value） */
  default?: () => unknown;
}>();

const field = useField("group");

provide(checkboxGroupKey, {
  get value() {
    return model.value;
  },
  get disabled() {
    return props.disabled;
  },
  get size() {
    return props.size;
  },
  get full() {
    return props.max !== undefined && model.value.length >= props.max;
  },
  get atMin() {
    return props.min !== undefined && model.value.length <= props.min;
  },
  toggle(value, checked) {
    const rest = model.value.filter(v => v !== value);
    model.value = checked ? [...rest, value] : rest;
  },
});
</script>

<template>
  <div :class="['ak-check-group', { 'ak-check-group--vertical': vertical }]" role="group" :aria-label="label" v-bind="field.attrs.value">
    <slot />
  </div>
</template>
