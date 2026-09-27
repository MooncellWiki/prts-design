<script setup lang="ts">
/**
 * 时间线（= Naive 的 NTimeline）：左侧一条竖线 + 菱形节点，里面放 AkTimelineItem。
 * 外层标 ak-not-prose：正文的列表缩进 / 方块项目符号不进来（否则会盖掉菱形节点）。
 */
defineSlots<{
  /** 若干 AkTimelineItem，从早到晚 */
  default?: () => unknown;
}>();
</script>

<template>
  <ul class="ak-timeline ak-not-prose"><slot /></ul>
</template>
