<script setup lang="ts">
import { warn } from "vue";

import { useField, useSplitAttrs } from "../Field/context";

/**
 * 开关（同 Naive 的 NSwitch）：方形轨道，开 = 游戏内 toggle_on 蓝。原生 <input type="checkbox" role="switch">，
 * 读屏念「开关，开 / 关」，Space 切换。class / style 给外层 <label>，其余属性给 <input>。
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 禁用 */
    disabled?: boolean;
    /** 尺寸：sm 32 × 18（标题栏旁、表头里）· md 40 × 22 */
    size?: "sm" | "md";
    /** 可访问名（aria-label）：没有默认插槽的文字、也不在带标签的 AkField 里时必填 */
    label?: string;
  }>(),
  { size: "md", label: undefined },
);

/** 是否打开 */
const model = defineModel<boolean>({ default: false });

const slots = defineSlots<{
  /** 开关的名称（「显示潜能加成」）——就是它的可访问名，开 / 关时不变 */
  default?: () => unknown;
  /** 打开时名称后面的状态文字（同 Naive 的 #checked）；只给眼睛看，读屏已经念「开」 */
  checked?: () => unknown;
  /** 关闭时名称后面的状态文字（同 Naive 的 #unchecked） */
  unchecked?: () => unknown;
}>();

const field = useField();
const attrs = useSplitAttrs();
if (!slots.default && !props.label && !field.attrs.value.id) warn("AkSwitch：没有名称文字的开关要写 label，否则读屏只念「开关」");
</script>

<template>
  <label v-bind="attrs.root.value" :class="['ak-switch', size === 'sm' && 'ak-switch--sm', { 'is-disabled': disabled }]">
    <input
      v-model="model"
      type="checkbox"
      role="switch"
      v-bind="{ ...field.attrs.value, ...attrs.control.value }"
      :disabled="disabled"
      :aria-label="label"
    />
    <span v-if="$slots.default"><slot /></span>
    <span v-if="model ? $slots.checked : $slots.unchecked" aria-hidden="true"><slot :name="model ? 'checked' : 'unchecked'" /></span>
  </label>
</template>
