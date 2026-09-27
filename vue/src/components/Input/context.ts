import type { InjectionKey } from "vue";

export type InputSize = "sm" | "md" | "lg";

/** AkInputGroup 给组内 AkInput 的默认尺寸，也告诉它「前后缀直接作为组的子项输出，不要再包一层 .ak-input-group」 */
export const inputGroupKey: InjectionKey<{ size?: InputSize }> = Symbol("AkInputGroup");
