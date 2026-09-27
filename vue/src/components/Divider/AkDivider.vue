<script setup lang="ts">
/**
 * 分隔线（= Naive 的 NDivider）：默认 <hr>；默认插槽写了文字就是「——文字——」（小号大写标签字，两侧线段）；vertical 是行内竖线。
 */
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 外观：default 1px 线 · accent 左段 80px 主色 + 其余 1 色线（2px 高）· stripes 6px 斜纹带；带文字 / 竖线时不适用 */
    variant?: "default" | "accent" | "stripes";
    /** 竖线：行内 1px × 1em，隔开同一行里的几项（「编辑 | 历史」） */
    vertical?: boolean;
  }>(),
  { variant: "default" },
);

defineSlots<{
  /** 线中间的文字（同 Naive 的标题）；竖线时不适用 */
  default?: () => unknown;
}>();

const classes = computed(() => ["ak-divider", props.variant !== "default" && `ak-divider--${props.variant}`]);
</script>

<template>
  <span v-if="vertical" class="ak-divider ak-divider--vertical" role="separator" aria-orientation="vertical" />
  <div v-else-if="$slots.default" class="ak-divider ak-divider--text" role="separator"><slot /></div>
  <hr v-else :class="classes" />
</template>
