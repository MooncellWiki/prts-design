<script setup lang="ts">
import { computed, h, type VNodeChild } from "vue";

import { formatVar, isWideTip, parseRichText, styleClass, type RtNode } from "./parse";

export type RichTextVariant =
  | "vup"
  | "vdown"
  | "rem"
  | "kw"
  | "talpu"
  | "term"
  | "imp"
  | "enemy"
  | "gild"
  | "drop"
  | "acrem"
  | "level"
  | "pn";

const props = withDefaults(
  defineProps<{
    /** 游戏原始标记：<@ba.vup>…</> 样式 · <$ba.stun>…</> 术语 · {atk_scale:0%} 占位符 · 换行；不写就渲染默认插槽 */
    text?: string;
    /** 占位符的取值（技能等级的 blackboard，如 { atk_scale: 2.6 }）；键不分大小写，没给的占位符原样留着 */
    vars?: Record<string, number | string>;
    /** 术语说明（termDescriptionDict，如 { "ba.stun": "晕眩：…" }），作 <$…> 的悬停提示 */
    terms?: Record<string, string>;
    /** 只包一层、不解析时的样式：vup 增益 · vdown 减益 · rem 提醒 · kw 关键词 · talpu 潜能加成 · term 术语 · imp 重要 · enemy 敌方 · gild 镀层 · level 关卡名 · pn 斜体 … */
    variant?: RichTextVariant;
    /** 悬停提示（data-ak-tip）；variant="term" 时写术语说明 */
    tip?: string;
    /** 外层元素 */
    tag?: string;
  }>(),
  { text: undefined, vars: undefined, terms: undefined, variant: undefined, tip: undefined, tag: "span" },
);

const slots = defineSlots<{
  /** 不写 text 时的内容（用 variant 包一层） */
  default?: () => unknown;
  /** 占位符怎么画（技能参数矩阵用它把变量位画成 .ak-var）；不写就按 vars 填数 */
  var?: (p: { key: string; value: string | undefined }) => unknown;
}>();

const tree = computed(() => (props.text === undefined ? [] : parseRichText(props.text)));

/** vars 的键按小写查（游戏里模板和 blackboard 的大小写不总一致） */
const lowerVars = computed(() => {
  const out: Record<string, number | string> = {};
  for (const [k, v] of Object.entries(props.vars ?? {})) out[k.toLowerCase()] = v;
  return out;
});

function render(nodes: RtNode[]): VNodeChild[] {
  return nodes.map(n => {
    switch (n.type) {
      case "text":
        return n.text;
      case "br":
        return h("br");
      case "var": {
        const v = lowerVars.value[n.key.toLowerCase()];
        const value = v === undefined ? undefined : formatVar(v, n.format, n.negative);
        return slots.var ? (slots.var({ key: n.key, value }) as VNodeChild) : (value ?? n.raw);
      }
      case "term": {
        const tip = props.terms?.[n.key];
        return h("span", { class: ["ak-rt-term", isWideTip(tip) && "ak-tip--wide"], "data-ak-tip": tip }, render(n.children));
      }
      case "style": {
        const cls = styleClass(n.key);
        return cls ? h("span", { class: cls }, render(n.children)) : render(n.children);
      }
    }
  });
}

const classes = computed(() => [props.variant && `ak-rt-${props.variant}`, isWideTip(props.tip) && "ak-tip--wide"].filter(Boolean).join(" ") || undefined);

/** 渲染期才调插槽（var 插槽要在父组件的渲染里调用），所以包成一个函数组件交给模板 */
const Nodes = () => render(tree.value);
</script>

<template>
  <component :is="tag" :class="classes" :data-ak-tip="tip">
    <Nodes v-if="text !== undefined" />
    <slot v-else />
  </component>
</template>
