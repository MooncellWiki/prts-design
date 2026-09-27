---
title: 卡片 Card
component: card
---

一件可并列 / 可点的东西：1px 边框、直角、表面色，不投影（只有悬停时浮起）。与[面板](/components/panel)的分工：卡片是一组里的一件（活动、章节、技能选项），面板是页面上一块有名字的区域（「今日信息」「新增关卡」）。

写法同 Naive UI 的 `n-card`：`title`（或 `#header`）、`#header-extra`、`#footer`、`#cover`；外观用 `variant`、色条用 `accent`。

## 封面 · 眉题 · 页脚

`cover` 放一张 16:9 裁切的封面；`eyebrow` 是标题上方的灰色 Bender 小字（不上青：不可点的装饰小标签，青色会读成链接）；`#footer` 是表面 2 底、上面一道线的一栏。`horizontal` 横排：封面在左占 40%、正文在右。

@demo Card/Cover

## 标题栏 · 选中

默认标题 / 眉题直接排在正文顶部；`segmented`（同 Naive）让标题单独成一栏、下面一道分隔线——写了 `#header-extra`（标签、按钮）时自动成栏。`selected` 是选中态：主色 1px 内描边 + 左上角三角角标（源自游戏内技能选中框）。

@demo Card/Header

## 外观 · 色条

`variant`：默认表面色 + 1px 边 · `flat` 无边、表面 2 底（卡里再套一层）· `inset` 凹陷底。`accent="top"` 顶部 3px / `accent="left"` 左侧 4px 主色条，与 1px 细框用 border-image 直角拼接、不斜接。

@demo Card/Variants

## 卡片网格 · 整卡链接

`AkCardGrid` 自动填充，每列至少 260px（窄屏一列）。整张卡是链接时写 `href`：渲染成 `<a>` 并带 `ak-not-prose`（正文的链接色、悬停下划线、`:visited` 褪色不进来），配 `hoverable` 给悬停反馈；这时卡里不要再放别的链接。

@demo Card/Grid

## Vue API

### AkCard

<PropsTable of="AkCard" />

### AkCardGrid

卡片网格：只有默认插槽，放若干 `AkCard`。

## CSS 实现

`.ak-card__title` 放在 `.ak-card__header` 里是标题栏，放在 `.ak-card__body` 顶部（前面可以有 `.ak-card__eyebrow`）是无分隔的标题。整块是链接的卡片在最外层标 `ak-not-prose`。

<CssClasses :files="['components/card.css']" />
