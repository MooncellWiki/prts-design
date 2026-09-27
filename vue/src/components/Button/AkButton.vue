<script setup lang="ts">
import { computed, inject, warn } from "vue";

import type { IconName } from "../../icons";
import AkIcon from "../Icon/AkIcon.vue";
import { buttonGroupKey, type ButtonSize, type ButtonVariant } from "./context";

const props = withDefaults(
  defineProps<{
    /** 外观：primary = 主色实底（一处一枚）· contrast = 黑白反转（游戏内 btn_on）· outline 描边 · ghost 幽灵 · danger 危险 · link 链接样式 */
    variant?: ButtonVariant;
    /** 尺寸：xs 24 · sm 30 · md 36 · lg 44 · xl 56（px 高）；不写时跟 AkButtonGroup，再不然是 md */
    size?: ButtonSize;
    /** 图标；没有文字（不写默认插槽）时是方形的图标按钮，这时 label 必填 */
    icon?: IconName;
    /** 图标在文字左边还是右边（同 Naive 的 icon-placement） */
    iconPlacement?: "left" | "right";
    /** 可访问名（aria-label；图标按钮同时作 title）——只有图标的按钮必填，有文字的一般不写 */
    label?: string;
    /** 占满容器宽度 */
    block?: boolean;
    /** 胶囊圆角（系统默认直角，只在确需时用） */
    pill?: boolean;
    /** 危险按钮叠斜纹（只配 variant="danger"） */
    stripes?: boolean;
    /** 加载中：文字隐去，居中转圈，不可点 */
    loading?: boolean;
    disabled?: boolean;
    /** 有 href 时渲染成 <a>（禁用时 aria-disabled） */
    href?: string;
    type?: "button" | "submit" | "reset";
  }>(),
  { variant: "default", size: undefined, icon: undefined, iconPlacement: "left", label: undefined, href: undefined, type: "button" },
);

const slots = defineSlots<{
  /** 按钮文字；不写就是图标按钮 */
  default?: () => unknown;
}>();

const group = inject(buttonGroupKey, null);
const size = computed(() => props.size ?? group?.size ?? "md");
const iconOnly = computed(() => !!props.icon && !slots.default);
if (iconOnly.value && !props.label) warn(`AkButton：只有图标（${props.icon}）的按钮要写 label，否则读屏只念「按钮」`);

/** 图标按钮里的图标边长；有文字时由 .ak-btn__icon 的 1.1em 定 */
const ICON_PX: Record<ButtonSize, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 };

const classes = computed(() => [
  "ak-btn",
  props.variant !== "default" && `ak-btn--${props.variant}`,
  size.value !== "md" && `ak-btn--${size.value}`,
  {
    "ak-btn--icon": iconOnly.value,
    "ak-btn--block": props.block,
    "ak-btn--pill": props.pill,
    "ak-stripes": props.stripes,
    "is-loading": props.loading,
  },
]);
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :class="classes"
    :href="href && !disabled ? href : undefined"
    :type="href ? undefined : type"
    :disabled="href ? undefined : disabled"
    :aria-disabled="(href && disabled) || undefined"
    :aria-busy="loading || undefined"
    :aria-label="label"
    :title="iconOnly ? label : undefined"
  >
    <AkIcon v-if="iconOnly" :name="icon!" :size="ICON_PX[size]" />
    <template v-else>
      <AkIcon v-if="icon && iconPlacement === 'left'" :name="icon" class="ak-btn__icon" />
      <slot />
      <AkIcon v-if="icon && iconPlacement === 'right'" :name="icon" class="ak-btn__icon" />
    </template>
  </component>
</template>
