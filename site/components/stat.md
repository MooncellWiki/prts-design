---
title: 统计数字 Stat
component: stat
---

一个关键数字：小号大写的名称（overline）+ 大号 Bender 等宽数字 + 可选的升降变化量。顶边 2px 主色条的小卡片（最窄 120），一排放进 `AkStatRow` 自动铺满、放不下换行；`inline` 是一行「名称 数值」，放进正文 / 表格。

## 一排统计 · 变化量 · 单位

写法同 Naive UI 的 `n-statistic`：`label` 名称、`value` 数值（原样显示，千分位由调用方先排好），`#prefix` / `#suffix` 插槽放数值前后的东西——`#suffix` 渲染成半号小字（`2.3k` 的 k）。`delta` 是变化量，颜色取游戏富文本的升 / 降色，方向默认按开头的 `+` / `-` 判断，`trend` 可显式指定。

@demo Stat/Basic

## 行内

@demo Stat/Inline

## Vue API

### AkStat

<PropsTable of="AkStat" />

### AkStatRow

一排统计卡片（`div.ak-stat-row`）：`repeat(auto-fit, minmax(120px, 1fr))`，间距 12。只有默认插槽。

## CSS 实现

`div.ak-stat > span.ak-stat__label + span.ak-stat__value( 数字 + small 单位 ) + span.ak-stat__delta(--up | --down)`。`.ak-stat` 自带 `box-sizing: border-box`，窄屏不会撑破容器。

<CssClasses :files="['components/stat.css']" />
