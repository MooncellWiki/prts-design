<script setup lang="ts">
import { computed } from "vue";

import type { IconName } from "../../icons";
import AkIcon from "../Icon/AkIcon.vue";

export type CboxLevel = "tip" | "info" | "warning" | "danger" | "neutral";

const props = withDefaults(
  defineProps<{
    /** 等级（= 现网 {{Cbox2}} 的 lv）：tip = lv0 绿「另见 / 提示」· info = lv1 蓝（默认）· warning = lv2 / lv3 · danger = lv4 · neutral 灰 */
    level?: CboxLevel;
    /** 加粗的标题行（等级色） */
    title?: string;
    /** 图标井里的图标；默认按等级：tip → arrow-ne，info / neutral → info，warning / danger → warn */
    icon?: IconName;
    /** 最宽 640px（= 模板 narrow=） */
    narrow?: boolean;
  }>(),
  { level: "info", title: undefined, icon: undefined },
);

const DEFAULT_ICON: Record<CboxLevel, IconName> = { tip: "arrow-ne", info: "info", warning: "warn", danger: "warn", neutral: "info" };

const classes = computed(() => [
  "ak-cbox",
  props.level !== "info" && `ak-cbox--${props.level}`,
  { "ak-cbox--narrow": props.narrow },
]);
</script>

<template>
  <div :class="classes" role="note">
    <span class="ak-cbox__icon">
      <slot name="icon"><AkIcon :name="icon ?? DEFAULT_ICON[level]" /></slot>
    </span>
    <div class="ak-cbox__body">
      <div v-if="title || $slots.title" class="ak-cbox__title"><slot name="title">{{ title }}</slot></div>
      <slot />
    </div>
  </div>
</template>
