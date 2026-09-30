import type { ComputedRef, InjectionKey } from "vue";

/** 语种选项（同 Naive 的 options：value + label） */
export interface VoiceLanguage {
  /** 语种键，= AkVoice 的 text / src 对象里的键（cn / yue / jp / en / kr …） */
  value: string;
  /** 切换条上的名字（中文-普通话） */
  label: string;
  /** 配音演员（切换条上名字后的小字） */
  cv?: string;
}

/** 文本语言选项（台词的语言：中文 / 日文 / 繁体中文 / 中文-方言 …） */
export interface VoiceText {
  /** 文本键，= AkVoice 的 text 对象里的键 */
  value: string;
  /** 切换条上的名字 */
  label: string;
}

/** AkVoiceList 给 AkVoice 的：当前语种、文本语言选项与选中的几种 */
export const voiceListKey: InjectionKey<
  ComputedRef<{ lang?: string; languages: readonly VoiceLanguage[]; texts: readonly VoiceText[]; shownTexts: readonly string[] }>
> = Symbol("AkVoiceList");

/** 游戏语种键 → HTML lang（读屏按语种发音）；不认识的键不写 lang */
export const HTML_LANG: Record<string, string> = { cn: "zh-Hans", yue: "yue", jp: "ja", en: "en", kr: "ko" };
