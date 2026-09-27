---
title: 步骤条 Stepper
component: stepper
---

一排带序号的步骤 + 连线，展示走到了哪一步：精英化、技能专精、多步表单的进度。序号由 CSS 计数器生成；已完成 = 主色序号 + 主色连线，当前 = 主色序号 + 加粗，未到 = 灰。只有横排，只展示、不可点。

## 基本

写法同 Naive UI 的 `n-steps`：`AkSteps` 里放若干 `AkStep`，`current`（从 1 数）之前的步骤已完成、这一步是当前、之后未到。

@demo Stepper/Basic

## 随 current 推进

`current` 超过步数 = 全部完成。某一步要单独指定状态时写 `AkStep` 的 `status`（优先于推算）。步骤名也可以写在 `AkStep` 的默认插槽里。

@demo Stepper/Progress

## 可访问性

- 输出 `role="list"` / `listitem`，`label` 作列表名（如「精英化进度」）。
- 当前步骤 `aria-current="step"`；已完成的步骤带一段只给读屏的「（已完成）」（`.ak-sr-only`）——颜色之外的状态说明。

## Vue API

### AkSteps

<PropsTable of="AkSteps" />

### AkStep

<PropsTable of="AkStep" />

## CSS 实现

```html demo
<div class="ak-stepper" role="list" aria-label="精英化进度">
  <div class="ak-step is-done" role="listitem">精英零</div>
  <div class="ak-step is-done" role="listitem">精英一</div>
  <div class="ak-step is-active" role="listitem" aria-current="step">精英二</div>
  <div class="ak-step" role="listitem">满级</div>
</div>
```

<CssClasses :files="['components/stepper.css']" />
