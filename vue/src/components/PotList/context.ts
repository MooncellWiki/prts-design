import type { InjectionKey } from "vue";

/** AkPotList 给格子的当前潜能（格子自己比较决定是否点亮） */
export const potListKey: InjectionKey<{ value?: number }> = Symbol("AkPotList");
