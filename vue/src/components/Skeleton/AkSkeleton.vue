<script setup lang="ts">
/**
 * 骨架占位（= Naive 的 NSkeleton）：内容到之前先占住它的形状，底色两级表面之间扫光。
 * 骨架对读屏隐藏（aria-hidden）；「正在加载」由外层容器的 aria-busy 或 AkSpinner 报。
 */
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 文字行：.9em 高、上下 .35em 间距；一组里最后一行 60% 宽 */
    text?: boolean;
    /** 圆形（头像占位）：宽高相等，由 width 定 */
    circle?: boolean;
    /** 方形（道具 / 头像占位）：宽高相等，由 width 定 */
    square?: boolean;
    /** 重复几个（同 Naive）：配 text 画一段文字 */
    repeat?: number;
    /** 宽度：数字按 px，字符串原样（"60%"）；不写时占满一行 */
    width?: number | string;
    /** 高度：数字按 px；不写时 1em（text 时 .9em，圆 / 方形跟宽度） */
    height?: number | string;
  }>(),
  { repeat: 1, width: undefined, height: undefined },
);

const classes = computed(() => [
  "ak-skeleton",
  { "ak-skeleton--text": props.text, "ak-skeleton--circle": props.circle, "ak-skeleton--square": props.square && !props.circle },
]);

const px = (v: number | string | undefined) => (typeof v === "number" ? `${v}px` : v);
/** 宽高是每一处占位自己的数据（同 Naive 的 width / height），CSS 里没有对应的类 */
const size = computed(() => (props.width === undefined && props.height === undefined ? undefined : { width: px(props.width), height: px(props.height) }));
</script>

<template>
  <span v-for="i in repeat" :key="i" v-bind="$attrs" :class="classes" :style="size" aria-hidden="true" />
</template>
