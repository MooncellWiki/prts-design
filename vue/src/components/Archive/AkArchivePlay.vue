<script setup lang="ts">
/** 档案卡页脚的「阅读 / 播放」块：黑底 + 播放三角 + 文字，悬停变主色。有 href 是链接（去密录页），没有是按钮（发 click） */
defineProps<{
  /** 链接地址（陈/干员密录/1）；不写就渲染成 <button> */
  href?: string;
}>();

defineSlots<{
  /** 文字（阅读密录 · 一鼓作气） */
  default?: () => unknown;
}>();
</script>

<template>
  <component :is="href ? 'a' : 'button'" class="ak-archive__play" :href="href" :type="href ? undefined : 'button'">
    <span class="ak-voice__play" aria-hidden="true" /><slot />
  </component>
</template>
