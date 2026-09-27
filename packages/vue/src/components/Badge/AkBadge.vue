<script setup lang="ts">
/**
 * 计数徽标 / 未读点（= Naive 的 NBadge）。默认插槽写了内容时，徽标骑在它右上角（.ak-badge-wrap）；不写就是一枚行内徽标。
 * 默认黄（次强调「提示」）：未读数不是高危信息，红只给回退 / 权限变更这类 alerts；NEW 角标是 AkTag variant="new"，不是徽标。
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 数字或短串；数字为 0 时默认不显示（见 showZero） */
    value?: number | string;
    /** 封顶：value 按数字大于它时显示「max+」（99+） */
    max?: number;
    /** 圆点：不显示数字，只提示「有新的」 */
    dot?: boolean;
    /** 是否显示徽标（同 Naive）；false 时只剩包住的内容 */
    show?: boolean;
    /** value 为 0 时也显示 */
    showZero?: boolean;
    /** 颜色：default 黄（未读计数 / 点）· accent 主色 · danger 红（只给回退 / 权限变更这类 alerts） */
    variant?: "default" | "accent" | "danger";
    /** 读屏文本（「3 条未读通知」）：写了就把数字对读屏隐藏、改念这句；圆点徽标一定要写 */
    label?: string;
  }>(),
  { value: undefined, max: undefined, show: true, variant: "default", label: undefined },
);

defineSlots<{
  /** 被标记的内容（头像、图标按钮…）：徽标骑在它右上角；不写就是独立的行内徽标 */
  default?: () => unknown;
}>();

const visible = computed(() => {
  if (!props.show) return false;
  if (props.dot) return true;
  if (props.value === undefined || props.value === "") return false;
  return props.showZero || !(Number(props.value) <= 0);
});

const text = computed(() => {
  if (props.dot) return "";
  const v = props.value;
  return props.max !== undefined && Number(v) > props.max ? `${props.max}+` : String(v ?? "");
});

const classes = computed(() => [
  "ak-badge",
  props.variant !== "default" && `ak-badge--${props.variant}`,
  { "ak-badge--dot": props.dot },
]);
</script>

<template>
  <span v-if="$slots.default" class="ak-badge-wrap">
    <slot />
    <span v-if="visible" :class="classes">
      <template v-if="label"><span v-if="text" aria-hidden="true">{{ text }}</span><span class="ak-sr-only">{{ label }}</span></template>
      <template v-else>{{ text }}</template>
    </span>
  </span>
  <span v-else-if="visible" :class="classes">
    <template v-if="label"><span v-if="text" aria-hidden="true">{{ text }}</span><span class="ak-sr-only">{{ label }}</span></template>
    <template v-else>{{ text }}</template>
  </span>
</template>
