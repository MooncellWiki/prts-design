<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** 活动名 */
    title: string;
    /** 标题上方的类型行（Side Story · 进行中 / 寻访 · 已结束），强调色、大写字距 */
    kind?: string;
    /** 起止时间（2026.08.08 16:00 — 09.07 03:59） */
    time?: string;
    /** 横幅图地址（21:9 裁切铺满）；不写且没有 #cover 插槽时不出横幅 */
    cover?: string;
    /** 状态：live 进行中（类型行前闪烁红点）· ended 已结束（类型行转灰）· default 不标 */
    status?: "default" | "live" | "ended";
  }>(),
  { kind: undefined, time: undefined, cover: undefined, status: "default" },
);

defineSlots<{
  /** 横幅（代替 cover）：自己放 .ak-event__banner 元素 */
  cover?: () => unknown;
  /** 标题（代替 title，如包一层链接） */
  title?: () => unknown;
  /** 时间下面的内容：倒计时 AkCountdown、按钮 */
  default?: () => unknown;
}>();

const classes = computed(() => ["ak-event", { "is-live": props.status === "live", "is-ended": props.status === "ended" }]);
</script>

<template>
  <div :class="classes">
    <slot name="cover"><img v-if="cover" class="ak-event__banner" :src="cover" alt="" /></slot>
    <div class="ak-event__body">
      <div v-if="kind" class="ak-event__type">{{ kind }}</div>
      <div class="ak-event__title"><slot name="title">{{ title }}</slot></div>
      <div v-if="time" class="ak-event__time">{{ time }}</div>
      <slot />
    </div>
  </div>
</template>
