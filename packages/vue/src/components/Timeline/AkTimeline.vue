<script setup lang="ts">
/**
 * 时间线（= Naive 的 NTimeline）：左侧一条竖线 + 菱形节点，里面放 AkTimelineItem。
 * 不标 ak-not-prose：timeline.css 自己压得过正文列表规则，说明里的链接照常是正文链接。
 */
defineSlots<{
  /** 若干 AkTimelineItem，从早到晚 */
  default?: () => unknown;
}>();
</script>

<template>
  <ul class="ak-timeline"><slot /></ul>
</template>
