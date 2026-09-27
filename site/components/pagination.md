---
title: 分页 Pagination
component: pagination
---

`‹ 1 2 3 4 5 … 24 ›`：首页、尾页常驻，当前页居中，两边放不下的收成省略号；当前页主色实底，到头的 ‹ / › 淡出。页码用等宽数字，翻页时宽度不跳。

## 基本

写法同 Naive UI 的 `n-pagination`：`v-model` 是当前页（从 1 数），`page-count` 给总页数。

@demo Pagination/Basic

## 条数 · 页码格数 · 禁用

也可以给总条数 `item-count` + 每页条数 `page-size`，页数自己算。`page-slot` 是最多显示几格（含首尾页和省略号，同 Naive，最少 5）：每格约 50px 宽，默认 7 格约 450px，手机上放不下时调到 5。省略号只是提示，不可点。

@demo Pagination/Options

## 链接形态

默认页码是页内切换的 `<button>`，只更新 `v-model`。给 `page-href`（页码 → 地址）就渲染成 `<a href>`，点了照常跳转——MW 的列表页（`?offset=`）、能直接打开 / 分享的地址用它。

@demo Pagination/Links

## 可访问性

- 外层 `<nav aria-label="分页">` 地标；一页有两组分页时用 `label` 区分。
- 当前页 `aria-current="page"`；页码的读屏名是「第 N 页」，‹ / › 是「上一页」「下一页」。
- 到头的 ‹ / ›：按钮用 `disabled`，链接去掉 `href` 并标 `aria-disabled`。

## Vue API

<PropsTable of="AkPagination" />

## CSS 实现

模板输出链接（与 Vue 版的链接形态结构相同）；当前页 `.is-active`、到头的箭头 `.is-disabled`，不是链接的格子用 `.ak-pagination__item`。

```html demo
<nav class="ak-pagination" aria-label="分页">
  <a class="is-disabled" aria-disabled="true" aria-label="上一页">‹</a>
  <a href="#" class="is-active" aria-current="page">1</a>
  <a href="#">2</a>
  <a href="#">3</a>
  <span class="ak-pagination__ellipsis">…</span>
  <a href="#">24</a>
  <a href="#" aria-label="下一页">›</a>
</nav>
```

<CssClasses :files="['components/pagination.css']" />
