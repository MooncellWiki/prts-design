---
title: 档案类卡片 Archive
component: archive
---

干员密录 / 悖论模拟 / 未获得时档案——现网那几张「————xx」折叠 wikitable 的替身。与[档案](/arknights/dossier)同一张脸，多了面板头（左青条 + 小标 + 标题）、右侧解锁条件和页脚。

写法参考 Naive UI 的 `n-card`：`title` + 默认插槽（正文）+ `#footer`（页脚）。解锁条件是纯文本时用 `unlock`，要放精英阶段 / 信赖 / 关卡号时用 `#unlock` 插槽；前面的小标默认「解锁条件」，用 `unlock-label` 改写。

## 未获得时档案

@demo Archive/Intel

## 干员密录 · 悖论模拟

页脚放阅读 / 关卡 / 首通奖励。`AkArchivePlay` 是页脚里那块黑底「阅读 / 播放」：有 `href` 时是链接（去密录页），没有时是按钮。

@demo Archive/Record

## Vue API

### AkArchive

<PropsTable of="AkArchive" />

### AkArchivePlay

<PropsTable of="AkArchivePlay" />

## CSS 实现

<CssClasses :files="['arknights/archive.css']" />
