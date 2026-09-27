---
title: 攻击范围 Range
component: range
---

同现网 `Widget:Range/*` 的画法：自身格 = 实心蓝方块，可攻击格 = 灰色 2px 空心框，不在范围内的格不画；格 22px + 间隙 4px（= 现网 26px 格距）。只铺范围的外接矩形——`1-1` 就是两格，不补空格撑成 3×3。

## 范围形状

`grids` 直接传游戏 `range_table` 的 `grids`（`{ row, col }`，相对自身，`col` 向前为正），也可以写成 `[row, col]`；自身 (0, 0) 写不写都行。组件算出外接矩形，逐格输出 `i.self` / `i.on` / 空 `<i>`，列数写进 `--cols`。

@demo Range/Shapes

## 尺寸

`sm` 14px（技能卡侧槽 / 表格里）· 默认 22px · `lg` 28px。

@demo Range/Sizes

## 可访问性

整块是 `role="img"`，默认读作「攻击范围：自身之外 N 格」；有更贴切的说法（「正前方一格」）时用 `label` 改写。

## Vue API

<PropsTable of="AkRange" />

## CSS 实现

颜色两个钩子：`--ak-range-self`（自身格）/ `--ak-range-cell`（攻击格描边）。

<CssClasses :files="['arknights/range.css']" />
