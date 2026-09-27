import type { IconName } from "../../icons";

export type DropdownKey = string | number;

/** 一个菜单项（同 Naive 的 DropdownOption；label 只收字符串，图标是 AkIcon 的名字） */
export interface DropdownOption {
  key: DropdownKey;
  label: string;
  icon?: IconName;
  disabled?: boolean;
  /** 破坏性动作（红字，如「删除」） */
  danger?: boolean;
  /** 有地址时渲染成 <a>（MW 门户链接那种），仍会触发 select */
  href?: string;
  type?: undefined;
}

/** 分隔线 */
export interface DropdownDividerOption {
  type: "divider";
  key?: DropdownKey;
}

/** 带小标题的一组（同 Naive 的 type: "group"） */
export interface DropdownGroupOption {
  type: "group";
  key?: DropdownKey;
  label: string;
  children: Array<DropdownOption | DropdownDividerOption>;
}

export type DropdownMixedOption = DropdownOption | DropdownDividerOption | DropdownGroupOption;
