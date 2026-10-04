---
title: 信赖 Trust
component: trust
---

信赖读数：游戏的信赖图标 + 百分比（Bender 粗体）。图标走皮肤的素材接口（`base/skin-assets.css` 的 `--ak-trust-icon`，= prts.wiki 文件:图标_信赖.png，白色线稿，亮色主题下随 `--ak-glyph-filter` 反相）；只加载组件层（`standalone.css`：站外页面、npm 包）时没有这个变量，`.ak-trust` 只有数字，不出图标也不占位——不画替代图形；要图标就在 `:root` 上设 `--ak-trust-icon`（指到 media.prts.wiki 的绝对地址）和 `--ak-trust-content: ""`。

## 信赖值

@demo Trust/Values

## 可访问性

图标是 `::before` 伪元素，读屏读不到：`AkTrust` 在数字前补一段 `.ak-sr-only` 的「信赖」（`label` 可改写，写空串去掉——比如表头已经写了「信赖」）。

## Vue API

<PropsTable of="AkTrust" />

## CSS 实现

<CssClasses :files="['arknights/trust.css']" />
