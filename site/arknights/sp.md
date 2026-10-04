---
title: SP 标签 Sp
component: sp
---

技能的技力（SP）信息，三种小件：

- **SP 类型** `AkSp`：技力怎么回复，颜色同游戏——绿 = 自动回复、橙 = 攻击回复、黄 = 受击回复、紫 = 被动回复（仅在特殊条件下回复技力）、灰 = 被动；色值与白字照现网 <code v-pre>{{技能类型}}</code>（`#8EC31F` / `#FC793E` / `#F4AF09` / `#C289E3` / `#808080`），玩家认的就是这套；
- **触发方式** `AkSpTrigger`：手动触发、自动触发都是灰底白字（现网两者同为 `#808080`），靠文字区分；
- **数值芯片** `AkSpValue`：消耗（游戏 `skill_sp_cost_bkg` 的荧光绿闪电）、初始（▶）、持续（⏱）。三枚同高同内距，图形是单色 SVG mask（不用 emoji——彩色闪电字形基线不稳，两枚并排会错半像素）。

[技能卡](/arknights/skill)、[全等级表](/arknights/skill-sheet)、[参数矩阵](/arknights/skill-matrix)都由它们拼成。

## SP 类型 · 触发

默认文字就是游戏里的写法，也可以写在默认插槽里改写。悬停提示默认是游戏内的说明（「每次攻击回复1点技力」「技力达到需求并满足开启条件后，需要玩家手动开启的技能」），`tip` 改写、`tip=false` 关掉；被动没有技力，默认不给提示。

@demo Sp/Types

## 数值芯片

`value` 是数值；表头图例写字（「消耗」）时写在默认插槽里。悬停提示默认是这一项的解释（「消耗：该技能所需要消耗的技力数」）。

@demo Sp/Values

## 可访问性

白字在绿 / 黄底上对比度不到 4.5:1——为了与游戏和现网一致保留了这套配色；每枚标签都有悬停说明（游戏内的原话），信息不单靠颜色。

芯片的图形是 CSS mask，读屏读不出来：写 `value` 时芯片里在数字前补一段 `.ak-sr-only` 的名字（读作「消耗36」）。一两句话的说明提示用可折行的宽气泡 `.ak-tip--wide`。

## Vue API

### AkSp

<PropsTable of="AkSp" />

### AkSpTrigger

<PropsTable of="AkSpTrigger" />

### AkSpValue

<PropsTable of="AkSpValue" />

## CSS 实现

颜色令牌：`--ak-sp-auto` / `--ak-sp-attack` / `--ak-sp-hit` / `--ak-sp-passive`。芯片落进表格单元格时字体回正文（`table-numerals.css` 的表格硬规则，见[全等级表](/arknights/skill-sheet#表格里的数字)）。

<CssClasses :files="['arknights/sp.css']" />
