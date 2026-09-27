<script setup lang="ts">
import { computed } from "vue";

import AkSanity from "./AkSanity.vue";

const props = withDefaults(
  defineProps<{
    /** 关卡编号（1-7 / H6-4 / TO-EX-1），展示字大号 */
    code: string;
    /** 关卡名 */
    name?: string;
    /** 编号下的小字：章节 / 类型（Main · Chapter 1 / Hard / Story） */
    caption?: string;
    /** 左侧类型色条：hard 磨难红 · ex 深红 · story 灰；default 无色条。按活动分好组的列表里关卡码已说明类型，不必再上色 */
    variant?: "default" | "hard" | "ex" | "story";
    /** 理智消耗：元信息行里的六边形 + 数字 */
    sanity?: number | string;
    /** 推荐等级（LV.30 / E2 LV.40），元信息行里显示为「推荐 LV.30」 */
    level?: string;
    /** 链接到关卡页：整张卡是链接（悬停描边变强调色） */
    href?: string;
  }>(),
  { name: undefined, caption: undefined, variant: "default", sanity: undefined, level: undefined, href: undefined },
);

const slots = defineSlots<{
  /** 元信息行末尾追加的项（剧情关卡 / 前往关卡页 »），每项一个元素，行内 flex 间距 10 */
  meta?: () => unknown;
}>();

/** 没有元信息行时关卡名直接作网格的第二列（首页「近期新增」的紧凑格：名字可以单独省略号截断） */
const hasMeta = () => props.sanity !== undefined || !!props.level || !!slots.meta;   // 插槽不是响应式的，放在渲染期判断

const classes = computed(() => [
  "ak-stage",
  props.variant !== "default" && `ak-stage--${props.variant}`,
  // 整块是链接：不带 not-prose 时正文的 a:visited（0,1,1）会压过 .ak-stage 的 color: inherit
  { "ak-not-prose": !!props.href },
]);
</script>

<template>
  <component :is="href ? 'a' : 'div'" :class="classes" :href="href">
    <span class="ak-stage__code">{{ code }}<small v-if="caption">{{ caption }}</small></span>
    <span v-if="hasMeta()">
      <span v-if="name" class="ak-stage__name">{{ name }}</span>
      <span class="ak-stage__meta">
        <span v-if="sanity !== undefined"><AkSanity :value="sanity" /></span>
        <span v-if="level">推荐 <b>{{ level }}</b></span>
        <slot name="meta" />
      </span>
    </span>
    <span v-else-if="name" class="ak-stage__name">{{ name }}</span>
  </component>
</template>
