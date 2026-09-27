---
title: 筛选芯片 Chip
component: chip
---

可交互的开关按钮：干员一览的筛选栏、干员页语音记录的语种切换。与[标签](/components/tag)的分工：标签是只读的分类 / 状态标记，芯片是能点的筛选条件。

写法同 Naive UI 的 `n-tag checkable`：`v-model` 是否选中（Naive 的 `checked`），点击切换。渲染成 `<button type="button" aria-pressed>`，选中时主色实底 + 左上角三角角标（与标签页、卡片的选中角标同一枚），不占行内宽度。

## 筛选（多选）

每枚芯片各自一个布尔值。一组芯片放进带 `role="group"` 与 `aria-label` 的容器（「职业」「稀有度」），读屏念「职业 分组 · 近卫 切换按钮 已按下」。

@demo Chip/Filter

## 单选（语音语种）

一组里只能选一个时：各自 `:model-value="lang === key"` + `@update:model-value="lang = key"`，再点已选中的那枚不会取消。干员页语音记录的语种切换就是这样。

@demo Chip/Single

## 可访问性

- 芯片是原生 `<button type="button">`：`Tab` 聚焦，`Enter` / `Space` 切换。
- 状态用 `aria-pressed`（[WAI-ARIA Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) 的切换按钮），不用 `aria-selected` / `aria-checked`。
- 选中不只靠颜色：实底反转、角标、字重 600 三处同时变。
- `AkChip` 带 `data-no-toggle`：皮肤脚本会在 document 上替模板输出的纯 CSS 芯片翻 `is-active` / `aria-pressed`，状态归 Vue 管的芯片要退出这层委托，否则两边各翻一次。

## Vue API

<PropsTable of="AkChip" />

## CSS 实现

模板里写 `<button type="button" class="ak-chip" aria-pressed="false">近卫</button>`；`aria-pressed="true"` 与 `.is-active` 两种写法都认。切换由皮肤脚本（document 级委托）负责，不想被它接管的容器标 `data-no-toggle`。

<CssClasses :files="['components/chip.css']" />
