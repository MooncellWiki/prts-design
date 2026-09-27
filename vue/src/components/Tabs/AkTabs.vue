<script setup lang="ts">
import { Comment, Fragment, cloneVNode, nextTick, useId, type VNode } from "vue";

import AkTab from "./AkTab.vue";
import AkTabPane from "./AkTabPane.vue";

type Name = string | number;

const props = withDefaults(
  defineProps<{
    /** 外观：underline 下划线（默认）· pill 胶囊底 · block 游戏内块状（选中黑白反转） */
    variant?: "underline" | "pill" | "block";
    /** 页签位置：top 在上（默认）· left 竖排在左、面板在右（干员档案），上下方向键切换 */
    placement?: "top" | "left";
    /** 读屏用的页签组名 */
    label?: string;
  }>(),
  { variant: "underline", placement: "top", label: undefined },
);

/** 当前页签的 name；不绑定时默认第一个 */
const model = defineModel<Name>();

const slots = defineSlots<{
  /** AkTabPane（页签 + 面板）或 AkTab（只有页签）若干 */
  default?: () => VNode[];
}>();

interface TabDef {
  index: number;
  name: Name;
  disabled: boolean;
  /** 页签内容：#tab 插槽（AkTab 是默认插槽），没有就用 tab 字符串 */
  label: (() => unknown) | string | undefined;
  /** AkTabPane 的 vnode；AkTab 没有面板 */
  pane?: VNode;
  directive: "if" | "show" | "show:lazy";
}

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(n => (n.type === Fragment && Array.isArray(n.children) ? flatten(n.children as VNode[]) : n.type === Comment ? [] : [n]));

/**
 * 同 Naive 的 NTabs：从默认插槽里挑出 AkTabPane / AkTab 读 props 和插槽，自己画页签。
 * 不走子组件注册（provide / inject），这样首次渲染 / SSR 预渲染就有完整的页签。插槽只能在渲染期调用，所以由模板调用。
 */
function collect(): TabDef[] {
  const nodes = flatten(slots.default?.() ?? []);
  const panes = nodes.filter(n => n.type === AkTabPane);
  return (panes.length ? panes : nodes.filter(n => n.type === AkTab)).map((n, index) => {
    const p = (n.props ?? {}) as Record<string, unknown>;
    const s = (n.children ?? {}) as Record<string, (() => unknown) | undefined>;
    const isPane = n.type === AkTabPane;
    return {
      index,
      name: p.name as Name,
      disabled: p.disabled !== undefined && p.disabled !== false, // <AkTabPane disabled> 在 vnode.props 里是 ""
      label: (isPane ? s.tab : s.default) ?? (p.tab as string | undefined),
      pane: isPane ? n : undefined,
      directive: (p.displayDirective ?? p["display-directive"] ?? "if") as TabDef["directive"],
    };
  });
}

const current = (tabs: TabDef[]) => model.value ?? tabs[0]?.name;

/** show:lazy 已经切到过的页；只在渲染期随当前页一起变，不需要响应式 */
const visited = new Set<Name>();
function isRendered(t: TabDef, tabs: TabDef[]) {
  if (!t.pane) return false;
  if (t.name === current(tabs)) {
    visited.add(t.name);
    return true;
  }
  return t.directive === "show" || (t.directive === "show:lazy" && visited.has(t.name));
}

const id = useId();
const tabId = (t: TabDef) => `${id}-tab-${t.index}`;
const panelId = (t: TabDef) => `${id}-panel-${t.index}`;

/** 方向键 / Home / End 在页签间移动并选中（WAI-ARIA Tabs，自动激活） */
function onKey(e: KeyboardEvent, tabs: TabDef[]) {
  const enabled = tabs.filter(t => !t.disabled);
  const i = enabled.findIndex(t => t.name === current(tabs));
  const [prev, next] = props.placement === "left" ? ["ArrowUp", "ArrowDown"] : ["ArrowLeft", "ArrowRight"];
  const to =
    e.key === next ? enabled[(i + 1) % enabled.length]
    : e.key === prev ? enabled[(i - 1 + enabled.length) % enabled.length]
    : e.key === "Home" ? enabled[0]
    : e.key === "End" ? enabled.at(-1)
    : undefined;
  if (!to) return;
  e.preventDefault();
  model.value = to.name;
  const tablist = e.currentTarget as HTMLElement;
  nextTick(() => tablist.querySelector<HTMLElement>(`#${CSS.escape(tabId(to))}`)?.focus());
}

/** 把插槽函数 / 字符串 / vnode 原样渲染；定义在外面保持同一个组件类型，重渲染时不重建 */
const Render = (p: { content: unknown }) => (typeof p.content === "function" ? p.content() : p.content);
</script>

<template>
  <div :class="['ak-tabset', placement === 'left' && 'ak-tabset--left']">
    <template v-for="tabs in [collect()]" :key="0">
      <div
        :class="['ak-tabs', variant !== 'underline' && `ak-tabs--${variant}`, placement === 'left' && 'ak-tabs--vertical']"
        role="tablist"
        :aria-label="label"
        :aria-orientation="placement === 'left' ? 'vertical' : undefined"
        @keydown="onKey($event, tabs)"
      >
        <button
          v-for="t in tabs"
          :id="tabId(t)"
          :key="t.name"
          type="button"
          role="tab"
          :class="['ak-tab', { 'is-active': t.name === current(tabs) }]"
          :aria-selected="t.name === current(tabs)"
          :aria-controls="isRendered(t, tabs) ? panelId(t) : undefined"
          :tabindex="t.name === current(tabs) ? 0 : -1"
          :disabled="t.disabled"
          @click="model = t.name"
        >
          <Render :content="t.label" />
        </button>
      </div>
      <template v-for="t in tabs" :key="t.name">
        <Render
          v-if="t.pane && isRendered(t, tabs)"
          :content="cloneVNode(t.pane, { id: panelId(t), 'aria-labelledby': tabId(t), hidden: t.name !== current(tabs) || undefined })"
        />
      </template>
    </template>
  </div>
</template>
