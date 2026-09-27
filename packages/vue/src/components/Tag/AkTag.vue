<script setup lang="ts">
import { computed, useId } from "vue";

export type TagVariant =
  | "default"
  | "outline"
  | "accent"
  | "accent-soft"
  | "yellow"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "danger-solid"
  | "new"
  | "inverse";

const props = withDefaults(
  defineProps<{
    /** 外观：状态色走 info / success / warning / danger（淡底色字）；new = 红底 NEW 角标；danger-solid = BREAKING 红；yellow 次强调 */
    variant?: TagVariant;
    /** 尺寸：sm 18 · md 22 · lg 28（px 高） */
    size?: "sm" | "md" | "lg";
    /** 标签字（Bender 大写 + 字距），给版本号 / 状态码这类拉丁短词 */
    caps?: boolean;
    /** 前置小方点 */
    dot?: boolean;
    /** 显示移除按钮，点击触发 remove（读屏名是「移除 + 标签文字」） */
    removable?: boolean;
  }>(),
  { variant: "default", size: "md" },
);

const emit = defineEmits<{
  /** 点了移除按钮 */
  remove: [];
}>();

const classes = computed(() => [
  "ak-tag",
  props.variant !== "default" && `ak-tag--${props.variant}`,
  props.size !== "md" && `ak-tag--${props.size}`,
  { "ak-tag--label": props.caps },
]);

const id = useId();
</script>

<template>
  <span :class="classes">
    <span v-if="dot" class="ak-tag__dot" aria-hidden="true" />
    <span v-if="removable" :id="`${id}-text`"><slot /></span>
    <slot v-else />
    <button
      v-if="removable"
      :id="`${id}-remove`"
      type="button"
      class="ak-tag__remove"
      aria-label="移除"
      :aria-labelledby="`${id}-remove ${id}-text`"
      @click="emit('remove')"
    >
      ✕
    </button>
  </span>
</template>
