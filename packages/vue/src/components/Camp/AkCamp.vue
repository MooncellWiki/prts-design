<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 势力徽标（游戏 spritepack/ui_camp_logo 的白色线稿，亮色下由 CSS 反相成黑） */
    src: string;
    /** 势力名：显示在徽标右侧；logoOnly 时作图片 alt 和悬停提示 */
    name: string;
    /** 徽标高度：md 28 · lg 48（px） */
    size?: "md" | "lg";
    /** 外观：default 线稿跟主题反相 · box 深底方块、原色白线稿（两套主题下都一样） */
    variant?: "default" | "box";
    /** 只显示徽标（名字进 alt 与悬停提示） */
    logoOnly?: boolean;
  }>(),
  { size: "md", variant: "default" },
);

const classes = computed(() => [
  "ak-camp",
  props.size !== "md" && `ak-camp--${props.size}`,
  props.variant !== "default" && `ak-camp--${props.variant}`,
]);
</script>

<template>
  <span :class="classes" :data-ak-tip="logoOnly ? name : undefined">
    <img :src="src" :alt="logoOnly ? name : ''" />
    <template v-if="!logoOnly">{{ name }}</template>
  </span>
</template>
