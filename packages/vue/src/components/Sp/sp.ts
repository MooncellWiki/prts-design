/** 技力回复方式（游戏内 spType）：自动回复 绿 · 攻击回复 橙 · 受击回复 黄 · 被动回复 紫 · 被动 灰 */
export type SpType = "auto" | "attack" | "hit" | "passive-recovery" | "passive";

/** SP 数值芯片：cost 消耗（荧光绿闪电）· init 初始（▶）· duration 持续（⏱） */
export type SpValueKind = "cost" | "init" | "duration";

export const SP_TYPE_TEXT: Record<SpType, string> = { auto: "自动回复", attack: "攻击回复", hit: "受击回复", "passive-recovery": "被动回复", passive: "被动" };

/** 游戏内的技力说明（prts.wiki 干员页的悬停提示）；被动技能没有技力，不给 */
export const SP_TYPE_TIP: Record<SpType, string | undefined> = {
  auto: "每秒回复1点技力",
  attack: "每次攻击回复1点技力",
  hit: "每次受到攻击回复1点技力",
  "passive-recovery": "仅在特殊条件下回复技力",
  passive: undefined,
};

export const TRIGGER_TEXT = { manual: "手动触发", auto: "自动触发" } as const;
export const TRIGGER_TIP = {
  manual: "技力达到需求并满足开启条件后，需要玩家手动开启的技能",
  auto: "技力达到需求并满足开启条件后，自动开启的技能",
} as const;

export const SP_VALUE_CLASS: Record<SpValueKind, string> = { cost: "ak-sp-cost", init: "ak-sp-init", duration: "ak-sp-dur" };
/** 读屏用的名字（芯片的图形是 CSS mask，读不出来） */
export const SP_VALUE_NAME: Record<SpValueKind, string> = { cost: "消耗", init: "初始", duration: "持续" };
export const SP_VALUE_TIP: Record<SpValueKind, string> = {
  cost: "消耗：该技能所需要消耗的技力数",
  init: "初始：干员部署后预置的技力数（每次部署仅一次）",
  duration: "持续：该技能的持续时间（秒）",
};
