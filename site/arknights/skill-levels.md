---
title: 技能等级选择 SkillLevels
component: skill-levels
---

1–7 级 + 专精 Ⅰ–Ⅲ 的一条单选。**只给需要「当前等级」的场合**——高亮[全等级表](/arknights/skill-sheet)的一行、钉住[参数矩阵](/arknights/skill-matrix)的一列、计算器里选等级；干员页正文照现网一张表列完所有等级，不用它来回切。

## 等级 1–7 + 专精

`v-model` 是等级 1–10（8–10 = 专精 Ⅰ–Ⅲ）。专精格画游戏图标（`mastery-icons` 传 `specialized_tiny_1–3.png` 的地址），选中时蓝底；没给图标时写 M1–M3。三星及以下没有专精：`max="7"`。

@demo SkillLevels/Basic

## 配全等级表

选择器的 `v-model` 与全等级表的 `highlight` 绑同一个值：选哪一级，表里那一行就高亮（`tr.is-hl`）。和参数矩阵的联动见[参数矩阵](/arknights/skill-matrix#配等级选择器)。

@demo SkillLevels/Linked

## 键盘

按 [WAI-ARIA Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)：整条是 `role="radiogroup"`（`label` 是组名，默认「技能等级」），每格 `role="radio"` + `aria-checked`；专精格的名字来自图标的 `alt`（「专精1」）。

| 键 | 行为 |
|---|---|
| `Tab` | 进入 / 离开（只停在选中的那一格） |
| `→` / `↓` · `←` / `↑` | 下一级 / 上一级并选中（首尾循环） |
| `Home` / `End` | 1 级 / 最高一级 |

## Vue API

<PropsTable of="AkSkillLevels" />

## CSS 实现

按钮 `all: unset` 去掉了原生外观，焦点环由 `.ak-skill-levels > button:focus-visible` 补回（内缩 2px）；禁用同按钮（半透明、不可点）。

<CssClasses :files="['arknights/skill-levels.css']" />
