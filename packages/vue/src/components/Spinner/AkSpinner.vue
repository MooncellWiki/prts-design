<script setup lang="ts">
/**
 * 加载中（= Naive 的 NSpin）。三种输出：
 * - 只有图形：<span class="ak-spinner" role="status" aria-label>
 * - 有 description：.ak-spin（图形 + 说明竖排）
 * - 默认插槽包住内容：.ak-spin-container，show 时内容压淡不可点、.ak-spin 叠在正中，容器 aria-busy
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 样子：diamond 菱形涟漪（游戏内 loading，默认）· bars 三根竖条（行内、更轻） */
    variant?: "diamond" | "bars";
    /** 说明文字，排在图形下方（同 Naive） */
    description?: string;
    /** 包住内容时是否在加载（同 Naive）；不包内容时无效，要藏起来直接 v-if */
    show?: boolean;
    /** 换色：写到 CSS 的 --_c（只对 diamond 生效），如 "var(--ak-yellow-500)" */
    color?: string;
    /** 读屏文本；有 description 时念 description */
    label?: string;
  }>(),
  { variant: "diamond", description: undefined, show: true, color: undefined, label: "加载中" },
);

defineSlots<{
  /** 正在加载的内容：加载层叠在它上面 */
  default?: () => unknown;
  /** 说明（代替 description） */
  description?: () => unknown;
}>();

const graphicClass = computed(() => (props.variant === "bars" ? "ak-loader" : "ak-spinner"));
/** --_c 是 .ak-spinner 约定的换色接口（spinner.css 头注），不是随手写的内联样式 */
const graphicStyle = computed(() => (props.color && props.variant === "diamond" ? { "--_c": props.color } : undefined));
</script>

<template>
  <div v-if="$slots.default" class="ak-spin-container" :aria-busy="show">
    <div class="ak-spin-container__content"><slot /></div>
    <div v-if="show" class="ak-spin" role="status">
      <span :class="graphicClass" :style="graphicStyle" aria-hidden="true"><template v-if="variant === 'bars'"><i /><i /><i /></template></span>
      <span v-if="description || $slots.description" class="ak-spin__desc"><slot name="description">{{ description }}</slot></span>
      <span v-else class="ak-sr-only">{{ label }}</span>
    </div>
  </div>
  <div v-else-if="description || $slots.description" class="ak-spin" role="status">
    <span :class="graphicClass" :style="graphicStyle" aria-hidden="true"><template v-if="variant === 'bars'"><i /><i /><i /></template></span>
    <span class="ak-spin__desc"><slot name="description">{{ description }}</slot></span>
  </div>
  <span v-else :class="graphicClass" :style="graphicStyle" role="status" :aria-label="label">
    <template v-if="variant === 'bars'"><i /><i /><i /></template>
  </span>
</template>
