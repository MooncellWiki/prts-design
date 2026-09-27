<script setup lang="ts">
import { computed } from "vue";

/** 稀有度 = 星数 1–6（游戏数据里的 rarity 是 0–5，用的时候 +1） */
export type Rarity = 1 | 2 | 3 | 4 | 5 | 6;

const props = withDefaults(
  defineProps<{
    /** 星数 1–6 */
    value: Rarity;
    /** 颜色：default 游戏星黄 · white 正文色（亮黑暗白）· tier 按稀有度色阶（跟 value 走，= .ak-rarity--r{value}） */
    variant?: "default" | "white" | "tier";
    /** 尺寸：sm 0.8em · md 1em · lg 1.4em——星形跟字号走，放进哪行字就是那行的大小 */
    size?: "sm" | "md" | "lg";
    /** 改用游戏原图（rarity_yellow_N.png 黄星 / rarity_N.png 白星，N = 星数 − 1），固定 14px 高；这时 variant / size 不适用 */
    src?: string;
    /** 原图是白色的那套（rarity_N.png）：亮色主题下反相为黑（.ak-glyph） */
    glyph?: boolean;
    /** 可访问名：默认「六星」这种（星形是 CSS 画的空元素，读屏读不到） */
    label?: string;
  }>(),
  { variant: "default", size: "md", src: undefined, label: undefined },
);

const CN = ["", "一", "二", "三", "四", "五", "六"];
const name = computed(() => props.label ?? `${CN[props.value]}星`);

const classes = computed(() => [
  "ak-rarity",
  props.variant === "white" && "ak-rarity--white",
  props.variant === "tier" && `ak-rarity--r${props.value}`,
  props.size !== "md" && `ak-rarity--${props.size}`,
]);
</script>

<template>
  <img v-if="src" :class="['ak-rarity-img', { 'ak-glyph': glyph }]" :src="src" :alt="name" />
  <span v-else :class="classes" role="img" :aria-label="name"><i v-for="n in value" :key="n" /></span>
</template>
