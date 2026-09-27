<script setup lang="ts">
/** 头像（= Naive 的 NAvatar）：直角 1px 边的方块，图片铺满；没有图 / 图挂了时显示默认插槽的文字（「DR」「+9」）。 */
import { computed, inject, ref, watch } from "vue";

import { avatarGroupKey, type AvatarSize } from "./context";

const props = withDefaults(
  defineProps<{
    /** 图片地址（干员头像等）；不写或加载失败时显示默认插槽的文字 */
    src?: string;
    /** 图片替代文本：旁边已经写了名字时留空（默认），头像单独出现时写人名 */
    alt?: string;
    /** 尺寸：xs 24 · sm 32 · md 40 · lg 56 · xl 80（px）；不写时跟 AkAvatarGroup，再不然是 md */
    size?: AvatarSize;
    /** 圆形（系统默认直角，只给用户头像这类确需时用） */
    round?: boolean;
    /** 右下角绿色状态点（在线 / 可用）：纯视觉，含义要在旁边的文字里说出来 */
    status?: boolean;
  }>(),
  { src: undefined, alt: "", size: undefined },
);

defineSlots<{
  /** 没有图片时显示的文字（缩写、「+9」） */
  default?: () => unknown;
}>();

const group = inject(avatarGroupKey, null);
const size = computed(() => props.size ?? group?.size ?? "md");

/** 图片加载失败就退回文字（同 Naive 的 fallback）；换了地址重新试 */
const failed = ref(false);
watch(
  () => props.src,
  () => (failed.value = false),
);

const classes = computed(() => ["ak-avatar", size.value !== "md" && `ak-avatar--${size.value}`, { "ak-avatar--round": props.round }]);
</script>

<template>
  <span :class="classes">
    <img v-if="src && !failed" :src="src" :alt="alt" @error="failed = true" />
    <slot v-else />
    <span v-if="status" class="ak-avatar__status" aria-hidden="true" />
  </span>
</template>
