<script setup lang="ts">
import { inject } from "vue";

import { kvKey } from "./context";

/** 键值表的一对（同 Naive 的 NDescriptionsItem）：输出 <dt> + <dd>；在内联版 AkKv 里包一层 <div>。只能放在 AkKv 里 */
defineProps<{
  /** 键（dt）文字；要带悬停解释 / 图标时改用 #term 插槽 */
  term?: string;
}>();

defineSlots<{
  /** 值（dd）：文字、链接、标签、列表都行 */
  default?: () => unknown;
  /** 键（代替 term） */
  term?: () => unknown;
}>();

const kv = inject(kvKey, {});
</script>

<template>
  <div v-if="kv.inline">
    <dt><slot name="term">{{ term }}</slot></dt>
    <dd><slot /></dd>
  </div>
  <template v-else>
    <dt><slot name="term">{{ term }}</slot></dt>
    <dd><slot /></dd>
  </template>
</template>
