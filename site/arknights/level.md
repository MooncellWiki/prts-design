---
title: 等级 Level
component: level
---

等级读数「LV 90」：横排，LV 小标坐在数字基线上；数字等宽（`tabular-nums`），E0 / E1 / E2 切换 50 → 80 → 90 时宽度不跳。

## 读数 · 灰块

`variant="badge"` 是主题灰块（`surface-3` + 正文色，24px 高），与[阶段选择器](/arknights/phase-tabs)、开关、[信赖](/arknights/trust)在控制行里同一条线。它是**读数**不是按钮，所以不反白——反白在本系统里是「选中 / 可点」（阶段选择器的当前项、`contrast` 按钮），读数块挨着 E2 再反白就像又一个选中项。

@demo Level/Variants

## Vue API

<PropsTable of="AkLevel" />

## CSS 实现

<CssClasses :files="['arknights/level.css']" />
