<script setup lang="ts">
import { computed, inject, warn } from "vue";

import type { IconName } from "../../icons";
import AkIcon from "../Icon/AkIcon.vue";
import { radioGroupKey, type RadioValue } from "./context";

/**
 * 按钮样式的单选（同 Naive 的 NRadioButton）：分段控件——视图切换、排序方式这类「几个里选一个、立即生效」。
 * 只能放在 AkRadioGroup 里：组渲染成 .ak-btn-group[role=radiogroup]，这一项是 .ak-btn[role=radio]，选中 .is-active（主色实底）。
 * tabindex 由组按 roving tabindex 补上（只有选中项在 Tab 顺序里），方向键由组处理。
 */
const props = withDefaults(
  defineProps<{
    /** 这一项的值：选中时成为 AkRadioGroup 的 v-model */
    value: RadioValue;
    /** 禁用：不可选，方向键跳过 */
    disabled?: boolean;
    /** 图标；不写文字（默认插槽）时是方形的图标按钮，这时 label 必填 */
    icon?: IconName;
    /** 可访问名（aria-label；图标按钮同时作 title）——只有图标时必填 */
    label?: string;
  }>(),
  { icon: undefined, label: undefined },
);

const slots = defineSlots<{
  /** 文字；不写就是图标按钮 */
  default?: () => unknown;
}>();

const group = inject(radioGroupKey, null);
if (!group) warn("AkRadioButton 要放在 AkRadioGroup 里");
const checked = computed(() => group?.value === props.value);
const disabled = computed(() => props.disabled || !!group?.disabled);
const size = computed(() => group?.size ?? "md");
const iconOnly = computed(() => !!props.icon && !slots.default);
if (iconOnly.value && !props.label) warn(`AkRadioButton：只有图标（${props.icon}）的单选按钮要写 label`);

/** 图标按钮里的图标边长（同 AkButton） */
const ICON_PX = { sm: 16, md: 18, lg: 20 } as const;
</script>

<template>
  <button
    type="button"
    role="radio"
    :class="['ak-btn', size !== 'md' && `ak-btn--${size}`, { 'ak-btn--icon': iconOnly, 'is-active': checked }]"
    :aria-checked="checked"
    :disabled="disabled"
    :aria-label="label"
    :title="iconOnly ? label : undefined"
    @click="group?.select(value)"
  >
    <AkIcon v-if="iconOnly" :name="icon!" :size="ICON_PX[size]" />
    <template v-else>
      <AkIcon v-if="icon" :name="icon" class="ak-btn__icon" />
      <slot />
    </template>
  </button>
</template>
