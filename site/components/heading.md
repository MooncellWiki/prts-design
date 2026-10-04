---
title: 区块标题 Heading
component: heading
---

模板 / 首页的区块标题：中文标题，左侧 8px 主色粗竖条；可带一段 Bender 大写英文副题（「危机合约 CONTINGENCY CONTRACT」）。英文只是装饰层，中文负责信息——留给专题 / 活动页头这类一页一处的标题，一页里成组的区块标题只写中文（见[字体排印 · 双语标题](/foundations/typography#双语标题)）。Naive UI 没有对应组件（最近的是 `n-page-header` 的 title / subtitle / `#extra`）。

正文里编辑写的 `== 章节 ==` 由皮肤的 MediaWiki 内容样式负责（左色条 + 细底线），这里是模板 / 小部件自己输出的标题。

## 变体 · 尺寸

默认左侧粗竖条；`variant="underline"` 改成底线 + 左段 120px 主色粗线；`size="lg"` 用 display 字号（专题页、活动页头）。

@demo Heading/Variants

## 叠放 · 右侧附加

`stack` 把英文叠到标题上方当眉题（章节号、活动代号）；`#extra` 推到最右（「干员一览 ›」这类跳转链接、首页「演示：特别开放周」开关）。

@demo Heading/Extra

手机上（<640）带右侧附加的标题一行排不下，英文副题自动叠到标题下方、附加留在右侧贴底；没有附加的照旧并排。

## 可访问性

- 标题元素是真正的 `h1`–`h6`（`level`，默认 `h2`），进页面大纲；按所在层级选，不要为了字号挑级别——字号由 `size` 定。
- 英文副题带 `lang="en"`，读屏按英文念。它在标题元素外面，不进标题的可访问名。

## Vue API

<PropsTable of="AkHeading" />

## CSS 实现

`<div class="ak-heading"><h2 class="ak-heading__title">技能</h2><span class="ak-heading__en">Skills</span></div>`；叠放时英文写在标题前面。组件内的标题不继承 MediaWiki 章节标题的色条 / 底线（`title-reset.css`）。

<CssClasses :files="['components/heading.css']" />
