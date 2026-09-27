import type { InjectionKey } from "vue";

export type CollapseName = string | number;

/** AkCollapse 给 AkCollapseItem 的展开状态（同 Naive 的 NCollapse：子项只需要父组件的状态，走 provide / inject） */
export const collapseKey: InjectionKey<{
  isOpen: (name: CollapseName) => boolean;
  set: (name: CollapseName, open: boolean) => void;
}> = Symbol("AkCollapse");
