<script setup lang="ts">
import { computed, inject, onMounted, onUpdated, useTemplateRef, warn } from "vue";

import { useField, useSplitAttrs } from "../Field/context";
import { checkboxGroupKey, type CheckSize, type CheckValue } from "./context";

/** class / style 给外层 <label>，其余属性（name、@change …）给原生 <input type="checkbox"> */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 在 AkCheckboxGroup 里的取值：勾上时进组的 v-model 数组 */
    value?: CheckValue;
    /** 半选（一横）：「全选」框在部分子项勾上时用。只管外观与读屏的「部分选中」，点击照常切换 */
    indeterminate?: boolean;
    /** 禁用 */
    disabled?: boolean;
    /** 尺寸：sm 16px 框（表头里的开关）· md 18px；不写时跟 AkCheckboxGroup */
    size?: CheckSize;
    /** 可访问名（aria-label）：不写文字（默认插槽）时必填 */
    label?: string;
  }>(),
  { value: undefined, size: undefined, label: undefined },
);

/** 单独用时是否勾上；放在 AkCheckboxGroup 里时由组的 v-model 决定，不用绑 */
const model = defineModel<boolean>({ default: false });

const slots = defineSlots<{
  /** 文字 */
  default?: () => unknown;
}>();

const group = inject(checkboxGroupKey, null);
const inGroup = computed(() => !!group && props.value !== undefined);
const checked = computed(() => (inGroup.value ? group!.value.includes(props.value!) : model.value));
const disabled = computed(
  () => props.disabled || !!group?.disabled || (inGroup.value && (checked.value ? group!.atMin : group!.full)),
);
const size = computed(() => props.size ?? group?.size ?? "md");

const field = useField();
const attrs = useSplitAttrs();
if (!slots.default && !props.label && !field.attrs.value.id) warn("AkCheckbox：没有文字的勾选框要写 label，否则读屏只念「复选框」");

function onChange(e: Event) {
  const c = (e.target as HTMLInputElement).checked;
  if (inGroup.value) group!.toggle(props.value!, c);
  else model.value = c;
}

/** checked / indeterminate 是 DOM 属性：点击会先改掉 DOM，父组件没接受（或仍是半选）时 vnode 没变、Vue 不会补写，这里每次渲染后对齐 */
const input = useTemplateRef<HTMLInputElement>("input");
const sync = () => {
  if (!input.value) return;
  input.value.checked = checked.value;
  input.value.indeterminate = props.indeterminate;
};
onMounted(sync);
onUpdated(sync);
</script>

<template>
  <label v-bind="attrs.root.value" :class="['ak-check', size === 'sm' && 'ak-check--sm', { 'is-disabled': disabled }]">
    <input
      ref="input"
      type="checkbox"
      v-bind="{ ...field.attrs.value, ...attrs.control.value }"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :aria-label="label"
      @change="onChange"
    />
    <slot />
  </label>
</template>
