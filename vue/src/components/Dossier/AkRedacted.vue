<script setup lang="ts">
/**
 * 涂黑文本（剧透 / 不予公开）：悬停时显出；CSS 版只认 :hover，这里补上点按 / 键盘——
 * 可聚焦（聚焦时显出），点击或 Enter / Space 切换常显，触屏也能看。档案与剧情对话里都用它。
 */

/** 是否常显（点过一次后保持显出） */
const revealed = defineModel<boolean>({ default: false });

defineSlots<{
  /** 被涂黑的文字 */
  default?: () => unknown;
}>();

function toggle() {
  revealed.value = !revealed.value;
}
</script>

<template>
  <span
    :class="['ak-redacted', { 'is-revealed': revealed }]"
    role="button"
    tabindex="0"
    :aria-pressed="revealed"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <slot />
  </span>
</template>
