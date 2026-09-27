<script setup lang="ts">
/**
 * 进度（同 Naive 的 NProgress）：默认线形 .ak-progress（可带上方的标签行 .ak-progress-label），circle 是环形 .ak-ring。
 * 输出 role="progressbar" + aria-valuenow；有 label 时标签行的名字作可访问名。
 */
import { computed, useId } from "vue";

const props = withDefaults(
  defineProps<{
    /** 百分比 0–100 */
    percentage?: number;
    /** 颜色：accent 主色（默认）· yellow 黄（信赖 / 次强调）· success 绿 · danger 红 */
    variant?: "accent" | "yellow" | "success" | "danger";
    /** 线形粗细：sm 4 · md 8（默认）· lg 14（px）；环形不适用 */
    size?: "sm" | "md" | "lg";
    /** 名称：线形显示在条上方标签行的左边（并作可访问名）；环形只作可访问名（aria-label） */
    label?: string;
    /** 显示数值：默认「N%」，默认插槽可改写（「200 / 200」）；线形的数值在标签行右边，只在有 label 或插槽时出标签行 */
    showIndicator?: boolean;
    /** 斜纹（线形） */
    stripes?: boolean;
    /** 不定进度：一段色块来回滑，不报数值（线形） */
    indeterminate?: boolean;
    /** 分段：条切成 N 格，按百分比点亮（3 / 5 格 = steps 5 + percentage 60）（线形） */
    steps?: number;
    /** 环形（= .ak-ring：直径 56，中间是数值）——信赖、完成度 */
    circle?: boolean;
  }>(),
  { percentage: 0, variant: "accent", size: "md", label: undefined, showIndicator: true, steps: undefined },
);

defineSlots<{
  /** 数值文字（代替「N%」） */
  default?: () => unknown;
}>();

const id = useId();
const pct = computed(() => Math.min(100, Math.max(0, props.percentage)));
/** 分段时点亮几格 */
const lit = computed(() => (props.steps ? Math.round((props.steps * pct.value) / 100) : 0));

const aria = computed(() => ({
  role: "progressbar",
  "aria-valuemin": props.indeterminate ? undefined : 0,
  "aria-valuemax": props.indeterminate ? undefined : 100,
  "aria-valuenow": props.indeterminate ? undefined : pct.value,
  "aria-valuetext": props.steps ? `${lit.value} / ${props.steps}` : undefined,
}));

const barClasses = computed(() => [
  "ak-progress",
  props.size !== "md" && `ak-progress--${props.size}`,
  props.variant !== "accent" && `ak-progress--${props.variant}`,
  {
    "ak-progress--stripes": props.stripes,
    "ak-progress--indeterminate": props.indeterminate,
    "ak-progress--segmented": props.steps,
  },
]);
/** 条宽走 CSS 的 --_v；不定进度 / 分段不用它 */
const barStyle = computed(() => (props.indeterminate || props.steps ? undefined : { "--_v": `${pct.value}%` }));
</script>

<template>
  <div
    v-if="circle"
    v-bind="aria"
    :aria-label="label"
    :class="['ak-ring', variant !== 'accent' && `ak-ring--${variant}`]"
    :style="{ '--_v': pct }"
  >
    <span v-if="showIndicator || $slots.default"><slot>{{ pct }}%</slot></span>
  </div>
  <!-- 带标签行：progressbar 在外层，标签行的名字作可访问名 -->
  <div v-else-if="label || $slots.default" v-bind="aria" :aria-labelledby="label ? `${id}-label` : undefined">
    <div class="ak-progress-label">
      <span :id="`${id}-label`">{{ label }}</span>
      <span v-if="showIndicator || $slots.default"><slot>{{ pct }}%</slot></span>
    </div>
    <div :class="barClasses" :style="barStyle"><i v-for="n in steps" :key="n" :class="{ 'is-on': n <= lit }" /></div>
  </div>
  <div v-else v-bind="aria" :class="barClasses" :style="barStyle"><i v-for="n in steps" :key="n" :class="{ 'is-on': n <= lit }" /></div>
</template>
