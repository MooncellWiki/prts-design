<script setup lang="ts">
/** 剧情对话：一个 <dl>，说话人一列右对齐（主色粗体）、台词一列；里面放若干 AkDialogueLine。分段就是几个 AkDialogue 之间插小标题 */
defineSlots<{
  /** 若干 AkDialogueLine */
  default?: () => unknown;
}>();
</script>

<template>
  <dl class="ak-dialogue"><slot /></dl>
</template>
