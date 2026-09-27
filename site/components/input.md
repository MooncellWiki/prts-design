---
title: 输入框 Input
component: input
---

单行 / 多行文字输入（同 Naive UI 的 `n-input`）。`v-model` 是文字；`type="textarea"` 换成多行（`<textarea class="ak-textarea">`，最小高 90px、只能竖向拉）。其余属性（`name`、`autocomplete`、`@focus` / `@blur` / `@keydown` …）都落到原生 `<input>` / `<textarea>` 上。数字用[数字输入](/components/input-number)，搜索用[搜索框](/components/search)。

## 单行 · 多行

不在[表单字段](/components/field)里、旁边也没有 `<label>` 时写 `label`（作 `aria-label`）；占位提示只做提示，不承载必填等信息。

@demo Input/Basic

## 尺寸

高 30 / 36 / 44，与按钮同一刻度：`sm` 给表格里、工具栏，默认 36，`lg` 给独立的大输入。

@demo Input/Sizes

## 状态

禁用 = surface-3 底 + 禁用色；**只读 = 下沉底**，仍可选中复制——计算器里「只显示不编辑」的结果用 `readonly`，不要用 `disabled`。`status="error"` 红边（`aria-invalid`）、`success` 绿边；放在字段里时跟字段的 `validation-status`。输入框不做悬停态，焦点是青边 + 3px 淡青环（鼠标点进去也亮）。

@demo Input/States

## 前后缀 · 输入组

`#prefix` / `#suffix` 是贴在输入框两边的灰底块（`.ak-input-group__addon`：路径前缀、单位）。要和按钮拼成一条，外面包 `AkInputGroup`（同 Naive 的 `n-input-group`）：相邻边重叠、中间不留圆角，`size` 同时给组内的输入框和按钮。

@demo Input/Group

## Vue API

### AkInput

<PropsTable of="AkInput" />

### AkInputGroup

<PropsTable of="AkInputGroup" />

## CSS 实现

`<input class="ak-input">` / `<textarea class="ak-textarea">`；尺寸 `.ak-input--sm` / `--lg`；状态 `[readonly]` `:disabled` `.is-invalid` / `[aria-invalid="true"]` / `:user-invalid` `.is-valid`。输入组 `.ak-input-group > .ak-input-group__addon + .ak-input + .ak-btn`。

<CssClasses :files="['components/form.css']" />
