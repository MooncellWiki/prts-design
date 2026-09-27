---
title: 下拉选择 Select
component: select
---

原生 `<select>` 换肤（与裸 `<select>` 同一枚 ▾，`--ak-select-arrow`）：弹出的列表、键盘、手机上的滚轮选择器、读屏都是浏览器自己的，所以只画关着时的那个框。选项照 Naive UI 的 `n-select` 用 `options` 数组给，`v-model` 是选中项的 `value`（数字也行）。

## 基本

`placeholder` 是一个选不到的空选项：没选（`v-model` 为 `null` / `undefined`）时显示它。

@demo Select/Basic

## 分组 · 禁用项

`{ type: "group", label, children }` 渲染成 `<optgroup>`；选项写 `disabled: true` 选不到。

@demo Select/Groups

## 尺寸 · 状态

高 30 / 36 / 44，与输入框同一刻度。禁用、`status="error"`（红边 + `aria-invalid`）、`success`（绿边）；放在[表单字段](/components/field)里时跟字段的 `validation-status`。

@demo Select/States

## 什么时候不用它

- 选项 ≤ 5 个、又想一眼看全：用[单选](/components/radio)；立即生效的视图切换用单选按钮组。
- 要搜索 / 多选 / 自定义选项外观：原生 `<select>` 做不到，需要下拉菜单类组件（`.ak-dropdown`）另做。

## Vue API

<PropsTable of="AkSelect" />

## CSS 实现

`<select class="ak-select">`；尺寸 `.ak-select--sm` / `--lg`；状态 `:disabled` `[aria-invalid="true"]` / `:user-invalid` `.is-valid`。

<CssClasses :files="['components/form.css']" />
