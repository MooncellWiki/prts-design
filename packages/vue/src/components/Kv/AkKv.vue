<script setup lang="ts">
import { provide } from "vue";

import { kvKey } from "./context";

/**
 * 键值表（同 Naive 的 NDescriptions）：一个 <dl>，里面放若干 AkKvItem。
 * 子项自己输出 dt + dd，只有内联版要多包一层 div——这点由 provide 告诉子项，父组件不读子项。
 */
const props = defineProps<{
  /** 带框（信息栏）：外框 + 键列底色、居中，同现网 infobox 的 th；不带框的是档案里那种只有横线的版本 */
  bordered?: boolean;
  /** 内联：两三对短值一行放下、放不下换行，不画格子（所属势力 / 隐藏势力、获得方式 / 上线时间）；与 bordered 同时写时以内联为准 */
  inline?: boolean;
}>();

defineSlots<{
  /** 若干 AkKvItem */
  default?: () => unknown;
}>();

provide(kvKey, props);
</script>

<template>
  <dl :class="['ak-kv', { 'ak-kv--boxed': bordered && !inline, 'ak-kv--inline': inline }]"><slot /></dl>
</template>
