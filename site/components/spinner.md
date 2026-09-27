---
title: 加载 Spinner
component: spinner
---

游戏内 loading 的**菱形涟漪**：中央常驻一枚空心菱形（中坚术师分支图标那枚），另一枚环从它身上冒出来、边扩边淡到没，1.2s 一枚。减弱动效时环不出，只留中央静止的菱形。按钮的加载态不用它（36px 高里放不开），是[按钮](/components/button/)自己的圆弧转圈。

写法同 Naive UI 的 `n-spin`：`description`、`show`、默认插槽包住内容。

## 样子 · 说明

`variant="bars"` 是三根竖条（更轻，放在行内）。`color` 换色（写到 CSS 约定的 `--_c`，只对菱形生效）。`description` 排在图形下方。

@demo Spinner/Variants

## 包住内容

默认插槽写了内容时，`show` 为真就把内容压淡、不可点，菱形 + 说明叠在正中；容器标 `aria-busy`。适合表格、卡片这类「旧内容还在、新数据在路上」的局部刷新；整块还没有内容时用[骨架屏](/components/skeleton)。

@demo Spinner/Wrap

## 可访问性

- 图形 `role="status"`，可访问名默认「加载中」（`label` 改写）；有说明时念说明。
- 包住内容时容器 `aria-busy="true"`，读屏等加载完再念变化。

## Vue API

<PropsTable of="AkSpinner" />

## CSS 实现

大小由 `font-size` 定（默认 12px → 29px 见方），`--_c` 换色。说明与加载层（`.ak-spin` / `.ak-spin-container`）是给 Vue 组件补的外壳，模板里一般直接放 `<span class="ak-spinner" role="status" aria-label="加载中"></span>`。

<CssClasses :files="['components/spinner.css']" />
