---
title: 大标题横幅 Hero
component: hero
---

官网风格的页头横幅：黑底，青色 overline，下面是展示字大号的拉丁标题（`subtitle` 作中文副标）、青色横条和说明文字，右侧是一块竖直的青色色面，叠了渐隐的网点。两套主题下都是黑底白字。

## 大标题横幅

@demo Hero/Basic

## 带按钮 · 无色面

说明下面的内容（按钮等）放进默认插槽。`:side="false"` 去掉右侧色面，`:bar="false"` 去掉青色横条。

@demo Hero/Actions

## 和首页轮播的关系

[首页设计稿](/patterns/home)顶部的活动轮播（暗色黑块 / 亮色白面板 = 幻灯片 + 候选列表 + 进度条 + 暂停）不是这个组件。它是首页自己的结构：类名是 `.mp-hero*`，样式写在页面的 TemplateStyles 里，只有 `MediaWiki:首页` 这一处用，所以没有进 `src/`，也就没有对应的 Vue 组件。幻灯片里用到的倒计时、标签、按钮都是现成的组件（[倒计时](/arknights/event)、[标签](/components/tag)、[按钮](/components/button/)）。

## Vue API

<PropsTable of="AkHero" />

## CSS 实现

<CssClasses :files="['arknights/hero.css']" />
