<script setup lang="ts">
import { computed } from "vue";

import { icons, type IconName } from "../../icons";

const props = withDefaults(
  defineProps<{
    /** 图标名（见 icons.ts，与皮肤 sprite 的 #i-* 同名） */
    name: IconName;
    /** 边长（px）；不写则由外层 CSS 定（如 .ak-btn__icon 的 1.1em） */
    size?: number | string;
    /** 读屏文本；不写则 aria-hidden（纯装饰，旁边有文字） */
    label?: string;
  }>(),
  { size: undefined, label: undefined },
);

const markup = computed(() => icons[props.name]);
</script>

<template>
  <svg
    class="ak-icon"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    v-html="markup"
  />
</template>
