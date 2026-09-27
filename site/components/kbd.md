---
title: 键帽 Kbd
component: kbd
---

快捷键提示：直角 1px 边、底边略重一点（`inset 0 -1px`）、等宽 10px 粗体，18px 高。用在面板页脚的键位说明、触发器右侧、正文里「按 `/` 搜索」这类行内说明。组合键写成几枚键帽，中间的 `+` 写在外面。

## 快捷键提示

@demo Kbd/Basic

正文里编辑直接写的 `<kbd>`（没有 class）由 [MediaWiki 内容样式](/content/typography) 换肤，长得稍大、跟随正文字号；`.ak-kbd` 是界面里用的固定小号版。页眉 / 搜索面板里的键帽另有深色底的覆盖（皮肤骨架负责）。

## Vue API

`AkKbd` 只有默认插槽（键名：`Ctrl`、`K`、`Esc`、`↵`、`/` …），输出 `<kbd class="ak-kbd">`。

## CSS 实现

```html
<kbd class="ak-kbd">Ctrl</kbd> + <kbd class="ak-kbd">K</kbd>
```

<CssClasses :files="['components/form.css']" :blocks="['ak-kbd']" />
