<script setup lang="ts">
import { computed } from "vue";

import { isWideTip } from "../RichText/parse";
import { SP_TYPE_TEXT, SP_TYPE_TIP, type SpType } from "./sp";

const props = withDefaults(
  defineProps<{
    /** 技力回复方式：auto 自动回复（绿）· attack 攻击回复（橙）· hit 受击回复（黄）· passive 被动（灰） */
    spType?: SpType;
    /** 悬停提示（data-ak-tip）：默认是游戏内的说明（「每次攻击回复1点技力」），可改写；false 关掉 */
    tip?: string | false;
  }>(),
  { spType: "auto", tip: undefined },
);

defineSlots<{
  /** 文字；默认「自动回复」「攻击回复」「受击回复」「被动」 */
  default?: () => unknown;
}>();

const tipText = computed(() => (props.tip === false ? undefined : (props.tip ?? SP_TYPE_TIP[props.spType])));
</script>

<template>
  <span
    :class="['ak-sp', spType !== 'auto' && `ak-sp--${spType}`, isWideTip(tipText) && 'ak-tip--wide']"
    :data-ak-tip="tipText"
  >
    <slot>{{ SP_TYPE_TEXT[spType] }}</slot>
  </span>
</template>
