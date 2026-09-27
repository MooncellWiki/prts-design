---
title: 标签 Tag
component: tag
---

## 变体

状态色（info / success / warning / danger）走「淡底 + 色字」，两套主题各自成立；实底只有强调青、次强调黄、反转，以及两枚红——`new`（NEW 角标）和 `danger-solid`（BREAKING）。**红只表示危险与 NEW / BREAKING**。

@demo Tag/Variants

## 尺寸 · 标签字 · 圆点 · 可移除

`caps` 换成 Bender 大写加字距，给版本号 / 状态码这类拉丁短词；`removable` 出一个移除按钮，点击触发 `remove`，读屏名是「移除 + 标签文字」。一组标签放进 `.ak-tags`（换行 + 6px 间距）。

@demo Tag/Details

## Vue API

<PropsTable of="AkTag" />

## CSS 实现

计数徽标、可交互的筛选芯片是另外两个组件：[徽标 Badge](/components/badge)、[芯片 Chip](/components/chip)。

<CssClasses :files="['components/tag.css']" />
