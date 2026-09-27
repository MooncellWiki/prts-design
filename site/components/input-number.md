---
title: 数字输入 InputNumber
component: input-number
---

常显 − / + 的步进器（同 Naive UI 的 `n-input-number`）：等级、信赖、潜能、材料数量这类有上下限的整数。裸 `<input type="number">` 的原生 ▲▼ 只在悬停 / 聚焦时出现（Chrome），要一直看得见按钮用它。输入框定宽 56px、数字等宽（改值不跳动）。

## 上下限 · 步长

`v-model` 是数字（清空后是 `null`）。打字时是合法数字且在范围内就实时更新，否则等失焦 / 回车再落到范围内（超了收到上下限，不是数字退回原值）；到上下限时对应的按钮变灰。

@demo InputNumber/Basic

## 状态

`:show-button="false"` 只留输入框；`readonly` 能看能复制不能改（按钮一并锁住）；`disabled`；`placeholder` 给「清空 = 不限」这类语义。

@demo InputNumber/States

## 键盘

输入框是 `role="spinbutton"`（`aria-valuenow` / `aria-valuemin` / `aria-valuemax`），按 [WAI-ARIA Spinbutton](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)：

| 键 | 行为 |
|---|---|
| `↑` / `↓` | 加 / 减一步 |
| `PageUp` / `PageDown` | 加 / 减十步 |
| `Home` / `End` | 到下限 / 上限（设了才接管，否则照常移动光标） |
| `Enter` | 确认输入 |

− / + 按钮不进 Tab 顺序（`tabindex="-1"`，键盘用方向键），但有读屏名「减少」/「增加」，触屏读屏照样能点。整数且下限 ≥ 0 时手机弹数字键盘（`inputmode="numeric"`），否则 `decimal`。

## Vue API

<PropsTable of="AkInputNumber" />

## CSS 实现

```html
<div class="ak-number"><button type="button" tabindex="-1" aria-label="减少">−</button><input value="12" role="spinbutton"><button type="button" tabindex="-1" aria-label="增加">+</button></div>
```

<CssClasses :files="['components/form.css']" :blocks="['ak-number']" />
