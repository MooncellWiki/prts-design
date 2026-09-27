<script setup lang="ts">
/**
 * 行内关卡号：黑白反转的小方块（展示字），放在正文 / 解锁条件里（「3星通关主题曲 5-8」）。关卡号写在默认插槽里。
 */
defineProps<{
  /** hard = 红底（磨难 / 险地关卡号） */
  variant?: "default" | "hard";
  /** 链接到关卡页 */
  href?: string;
}>();

defineSlots<{
  /** 关卡号（5-8 / H6-4） */
  default?: () => unknown;
}>();
</script>

<template>
  <!-- 链接版带 ak-not-prose：正文的 a:visited / a:hover 会把反白字染成链接色 -->
  <component
    :is="href ? 'a' : 'span'"
    :class="['ak-stage-code', variant === 'hard' && 'ak-stage-code--hard', href && 'ak-not-prose']"
    :href="href"
  >
    <slot />
  </component>
</template>
