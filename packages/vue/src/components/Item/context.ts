import type { InjectionKey } from "vue";

export type ItemSize = "sm" | "md" | "lg";

/** AkItemList / AkMaterialsRow 给里面 AkItem 的默认尺寸（同 AkButtonGroup → AkButton） */
export const itemListKey: InjectionKey<{ size?: ItemSize }> = Symbol("AkItemList");
