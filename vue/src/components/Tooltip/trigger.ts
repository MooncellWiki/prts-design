import { Comment, Fragment, Text, cloneVNode, h, type VNode } from "vue";

/** 原生就在 Tab 顺序里的标签（a 要有 href 才算，交给调用方自己保证） */
const FOCUSABLE = new Set(["a", "button", "input", "select", "textarea", "summary"]);

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap(n => (n.type === Fragment && Array.isArray(n.children) ? flatten(n.children as VNode[]) : n.type === Comment ? [] : [n]));

/**
 * 触发元素写在插槽里（同 Naive 的 NPopover #trigger / NDropdown 默认插槽）：取第一个元素 / 组件 vnode 克隆一份，
 * 补上 ARIA 属性与事件（与它自己的合并，不覆盖）。只有文字时包一层 <span>；
 * focusable 时，原生不可聚焦的元素（span / abbr / img …）补 tabindex="0"，键盘也能触发——组件（AkButton 等）假定自己渲染可聚焦元素。
 */
export function decorateTrigger(nodes: VNode[] | undefined, extra: Record<string, unknown>, focusable = true): VNode | undefined {
  const list = flatten(nodes ?? []).filter(n => n.type !== Text || String(n.children).trim());
  const first = list[0];
  if (!first) return undefined;
  if (first.type === Text) return h("span", { tabindex: focusable ? 0 : undefined, ...extra }, list);
  const p = first.props ?? {};
  const needsTab = focusable && typeof first.type === "string" && !FOCUSABLE.has(first.type) && p.tabindex == null && p.tabIndex == null;
  return cloneVNode(first, needsTab ? { tabindex: 0, ...extra } : extra, true);
}

/** 把 vnode 原样渲染；定义在组件外保持同一个组件类型，重渲染时不重建（同 AkTabs） */
export const Render = (p: { content: unknown }) => (typeof p.content === "function" ? p.content() : p.content);
