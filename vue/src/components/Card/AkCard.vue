<script setup lang="ts">
/**
 * 卡片（= Naive 的 NCard）：1px 边、直角、表面色。标题 / 眉题默认直接排在正文顶部；
 * segmented（或写了 #header-extra）时标题单独成一栏、下面一道分隔线。页脚是表面 2 底的一栏。
 */
import { computed } from "vue";

type TitleTag = "div" | "h2" | "h3" | "h4" | "h5" | "h6";

const props = withDefaults(
  defineProps<{
    /** 标题（也可用 #header 插槽） */
    title?: string;
    /** 标题上方的灰色小字（Bender 大写：「Side Story」「01 · Foundations」） */
    eyebrow?: string;
    /** 标题元素：默认 div；卡片是页面大纲里的一节时用 h2–h6 */
    titleTag?: TitleTag;
    /** 标题独立成栏、下面一道分隔线（同 Naive 的 segmented）；写了 #header-extra 时自动成栏 */
    segmented?: boolean;
    /** 封面图地址：16:9 裁切铺满顶部；horizontal 时在左边占 40%。要自定义用 #cover */
    cover?: string;
    /** 外观：default 表面色 + 1px 边 · flat 无边、表面 2 底 · inset 凹陷底 */
    variant?: "default" | "flat" | "inset";
    /** 主色色条：top 顶部 3px · left 左侧 4px（公告 / 提示 / 天赋条目） */
    accent?: "top" | "left";
    /** 悬停时主色描边 + 投影 + 上移 2px（同 Naive 的 hoverable）；整卡可点时用 */
    hoverable?: boolean;
    /** 选中：主色内描边 + 左上角三角角标（源自游戏内技能选中框） */
    selected?: boolean;
    /** 横排：封面在左、正文在右 */
    horizontal?: boolean;
    /** 整张卡是一个链接：渲染成 <a>（带 ak-not-prose，正文链接色 / 下划线不进来）；这时正文里别再放链接 */
    href?: string;
  }>(),
  { title: undefined, eyebrow: undefined, titleTag: "div", cover: undefined, variant: "default", accent: undefined, href: undefined },
);

const slots = defineSlots<{
  /** 正文 */
  default?: () => unknown;
  /** 标题内容（代替 title） */
  header?: () => unknown;
  /** 标题栏右侧（标签、按钮）；写了它标题自动成栏 */
  "header-extra"?: () => unknown;
  /** 页脚（日期 + 操作）：表面 2 底、上面一道线 */
  footer?: () => unknown;
  /** 自定义封面（代替 cover）；图片自己加 class="ak-card__media" */
  cover?: () => unknown;
}>();

const bar = computed(() => props.segmented || !!slots["header-extra"]);
const hasTitle = computed(() => !!props.title || !!slots.header);

const classes = computed(() => [
  "ak-card",
  props.variant !== "default" && `ak-card--${props.variant}`,
  props.accent && `ak-card--accent-${props.accent}`,
  {
    "ak-card--hover": props.hoverable,
    "ak-card--selected": props.selected,
    "ak-card--horizontal": props.horizontal,
    /* 整块是链接：挡掉正文的 a:hover 下划线 / a:visited 褪色（base/typography.css prose / not-prose） */
    "ak-not-prose": !!props.href,
  },
]);
</script>

<template>
  <component :is="href ? 'a' : 'div'" :class="classes" :href="href">
    <slot name="cover"><img v-if="cover" class="ak-card__media" :src="cover" alt="" /></slot>
    <div v-if="bar" class="ak-card__header">
      <component :is="titleTag" class="ak-card__title">
        <span v-if="eyebrow" class="ak-card__eyebrow">{{ eyebrow }}</span>
        <slot name="header">{{ title }}</slot>
      </component>
      <slot name="header-extra" />
    </div>
    <div class="ak-card__body">
      <template v-if="!bar">
        <span v-if="eyebrow" class="ak-card__eyebrow">{{ eyebrow }}</span>
        <component :is="titleTag" v-if="hasTitle" class="ak-card__title"><slot name="header">{{ title }}</slot></component>
      </template>
      <slot />
    </div>
    <div v-if="$slots.footer" class="ak-card__footer"><slot name="footer" /></div>
  </component>
</template>
