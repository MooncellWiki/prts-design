---
title: 滑杆 Slider
component: slider
---

原生 `<input type="range">` 换肤（同 Naive UI 的 `n-slider`）：4px 轨道、16px 方形滑块（主色 + 表面色描边）。给等级、信赖这类在区间里拖、拖的时候就想看到结果的值；要精确输入用[数字输入](/components/input-number)，两者常常并排。

## 基本 · 步长 · 禁用

`v-model` 是数字，`min` / `max` / `step` 同原生。滑杆本身不显示数值，旁边放一个 `.ak-num`；`format-value` 给读屏念的文字（`aria-valuetext`，如「100%」）。禁用时半透明。

@demo Slider/Basic

## 可访问性

键盘与读屏都是原生的：`←` `→` `↑` `↓` 一步、`PageUp` / `PageDown` 大步、`Home` / `End` 到两端。键盘焦点是 2px 青色描边。旁边的「等级」文字不是 `<label>` 时写 `label`，或放在[表单字段](/components/field)里。

CSS 没有刻度（Naive 的 `marks`）与拖动时的数值气泡，这里也不做；要刻度时在下面另排一行文字。

## Vue API

<PropsTable of="AkSlider" />

## CSS 实现

```html
<input class="ak-slider" type="range" min="1" max="90" value="90" aria-label="等级">
```

<CssClasses :files="['components/form.css']" />
