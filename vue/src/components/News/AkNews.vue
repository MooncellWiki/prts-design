<script setup lang="ts">
/**
 * Breaking news 横幅（游戏主界面那条）：左边矩形红块 + 反色底的一行正文，太长时省略号截断。
 * 天然只装一条——同时有好几条活动要列时用列表（首页「进行中的网页活动」），别往这里塞。
 */
withDefaults(
  defineProps<{
    /** 红块里的字（Bender 大写） */
    title?: string;
  }>(),
  { title: "Breaking News" },
);

defineSlots<{
  /** 红块内容（代替 title） */
  title?: () => unknown;
  /** 正文：一行，可含链接 / 加粗；超长省略号截断 */
  default?: () => unknown;
}>();
</script>

<template>
  <div class="ak-news">
    <span class="ak-news__label"><slot name="title">{{ title }}</slot></span>
    <span class="ak-news__text"><slot /></span>
  </div>
</template>
