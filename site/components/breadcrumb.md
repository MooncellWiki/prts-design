---
title: 面包屑 Breadcrumb
component: breadcrumb
---

当前页在层级里的位置：`首页 › 干员一览 › 陈`。上级是链接（悬停变主色），最后一项是当前页——正文色、加粗、`aria-current="page"`。分隔符是 CSS 画的斜角（`li + li::before`），不是字符，也不能换。

## 基本

写法同 Naive UI 的 `n-breadcrumb`：`AkBreadcrumb` 里放若干 `AkBreadcrumbItem`，有 `href` 的渲染成链接。没有哪一项写 `current` 时，**最后一项自动当作当前页**；当前页也要是链接时给它写 `href`，`aria-current` 会落在链接上。要用路由链接时把 `RouterLink` 整个写进默认插槽、不写 `href`。

@demo Breadcrumb/Basic

## 可访问性

- 输出 `<nav aria-label="面包屑">` 地标 + 有序列表 `<ol>`（同 [WAI-ARIA Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)）；一页有两条面包屑时用 `label` 区分。
- 斜角分隔符是伪元素，读屏不念。

## Vue API

### AkBreadcrumb

<PropsTable of="AkBreadcrumb" />

### AkBreadcrumbItem

<PropsTable of="AkBreadcrumbItem" />

## CSS 实现

模板直接输出列表即可。放在正文（`.mw-parser-output`）里时外层要标 `ak-not-prose`，否则正文的列表缩进会进来（Vue 版已标在 `<nav>` 上）。

```html demo
<nav class="ak-not-prose" aria-label="面包屑">
  <ol class="ak-breadcrumb">
    <li><a href="#">干员</a></li>
    <li><a href="#">近卫</a></li>
    <li><a href="#">剑豪</a></li>
    <li aria-current="page">陈</li>
  </ol>
</nav>
```

<CssClasses :files="['components/breadcrumb.css']" />
