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

- 输出 `<ol>` / `<li>`（有序列表，步骤有先后），`label` 作列表名（如「精英化进度」）。`<ol>` 上显式写 `role="list"`：Safari（VoiceOver）对去掉列表符号（`list-style: none`）的列表不报列表语义。
- 当前步骤 `aria-current="step"`；已完成的步骤带一段只给读屏的「（已完成）」（`.ak-sr-only`）——颜色之外的状态说明。

## Vue API

### AkSteps

<PropsTable of="AkSteps" />

### AkStep

<PropsTable of="AkStep" />

## CSS 实现

结构 `ol.ak-stepper > li.ak-step`：`.ak-stepper` 自己去掉原生序号、缩进与外边距（序号由 CSS 计数器画），直接写在正文里也不吃正文有序列表的缩进、段距与主色序号。

```html demo
<ol class="ak-stepper" role="list" aria-label="精英化进度">
  <li class="ak-step is-done">精英零</li>
  <li class="ak-step is-done">精英一</li>
  <li class="ak-step is-active" aria-current="step">精英二</li>
  <li class="ak-step">满级</li>
</ol>
```

<CssClasses :files="['components/stepper.css']" />
