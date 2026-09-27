---
title: 阵营 Camp
component: camp
---

势力徽标 + 名字。徽标是游戏 `spritepack/ui_camp_logo` 里的白色线稿，亮色主题下由 CSS 反相成黑色（走 `--ak-glyph-filter` 令牌），所以同一张图两套主题都能用。常见用法是放在干员信息的键值表里，写在「阵营」那一格。

## 徽标 + 名字

徽标高 28px，名字跟在右边，字重和正文一样。

@demo Camp/Basic

## 深底方块 · 大号

`variant="box"` 是深底方块：徽标保持白色原色，不跟主题反相，两套主题下外观一致。`size="lg"` 徽标高 48px。`logo-only` 只显示徽标，名字作为图片的 `alt`，同时作悬停提示。

@demo Camp/Variants

## Vue API

<PropsTable of="AkCamp" />

## CSS 实现

<CssClasses :files="['arknights/camp.css']" />
