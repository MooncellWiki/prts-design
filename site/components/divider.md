---
title: 分隔线 Divider
component: divider
---

把一段内容和下一段分开。写法同 Naive UI 的 `n-divider`：默认插槽写字就是中间带字的分隔，`vertical` 是行内竖线。

## 变体 · 文字

默认 1px 线（`<hr>`，上下 24px）；`accent` 左段 80px 主色 + 其余细线（2px 高，章节收尾）；`stripes` 6px 斜纹带（「以下为存档」这类警示性的分界）；默认插槽写字时是小号大写标签字、两侧线段（`role="separator"`）。带文字时 `variant` 不适用。

@demo Divider/Variants

## 竖线

`vertical`：行内 1px × 1em，左右 8px，隔开同一行里的几项（页面动作、干员的分支 · 编号 · 势力）。`role="separator"` + `aria-orientation="vertical"`。

@demo Divider/Vertical

## Vue API

<PropsTable of="AkDivider" />

## CSS 实现

横线用 `<hr class="ak-divider">`（自带分隔语义）；带文字的用 `<div class="ak-divider ak-divider--text" role="separator">`；竖线 `<span class="ak-divider ak-divider--vertical" role="separator" aria-orientation="vertical">`。

<CssClasses :files="['components/divider.css']" />
