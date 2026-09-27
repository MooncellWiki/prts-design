<script setup lang="ts">
import { computed } from "vue";

export type TimelineStatus = "wait" | "active" | "done";

/** 时间线的一项（= Naive 的 NTimelineItem），只能放在 AkTimeline 里 */
const props = withDefaults(
  defineProps<{
    /** 时间（Bender 小字，在标题上方） */
    time?: string;
    /** 标题 */
    title?: string;
    /** 说明文字（也可以写在默认插槽里） */
    content?: string;
    /** 节点状态：wait 空心菱形（默认）· active 当前 · done 已发生（后两者都是主色实心） */
    status?: TimelineStatus;
  }>(),
  { time: undefined, title: undefined, content: undefined, status: "wait" },
);

defineSlots<{
  /** 标题（代替 title） */
  header?: () => unknown;
  /** 说明（代替 content） */
  default?: () => unknown;
}>();

const classes = computed(() => ({ "is-active": props.status === "active", "is-done": props.status === "done" }));
</script>

<template>
  <li :class="classes">
    <span v-if="time" class="ak-timeline__date">{{ time }}</span>
    <div v-if="title || $slots.header" class="ak-timeline__title"><slot name="header">{{ title }}</slot></div>
    <div v-if="content || $slots.default" class="ak-timeline__desc"><slot>{{ content }}</slot></div>
  </li>
</template>
