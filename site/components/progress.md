---
title: 进度 Progress
component: progress
---

完成度 / 数量占比：信赖、理智、剿灭奖励、上传进度。直角细条（默认 8px，`--ak-bg-surface-3` 轨道 + 主色填充），可以带上方的标签行（左名称、右数值，Bender 小字）；另有环形。

## 线形 · 标签行 · 颜色

写法同 Naive UI 的 `n-progress`：`percentage` 0–100。写了 `label` 就在条上方出标签行，右边默认是「N%」，默认插槽可以改写成「200 / 200」。颜色 `variant`：`accent`（默认）· `yellow`（信赖 / 次强调）· `success` · `danger`。

@demo Progress/Line

## 粗细 · 斜纹 · 不定 · 分段

`size`：`sm` 4 · `md` 8 · `lg` 14。`stripes` 叠斜纹；`indeterminate` 不知道进度时一段色块来回滑（不报数值）；`steps` 把条切成 N 格按百分比点亮（2 / 3 格 = `steps` 3 + `percentage` 67）。

@demo Progress/States

## 环形

`circle`：直径 56 的圆环（conic-gradient），中间是数值——这是系统里少有的圆，只给「一个百分比」这种自成一体的读数。

@demo Progress/Circle

## 可访问性

- 输出 `role="progressbar"` + `aria-valuemin/max/now`（不定进度不报数值；分段额外给 `aria-valuetext`「2 / 3」）。
- 名字：线形有 `label` 时标签行的名称作 `aria-labelledby`；没有标签行时自己写 `aria-label`（透传到根元素）；环形的 `label` 直接作 `aria-label`。
- 颜色只是辅助：数值要写出来（标签行 / 环心）。

## Vue API

<PropsTable of="AkProgress" />

## CSS 实现

线形 `div.ak-progress` 用 `--_v`（百分比，如 `62%`）定填充宽度；标签行 `div.ak-progress-label > span + span` 放在条前面。分段 `.ak-progress--segmented > i(.is-on)`。环形 `div.ak-ring > span`，`--_v` 是不带单位的数（`75`），颜色 `.ak-ring--yellow` 等（或直接给 `--_c`），直径 `--_size`。

<CssClasses :files="['components/progress.css']" />
