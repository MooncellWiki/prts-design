---
title: 按钮 Button
component: button
---

## 变体

`primary` 主色实底，一处只放一枚；`contrast` 是游戏内 `btn_on` 的黑白反转，给「开始行动」这类强动作；`danger` 叠斜纹表示不可逆；`link` 用于行内次要动作。

@demo Button/Variants

## 尺寸

高 24 / 30 / 36 / 44 / 56。默认 36 与输入框、裸控件同一刻度，一行里混排齐平。

@demo Button/Sizes

## 图标

写法同 Naive UI 的 `n-button`：`icon` 放图标，`icon-placement="right"` 放到文字后面；不写文字就是方形图标按钮，这时 `label` 必填（同时作 `aria-label` 与 `title`）。

@demo Button/Icons

## 状态

禁用、加载中（文字隐去、居中一枚圆弧转圈、`aria-busy`）、链接形态（有 `href` 时渲染成 `<a>`，禁用时用 `aria-disabled` 并去掉 `href`）。

@demo Button/States

## 按钮组

一排贴在一起的按钮（同 Naive 的 `n-button-group`，纯容器）：相邻边框重叠，`size` 给组内按钮统一尺寸。多选一的分段控件用[单选按钮组](/components/radio)（`AkRadioGroup` + `AkRadioButton`，同 Naive 的 `n-radio-button`），精英阶段切换用[阶段选择器](/arknights/phase-tabs)，不用按钮组。

@demo Button/Group

## Vue API

### AkButton

<PropsTable of="AkButton" />

### AkButtonGroup

<PropsTable of="AkButtonGroup" />

## CSS 实现

模板 / Lua 输出 `<button class="ak-btn ak-btn--primary">`（或 `<a class="ak-btn">`）即可；裸 `<button>`（Widget 直接吐出的、没有 class 的）由皮肤兜底成同样 36px 高的默认外观。

<CssClasses :files="['components/button.css']" />
