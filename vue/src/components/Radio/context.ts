import type { InjectionKey } from "vue";

export type RadioValue = string | number;
export type RadioSize = "sm" | "md" | "lg";

/** AkRadioGroup 给组内 AkRadio / AkRadioButton 的状态（同 Naive 的 NRadioGroup 注入）；都是 getter，读的时候才取值 */
export interface RadioGroupContext {
  readonly value: RadioValue | undefined;
  readonly name: string;
  readonly disabled: boolean;
  readonly size: RadioSize | undefined;
  select(value: RadioValue): void;
}

export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol("AkRadioGroup");
