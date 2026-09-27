<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 图标地址：职业 profession/<职业>.png、分支 subprofession/<分支>.png（torappu 白线稿，亮色主题下 CSS 反相为黑） */
    src: string;
    /** 职业 / 分支名：作图标的 alt，并默认作悬停提示；不写 = 装饰图标（旁边已经有文字） */
    name?: string;
    /** 分支图标（.ak-subprof，26px，图占 90%）：size / variant 不适用 */
    branch?: boolean;
    /** 尺寸：sm 22 · md 32 · lg 48 · xl 72（px 边长） */
    size?: "sm" | "md" | "lg" | "xl";
    /** 外观：default 透明底（线稿跟主题反相）· box 深底白线稿（两套主题不变，同游戏内）· outline 1px 描边 */
    variant?: "default" | "box" | "outline";
    /** 悬停提示（data-ak-tip）：默认是 name，可改写；false 关掉 */
    tip?: string | false;
  }>(),
  { name: undefined, size: "md", variant: "default", tip: undefined },
);

const classes = computed(() =>
  props.branch
    ? ["ak-subprof"]
    : ["ak-prof", props.size !== "md" && `ak-prof--${props.size}`, props.variant !== "default" && `ak-prof--${props.variant}`],
);
const tipText = computed(() => (props.tip === false ? undefined : (props.tip ?? props.name)));
</script>

<template>
  <span :class="classes" :data-ak-tip="tipText"><img :src="src" :alt="name ?? ''" /></span>
</template>
