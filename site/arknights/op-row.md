---
title: 干员条目 Op Row
component: op-row
---

列表 / 表格里一行一位干员：36px 头像（垫稀有度色的渐变底，见[稀有度 · 头像底](/arknights/rarity#头像底)）+ 名字 + 第二行小字。整条是一个链接（`href`），外层带 `ak-not-prose`，不吃正文链接色。要卡片式的网格用[干员卡](/arknights/op-card)。

## 条目

`meta` 是第二行小字（分支 / 职业）；`stars` 在它前面画一排按稀有度色阶着色的小星（[稀有度](/arknights/rarity) `variant="tier" size="sm"`）。

@demo OpRow/Basic

## 表格里 · 自定义第二行

`#meta` 插槽代替 `meta`，可以放[标签](/components/tag)或链接。

@demo OpRow/Table

## Vue API

<PropsTable of="AkOpRow" />

## CSS 实现

头像是通用组件 `.ak-avatar`（`components/avatar.css`），条目只改它的尺寸和左边条。

<CssClasses :files="['arknights/op-row.css']" />
