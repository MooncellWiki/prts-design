import type { InjectionKey } from "vue";

export type ButtonVariant = "default" | "primary" | "contrast" | "outline" | "ghost" | "danger" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/** AkButtonGroup 给组内 AkButton 的默认尺寸（同 Naive 的 NButtonGroup） */
export const buttonGroupKey: InjectionKey<{ size?: ButtonSize }> = Symbol("AkButtonGroup");
