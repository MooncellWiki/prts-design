---
title: 搜索框 Search
component: search
---

左侧放大镜 + `<input type="search" class="ak-input">` + 右侧快捷键键帽——同页眉里没有 JS 时的那个搜索表单（有 JS 时页眉换成[搜索面板](/chrome/search)的触发器）。给页内筛选、数据页的搜索栏；**站点级搜索外面包 `<form role="search">`**，页内筛选直接用。

## 快捷键 · 回车搜索

`shortcut` 是单个按键（常用 `/`）：右侧显示键帽（有字时隐去），在页面别处按下就聚焦到输入框——正在别的输入框里打字时不抢，输入框同时带 `aria-keyshortcuts`。回车触发 `search` 事件（输入法选字时的回车不算）。`v-model` 是搜索词。

@demo Search/Basic

## 尺寸 · 在字段里

高 30 / 36 / 44，与输入框同一刻度。不在带标签的[表单字段](/components/field)里时，读屏名默认是「搜索」，`label` 可改。

@demo Search/Sizes

## Vue API

<PropsTable of="AkSearch" />

## CSS 实现

```html
<form class="ak-search" role="search">
  <svg class="ak-search__icon"><use href="#i-search"/></svg>
  <input class="ak-input" type="search" placeholder="搜索 PRTS…" aria-label="搜索">
  <span class="ak-search__kbd">/</span>
</form>
```

键帽 `.ak-search__kbd` 是[键帽](/components/kbd) `.ak-kbd` 的绝对定位版。

<CssClasses :files="['components/form.css']" />
