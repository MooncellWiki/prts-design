import type { InjectionKey } from "vue";

/** AkKv 给 AkKvItem 的排法：内联版每对 dt + dd 要包一层 <div>（dl > div > dt + dd） */
export const kvKey: InjectionKey<{ readonly inline?: boolean }> = Symbol("AkKv");
