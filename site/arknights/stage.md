---
title: 关卡 Stage
component: stage
---

关卡卡片：编号用展示字大号放左列，右列是关卡名和一行元信息（理智、推荐等级）。给了 `href` 时整张卡是链接，悬停时描边变成强调色。关卡页页头、档案里「前往关卡页」、首页「近期新增」都用它。

## 关卡类型

`variant` 给磨难（`hard`）/ EX（`ex`）/ 剧情（`story`）加 4px 左色条，和 1px 边框直角相接；普通关卡不加。编号下的小字写 `caption`（章节 / 类型）。元信息行里内置两项：`sanity` 理智（六边形 + 数字）、`level` 推荐等级（显示成「推荐 **LV.30**」），其余内容放进 `#meta` 插槽，追加在行末。

@demo Stage/Variants

## 紧凑

没有元信息（不写 `sanity` / `level` / `#meta`）时，关卡名直接作网格的第二列，可以单独省略号截断，适合首页「近期新增」这种按活动 / 章节分好组的格子。这种列表里关卡码已经说明了类型，就不再加色条，否则信息重复。

@demo Stage/Compact

## 行内关卡号 · 理智

`AkStageCode` 是正文 / 解锁条件里的关卡号（黑白反转的展示字小块，`variant="hard"` 为红底），关卡号写在默认插槽里；`AkSanity` 是单独的理智消耗。

@demo Stage/Inline

## 可访问性

- 整块是链接的 `AkStage` / `AkStageCode` 会自动加 `ak-not-prose`，否则正文里的 `a:visited`（特指度 0,1,1）会把卡片文字 / 反白字染成已访问的链接色。
- 理智的六边形是 CSS 画的剪影，读屏器读不到。`AkSanity` 在数字前放了一段 sr-only 的「理智」，读出来是「理智 21」，不会只剩一个数字。

## Vue API

### AkStage

<PropsTable of="AkStage" />

### AkStageCode

<PropsTable of="AkStageCode" />

### AkSanity

<PropsTable of="AkSanity" />

## CSS 实现

<CssClasses :files="['arknights/stage.css']" />
