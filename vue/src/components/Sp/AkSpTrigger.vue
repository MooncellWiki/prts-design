<script setup lang="ts">
import { computed } from "vue";

import { isWideTip } from "../RichText/parse";
import { TRIGGER_TEXT, TRIGGER_TIP } from "./sp";

const props = withDefaults(
  defineProps<{
    /** 自动触发（灰底）；默认手动触发（黑白反转） */
    auto?: boolean;
    /** 悬停提示（data-ak-tip）：默认是游戏内的说明，可改写；false 关掉 */
    tip?: string | false;
  }>(),
  { tip: undefined },
);

defineSlots<{
  /** 文字；默认「手动触发」/「自动触发」 */
  default?: () => unknown;
}>();

const mode = computed(() => (props.auto ? "auto" : "manual"));
const tipText = computed(() => (props.tip === false ? undefined : (props.tip ?? TRIGGER_TIP[mode.value])));
</script>

<template>
  <span :class="['ak-sp-trigger', { 'ak-sp-trigger--auto': auto, 'ak-tip--wide': isWideTip(tipText) }]" :data-ak-tip="tipText">
    <slot>{{ TRIGGER_TEXT[mode] }}</slot>
  </span>
</template>
