<script setup lang="ts">
/**
 * 面板：带标题栏的容器（游戏内 announce panel）——标题栏表面 2 底、左侧 4px 主色条；标题后可跟 Bender 英文。
 * 与 AkCard 的分工：卡片是一件可并列 / 可点的东西，面板是页面上一块有名字的区域（首页「今日信息」「新增关卡」）。
 * collapsible 时点标题栏收起 / 展开（同 Naive NCollapseItem 的单项用法），展开状态是 v-model；
 * 键盘：标题文字是 role="button"（在标题元素里面，h3 的大纲语义不丢，同 WAI-ARIA Accordion），Enter / Space 切换。
 */
import { computed, useId, useTemplateRef } from "vue";

type TitleTag = "div" | "h2" | "h3" | "h4" | "h5" | "h6";

const props = withDefaults(
  defineProps<{
    /** 标题（也可用 #header 插槽） */
    title?: string;
    /** 标题后的英文（Bender 大写灰字：「Today」「Operations」） */
    en?: string;
    /** 标题元素：默认 div；面板是页面大纲里的一节时用 h2–h6（首页「新增关卡」是 h3） */
    titleTag?: TitleTag;
    /** 标题栏反转（亮色下黑底白字、暗色下白底黑字，同 .ak-inverse）：公告这类要跳出来的区域 */
    inverse?: boolean;
    /** 可折叠：点标题栏收起 / 展开正文（右端出现 V 形箭头）；需要有标题 */
    collapsible?: boolean;
  }>(),
  { title: undefined, en: undefined, titleTag: "div" },
);

/** 是否展开（collapsible 时有效）；默认展开 */
const expanded = defineModel<boolean>({ default: true });

const slots = defineSlots<{
  /** 正文 */
  default?: () => unknown;
  /** 标题内容（代替 title） */
  header?: () => unknown;
  /** 标题栏右侧（标签、日期、按钮） */
  "header-extra"?: () => unknown;
}>();

const id = useId();
const toggle = useTemplateRef<HTMLElement>("toggle");
const hasHead = computed(() => !!props.title || !!slots.header || !!slots["header-extra"]);
const collapsed = computed(() => props.collapsible && !expanded.value);

/**
 * 整条标题栏都能点（同 CSS 的 cursor: pointer）；标题栏里别的链接 / 按钮自己的点击不算。
 * 皮肤 / 预览脚本也会给纯 CSS 面板的标题栏点击翻 is-collapsed——标题栏上的 data-no-toggle 让它跳过这里（放在标题栏而不是根上，免得正文里的纯 CSS 芯片也被豁免），状态只看 v-model。
 */
function onHeadClick(e: MouseEvent) {
  if (!props.collapsible) return;
  const hit = (e.target as Element).closest("a, button, input, select, textarea, label, [role='button']");
  if (!hit || hit === toggle.value) expanded.value = !expanded.value;
}

function onKey(e: KeyboardEvent) {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  expanded.value = !expanded.value;
}
</script>

<template>
  <div :class="['ak-panel', { 'ak-panel--collapsible': collapsible, 'is-collapsed': collapsed }]">
    <div v-if="hasHead" :class="['ak-panel__head', { 'ak-panel__head--inverse': inverse }]" data-no-toggle @click="onHeadClick">
      <component :is="titleTag" v-if="title || $slots.header" class="ak-panel__title">
        <span
          v-if="collapsible"
          ref="toggle"
          role="button"
          tabindex="0"
          :aria-expanded="expanded"
          :aria-controls="`${id}-body`"
          @keydown="onKey"
        >
          <slot name="header">{{ title }}</slot><span v-if="en" class="ak-en" lang="en">{{ en }}</span>
        </span>
        <template v-else>
          <slot name="header">{{ title }}</slot><span v-if="en" class="ak-en" lang="en">{{ en }}</span>
        </template>
      </component>
      <slot name="header-extra" />
    </div>
    <div :id="`${id}-body`" class="ak-panel__body"><slot /></div>
  </div>
</template>
