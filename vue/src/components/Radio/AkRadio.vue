<script setup lang="ts">
import { computed, inject, warn } from "vue";

import { useField, useSplitAttrs } from "../Field/context";
import { radioGroupKey, type RadioValue } from "./context";

/** class / style 给外层 <label>，其余属性给原生 <input type="radio"> */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 这一项的值：选中时成为 v-model（或所在 AkRadioGroup 的 v-model）的值 */
    value: RadioValue;
    /** 禁用 */
    disabled?: boolean;
    /** 尺寸：sm 16px 圆 · md 18px；不写时跟 AkRadioGroup（lg 对单选圆点不起作用） */
    size?: "sm" | "md";
    /** 原生 name：同名的单选互斥、方向键在其间移动；放在 AkRadioGroup 里时由组统一给 */
    name?: string;
    /** 可访问名（aria-label）：不写文字（默认插槽）时必填 */
    label?: string;
  }>(),
  { size: undefined, name: undefined, label: undefined },
);

/** 单独用时 = 选中项的值（同原生 <input type="radio" v-model>）；放在 AkRadioGroup 里时由组的 v-model 决定，不用绑 */
const model = defineModel<RadioValue>();

const slots = defineSlots<{
  /** 文字 */
  default?: () => unknown;
}>();

const group = inject(radioGroupKey, null);
const checked = computed(() => (group ? group.value : model.value) === props.value);
const disabled = computed(() => props.disabled || !!group?.disabled);
const size = computed(() => props.size ?? group?.size);

const field = useField();
const attrs = useSplitAttrs();
if (!slots.default && !props.label && !field.attrs.value.id) warn("AkRadio：没有文字的单选要写 label，否则读屏只念「单选按钮」");

function onChange() {
  if (group) group.select(props.value);
  else model.value = props.value;
}
</script>

<template>
  <label v-bind="attrs.root.value" :class="['ak-check', size === 'sm' && 'ak-check--sm', { 'is-disabled': disabled }]">
    <input
      type="radio"
      v-bind="{ ...field.attrs.value, ...attrs.control.value }"
      :name="group?.name ?? name"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :aria-label="label"
      @change="onChange"
    />
    <slot />
  </label>
</template>
