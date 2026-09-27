<script setup lang="ts">
import { computed, h, inject, type FunctionalComponent } from "vue";

import { useField, type ValidationStatus } from "../Field/context";
import { inputGroupKey, type InputSize } from "./context";

/** 其余属性（name、autocomplete、@focus / @blur / @keydown …）都落到原生 <input> / <textarea> 上 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 类型：textarea 渲染多行 <textarea class="ak-textarea">（同 Naive）；其余是 <input> 的 type。数字用 AkInputNumber，搜索用 AkSearch */
    type?: "text" | "textarea" | "password" | "email" | "url" | "tel";
    /** 占位提示（只做提示，不承载必填等信息） */
    placeholder?: string;
    /** 尺寸：sm 30 · md 36 · lg 44（px 高），与按钮同一刻度；多行输入不适用。不写时跟 AkInputGroup，再不然是 md */
    size?: InputSize;
    /** 校验状态：error 红边（aria-invalid）· success 绿边；不写时跟 AkField 的 validation-status */
    status?: ValidationStatus;
    /** 禁用 */
    disabled?: boolean;
    /** 只读：下沉底色，仍可选中复制——计算器「只显示不编辑」的结果用它，不要用 disabled */
    readonly?: boolean;
    /** 最多字数（原生 maxlength） */
    maxlength?: number;
    /** 多行输入的可见行数（原生 rows）；不写时由 CSS 的最小高 90px 定 */
    rows?: number;
    /** 可访问名（aria-label）：不在 AkField 里、旁边也没有 <label> 时必填 */
    label?: string;
  }>(),
  { type: "text", placeholder: undefined, size: undefined, status: undefined, maxlength: undefined, rows: undefined, label: undefined },
);

/** 输入的文字 */
const model = defineModel<string>();

const slots = defineSlots<{
  /** 前缀（输入框左边的 .ak-input-group__addon，如「wiki/」）；多行输入不适用 */
  prefix?: () => unknown;
  /** 后缀（输入框右边的 .ak-input-group__addon，如单位「%」）；多行输入不适用 */
  suffix?: () => unknown;
}>();

const group = inject(inputGroupKey, null);
const field = useField();
const size = computed(() => props.size ?? group?.size ?? "md");
const status = computed(() => props.status ?? field.status.value);

/** 有前后缀时包一层 .ak-input-group；已经在 AkInputGroup 里就直接作为组的子项输出（CSS 是 .ak-input-group > .ak-input） */
const Wrap: FunctionalComponent<{ bare: boolean }> = (p, { slots: s }) =>
  p.bare ? s.default?.() : h("div", { class: "ak-input-group" }, s.default?.());
const bare = computed(() => !!group || !(slots.prefix || slots.suffix));

const common = computed(() => ({
  ...field.attrs.value,
  placeholder: props.placeholder,
  disabled: props.disabled,
  readonly: props.readonly,
  maxlength: props.maxlength,
  required: field.required.value || undefined,
  "aria-invalid": status.value === "error" || undefined,
  "aria-label": props.label,
}));
</script>

<template>
  <textarea
    v-if="type === 'textarea'"
    v-model="model"
    v-bind="{ ...common, ...$attrs }"
    :class="['ak-textarea', { 'is-valid': status === 'success' }]"
    :rows="rows"
  />
  <Wrap v-else :bare="bare">
    <span v-if="$slots.prefix" class="ak-input-group__addon"><slot name="prefix" /></span>
    <input
      v-model="model"
      :type="type"
      v-bind="{ ...common, ...$attrs }"
      :class="['ak-input', size !== 'md' && `ak-input--${size}`, { 'is-valid': status === 'success' }]"
    />
    <span v-if="$slots.suffix" class="ak-input-group__addon"><slot name="suffix" /></span>
  </Wrap>
</template>
