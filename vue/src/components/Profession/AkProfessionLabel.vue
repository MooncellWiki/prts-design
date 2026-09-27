<script setup lang="ts">
import AkProfession from "./AkProfession.vue";

/** 带文字的职业 / 分支名（.ak-prof-label）：图标 + 中文名 + Bender 英文小字，放在信息栏 / 表格里 */
withDefaults(
  defineProps<{
    /** 职业 / 分支名 */
    name: string;
    /** 英文名（Bender 小字，.ak-en） */
    en?: string;
    /** 图标地址：画成分支图标（AkProfession branch，装饰，不带提示）；要职业图标或别的写法用 #icon 插槽 */
    src?: string;
    /** 名字链接到职业 / 分支页 */
    href?: string;
  }>(),
  { en: undefined, src: undefined, href: undefined },
);

defineSlots<{
  /** 图标（代替 src），如 <AkProfession size="sm" :src /> */
  icon?: () => unknown;
}>();
</script>

<template>
  <span class="ak-prof-label">
    <slot name="icon"><AkProfession v-if="src" :src="src" branch :tip="false" /></slot>
    <a v-if="href" :href="href">{{ name }}</a>
    <template v-else>{{ name }}</template>
    <span v-if="en" class="ak-en">{{ en }}</span>
  </span>
</template>
