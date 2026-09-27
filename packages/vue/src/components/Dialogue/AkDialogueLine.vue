<script setup lang="ts">
/** 剧情对话的一句：输出 <dt>（说话人）+ <dd>（台词）。只能放在 AkDialogue 里 */
const props = defineProps<{
  /** 说话人；不写（也没有 #speaker 插槽）就是旁白：说话人列写「旁白」，整句灰色斜体 */
  speaker?: string;
}>();

const slots = defineSlots<{
  /** 台词 */
  default?: () => unknown;
  /** 说话人（代替 speaker，比如身份要涂黑时放 AkRedacted） */
  speaker?: () => unknown;
}>();

/** 插槽不是响应式的，放在渲染期判断 */
const isNarrator = () => !props.speaker && !slots.speaker;
</script>

<template>
  <dt :class="{ narrator: isNarrator() }"><slot name="speaker">{{ speaker ?? "旁白" }}</slot></dt>
  <dd :class="{ narrator: isNarrator() }"><slot /></dd>
</template>
