<script setup lang="ts">
import { provide, reactive, useId } from "vue";

import { fieldKey, type FieldContext, type ValidationStatus } from "./context";

/** 表单字段：标签 + 控件 + 说明 / 校验文案（同 Naive 的 NFormItem）。字段里的 AkInput / AkSelect … 自动拿到 id、aria-describedby、aria-invalid */
const props = withDefaults(
  defineProps<{
    /** 标签文字：渲染成 <label for>，指向字段里的第一个控件（= 控件的可访问名）；复选组 / 单选组改由组 aria-labelledby 指向它 */
    label?: string;
    /** 必填：标签后出红色 *（读屏不念，控件自己带 required） */
    required?: boolean;
    /** 说明或校验文案（.ak-help），经 aria-describedby 关联到控件；validation-status="error" 时是红字 */
    feedback?: string;
    /** 校验状态（同 Naive 的 validation-status）：error = 红边 + 红字文案 + aria-invalid · success = 绿边 */
    validationStatus?: ValidationStatus;
  }>(),
  { label: undefined, feedback: undefined, validationStatus: undefined },
);

const slots = defineSlots<{
  /** 控件；自己写的原生控件用插槽参数里的 id 对上标签 */
  default?: (props: { id: string }) => unknown;
  /** 标签内容（代替 label，要放链接 / 图标时用） */
  label?: () => unknown;
  /** 说明 / 校验文案（代替 feedback） */
  feedback?: () => unknown;
}>();

const id = useId();
const ctx: FieldContext = reactive({
  id: `${id}-control`,
  labelId: `${id}-label`,
  helpId: `${id}-help`,
  get hasLabel() {
    return !!(props.label || slots.label);
  },
  get hasHelp() {
    return !!(props.feedback || slots.feedback);
  },
  get status() {
    return props.validationStatus;
  },
  get required() {
    return props.required;
  },
  owner: null,
});
provide(fieldKey, ctx);
</script>

<template>
  <div :class="['ak-field', { 'is-invalid': validationStatus === 'error' }]">
    <label v-if="ctx.hasLabel" :id="ctx.labelId" class="ak-label" :for="ctx.owner === 'group' ? undefined : ctx.id">
      <slot name="label">{{ label }}</slot>
      <template v-if="required">{{ " " }}<span class="req" aria-hidden="true">*</span></template>
    </label>
    <slot :id="ctx.id" />
    <div v-if="ctx.hasHelp" :id="ctx.helpId" :class="['ak-help', { 'ak-help--error': validationStatus === 'error' }]">
      <slot name="feedback">{{ feedback }}</slot>
    </div>
  </div>
</template>
