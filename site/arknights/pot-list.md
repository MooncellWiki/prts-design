---
title: 潜能提升一览 Pot List
component: pot-list
---

干员页「潜能提升」一节，同现网 <code v-pre>{{潜能提升}}</code> 的五格表：潜能 2–6 各一格 = 潜能图标 + 小标 + 效果，格子按宽度自动折行（每格最窄 150px），1px 格线。

## 基本

`AkPotList` 里放若干 `AkPot`：`level` 是潜能等级（给出小标「潜能 N」），效果写在默认插槽里（可带富文本 `.ak-rt-vup`）。`AkPotList` 的 `value` 是当前潜能——属性计算器选了潜能后传进来，等级不超过它的格子点亮（顶部青条 + 青色小标，`.is-on`）；单独一格要强制点亮 / 熄灭时写 `AkPot` 的 `active`。

@demo PotList/Basic

## 可访问性

整张表是一个列表（`role="list"` / `listitem`）。小标已经写了「潜能 N」，图标 `alt` 为空；点亮的格子另有一段读屏文本「（已生效）」，不只靠颜色。

## Vue API

### AkPotList

<PropsTable of="AkPotList" />

### AkPot

<PropsTable of="AkPot" />

## CSS 实现

图标是[潜能](/arknights/potential)组件的 `.ak-potential`。

<CssClasses :files="['arknights/pot-list.css']" />
