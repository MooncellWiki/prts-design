---
title: 键值表 Kv
component: kv
---

信息栏 / 档案里的键值对，输出 `<dl>`。`dt` / `dd` 垂直居中（行高由高的一侧决定时另一侧居中，同现网 infobox 的 th / td）；数字走正文字体（表格硬规则，`.ak-code-id` / `.ak-trust` 落进 `dd` 时由表格数字规则兜底）。

写法同 Naive UI 的 `n-descriptions`：`AkKv` 里放若干 `AkKvItem`，`term` 是键、默认插槽是值；键要带悬停解释 / 图标时用 `#term` 插槽。Naive 的键叫 `label`，这里叫 `term`（= `<dt>`）——`label` 全库只作可访问名。

没有做成 `items` 数组：值常常是链接、标签、图标、嵌套列表，插槽写起来比往数组里塞渲染函数直观；子项自己输出 `dt` + `dd`，只有内联版要多包一层 `div`，这点由父组件 provide 下去，父组件不用读子项。

## 带框（信息栏）

`bordered`：外框 + 键列底色、居中，同现网 infobox 的 th。干员页「特性」节。

@demo Kv/Boxed

## 不带框（档案）

默认：只有横线，键列左对齐。人员档案的「基础档案」。

@demo Kv/Plain

## 内联

`inline`：两三对短值一行放下（`dl > div > dt + dd` 分组，放不下换行），不画格子；键靠灰色和值分开，不加冒号。所属势力 / 隐藏势力、获得方式 / 上线时间这种量级的内容，竖着一行一格是空占地方。

@demo Kv/Inline

## Vue API

### AkKv

<PropsTable of="AkKv" />

### AkKvItem

<PropsTable of="AkKvItem" />

## CSS 实现

`dt` / `dd` 都显式 `margin: 0`：正文的 `.mw-parser-output dt { margin-top }` / `dd { margin }` 同优先级，靠顺序压掉。

<CssClasses :files="['arknights/kv.css']" />
