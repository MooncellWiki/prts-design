<script setup lang="ts">
import { computed } from "vue";

import { useField, type ValidationStatus } from "../Field/context";

export type SelectValue = string | number;
/** 一个选项（同 Naive 的 SelectOption） */
export interface SelectOption {
  label: string;
  value: SelectValue;
  disabled?: boolean;
}
/** 一组选项，渲染成 <optgroup>（同 Naive 的 SelectGroupOption） */
export interface SelectGroupOption {
  type: "group";
  label: string;
  children: SelectOption[];
}

/** 原生 <select> 换肤（与裸 <select> 同一枚 ▾）：下拉列表、键盘、读屏都是浏览器自己的。其余属性（name、@change …）落到 <select> 上 */
const props = withDefaults(
  defineProps<{
    /** 选项（同 Naive 的 options）：{ label, value, disabled }；{ type: "group", label, children } 是一组（<optgroup>） */
    options: (SelectOption | SelectGroupOption)[];
    /** 没选时显示的提示（一个选不到的空选项）；不写则默认选中第一项的样子 */
    placeholder?: string;
    /** 尺寸：sm 30 · md 36 · lg 44（px 高），与输入框同一刻度 */
    size?: "sm" | "md" | "lg";
    /** 校验状态：error 红边（aria-invalid）· success 绿边；不写时跟 AkField 的 validation-status */
    status?: ValidationStatus;
    /** 禁用 */
    disabled?: boolean;
    /** 可访问名（aria-label）：不在 AkField 里、旁边也没有 <label> 时必填 */
    label?: string;
  }>(),
  { placeholder: undefined, size: "md", status: undefined, label: undefined },
);

/** 选中项的 value；没选是 null / undefined */
const model = defineModel<SelectValue | null>();

const field = useField();
const status = computed(() => props.status ?? field.status.value);
/** 没选时落到 placeholder 那个空选项上（它的 value 是 null） */
const current = computed({
  get: () => model.value ?? null,
  set: v => (model.value = v),
});

const isGroup = (o: SelectOption | SelectGroupOption): o is SelectGroupOption => "type" in o && o.type === "group";
</script>

<template>
  <select
    v-model="current"
    v-bind="field.attrs.value"
    :class="['ak-select', size !== 'md' && `ak-select--${size}`, { 'is-valid': status === 'success' }]"
    :disabled="disabled"
    :required="field.required.value || undefined"
    :aria-invalid="status === 'error' || undefined"
    :aria-label="label"
  >
    <option v-if="placeholder" :value="null" disabled hidden>{{ placeholder }}</option>
    <template v-for="o in options" :key="isGroup(o) ? `g:${o.label}` : o.value">
      <optgroup v-if="isGroup(o)" :label="o.label">
        <option v-for="c in o.children" :key="c.value" :value="c.value" :disabled="c.disabled">{{ c.label }}</option>
      </optgroup>
      <option v-else :value="o.value" :disabled="o.disabled">{{ o.label }}</option>
    </template>
  </select>
</template>
