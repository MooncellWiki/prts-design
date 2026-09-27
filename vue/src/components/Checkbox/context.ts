import type { InjectionKey } from "vue";

export type CheckValue = string | number;
export type CheckSize = "sm" | "md";

/** AkCheckboxGroup 给组内 AkCheckbox 的状态（同 Naive 的 NCheckboxGroup 注入）；都是 getter，读的时候才取值 */
export interface CheckboxGroupContext {
  readonly value: CheckValue[];
  readonly disabled: boolean;
  readonly size: CheckSize | undefined;
  /** 已选满 max：没勾的不能再勾 */
  readonly full: boolean;
  /** 已到 min：勾着的不能再取消 */
  readonly atMin: boolean;
  toggle(value: CheckValue, checked: boolean): void;
}

export const checkboxGroupKey: InjectionKey<CheckboxGroupContext> = Symbol("AkCheckboxGroup");
