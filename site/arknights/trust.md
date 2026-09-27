---
title: 信赖 Trust
component: trust
---

信赖读数：CSS 画的红心 + 百分比（Bender 粗体）。模组 / 干员密录 / 档案的解锁需求、属性计算器的控制行里用。

## 信赖值

@demo Trust/Values

## 可访问性

红心是 `::before` 伪元素，读屏读不到：`AkTrust` 在数字前补一段 `.ak-sr-only` 的「信赖」（`label` 可改写，写空串去掉——比如表头已经写了「信赖」）。

## Vue API

<PropsTable of="AkTrust" />

## CSS 实现

<CssClasses :files="['arknights/trust.css']" />
