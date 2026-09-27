---
title: 阶段选择器 Phase Tabs
component: phase-tabs
---

精英阶段 E0 / E1 / E2 的选择器：一排贴在一起的小块，当前项黑白反转（同游戏内 `btn_on`）。属性计算器、攻击范围这类「同一块数据按阶段重算」的地方用；`v-model` 是当前阶段 0–2。

## 基本

图标由调用方按阶段传（`icons`，下标 = 阶段，`elite_N.png` 白线稿）：未选中项半透明，选中项落在反色块上时自动反相（`--ak-glyph-filter-inverse`，跟随系统的暗色也正确）。它和 [LV 灰块](/arknights/level)、[信赖](/arknights/trust)是同一高度，放在一行里齐平。

@demo PhaseTabs/Basic

## 低星干员 · 无图标

`max` 是最高精英阶段：三星干员 1、一 / 二星 0，只画到这一阶（没有的阶段不画成禁用——读者不需要知道「这里本来可以有 E2」）。绑定的值超出 `max` 时按最高阶显示。不传 `icons` 只有文字。

@demo PhaseTabs/Max

## 语义：单选组，不是页签

它不切换面板，只改一个值、下游数据跟着重算，所以按 [WAI-ARIA Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) 做：外层 `role="radiogroup"`（`label` 默认「精英阶段」），每项 `<button role="radio" aria-checked>`。要切换几块各自独立的内容时用[标签页](/components/tabs)。

| 键 | 行为 |
|---|---|
| `Tab` | 进入 / 离开整组（只有当前阶段在 Tab 顺序里） |
| `→` / `↓` | 下一阶并选中（末尾回到第一阶） |
| `←` / `↑` | 上一阶并选中（开头回到最后一阶） |
| `Space` / `Enter` | 选中当前焦点项 |

## Vue API

<PropsTable of="AkPhaseTabs" />

## CSS 实现

CSS 只管外观；没有 Vue 的页面（MW 模板）由页面脚本切换 `.is-active`。

<CssClasses :files="['arknights/phase-tabs.css']" />
