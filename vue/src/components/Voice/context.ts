import type { ComputedRef, InjectionKey } from "vue";

/** 语种选项（同 Naive 的 options：value + label） */
export interface VoiceLanguage {
  /** 语种键，= AkVoice 的 text / src 对象里的键（cn / yue / jp / en / kr …） */
  value: string;
  /** 切换条上的名字（中文-普通话） */
  label: string;
  /** 条目标题旁的徽标（CN / 粤 / JP …）；不写时是 value 的大写 */
  badge?: string;
  /** 配音演员（切换条上名字后的小字） */
  cv?: string;
}

/** AkVoiceList 给 AkVoice 的当前语种（及其徽标） */
export const voiceListKey: InjectionKey<ComputedRef<{ lang?: string; languages: readonly VoiceLanguage[] }>> =
  Symbol("AkVoiceList");

/** 游戏语种键 → HTML lang（读屏按语种发音）；不认识的键不写 lang */
export const HTML_LANG: Record<string, string> = { cn: "zh-Hans", yue: "yue", jp: "ja", en: "en", kr: "ko" };
