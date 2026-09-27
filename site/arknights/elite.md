---
title: 精英化 Elite
component: elite
---

精英阶段图标 + 标签字（Bender 粗体小字）。图标是游戏 `elite_hub` 的白色原图，亮色主题下反相为黑；地址由调用方传（`elite_N.png`，大图 `elite_N_large.png`）。

要让读者**切换**精英阶段（属性计算器、攻击范围），用[阶段选择器](/arknights/phase-tabs)；这里只是读数。

## 阶段 · 等级 · 大图标

`phase` 给出默认文字「精英零 / 一 / 二」，`level` 接在后面（「精英二 Lv60」，模组 / 档案的解锁需求）。有文字时图标是装饰（`alt=""`）；`text=false` 只显示图标，这时阶段名（或 `label`）作图标的 `alt`。`size="lg"` 图标 28px 高，配大图用。

@demo Elite/Phases

## 改写文字

`text` 改写整段文字：精英化材料表的行头（「提升至精英阶段 1 等级 1」）、专精材料表的行头（同一枚组件换专精小图标 `specialized_tiny_N.png`）。要带链接 / 加粗时写在默认插槽里。天赋表条件列的「· X模组 2级」写在组件外面。

@demo Elite/Text

## Vue API

<PropsTable of="AkElite" />

## CSS 实现

放进表格单元格 / 键值表的 `dd` 时，数字走正文字体（`table-numerals.css` 的表格硬规则兜底）。

<CssClasses :files="['arknights/elite.css']" />
