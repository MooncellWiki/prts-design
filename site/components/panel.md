---
title: 面板 Panel
component: panel
---

页面上一块有名字的区域（游戏内 announce panel）：标题栏是表面 2 底 + 左侧 4px 主色条，标题后可跟 Bender 大写英文；正文 16px 内距。首页的「今日信息」「新增关卡」「新增家具」都是它。与[卡片](/components/card)的分工：卡片是一组里的一件，面板是一块区域——同一时刻的信息放进同一张面板，不拆成几个框。

## 基础 · 标题栏附加

`en` 是标题后的英文（灰、大写、字距）；`#header-extra` 放在标题栏右侧（日期标签、按钮）。面板是页面大纲里的一节时用 `title-tag="h3"` 这类真正的标题元素。

@demo Panel/Basic

## 反转 · 可折叠

`inverse` 标题栏黑白反转（亮色下黑底白字、暗色下白底黑字），给公告这类要跳出来的区域。`collapsible` 可折叠：点标题栏收起 / 展开，右端出现开合记号（收起 ＋ / 展开 −）；展开状态是 `v-model`（默认展开），外部也能控制。标题栏里的链接 / 按钮自己处理点击，不会顺带折叠。

@demo Panel/Collapsible

## 键盘

可折叠时标题文字是 `role="button"`（放在标题元素**里面**，`h3` 的大纲语义不丢，同 [WAI-ARIA Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)），带 `aria-expanded` 与指向正文的 `aria-controls`。

| 键 | 行为 |
|---|---|
| `Tab` | 聚焦标题 |
| `Enter` / `Space` | 收起 / 展开 |

## Vue API

<PropsTable of="AkPanel" />

## CSS 实现

CSS 实现只负责外观：折叠状态是 `.is-collapsed`，模板输出的纯 CSS 面板由皮肤脚本（document 级委托，点 `.ak-panel--collapsible > .ak-panel__head` 就翻）切换。`AkPanel` 与这段脚本共存：点击派发完后再落 `v-model`，并把 class 压回与状态一致。

<CssClasses :files="['components/panel.css']" />
