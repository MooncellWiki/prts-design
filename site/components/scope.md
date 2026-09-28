---
title: 作用域 Scope
component: scope
---

组件的排版基线——字体、字号、行高、前景色——不靠宿主页面的 `<body>` 继承，而是挂在「作用域根」上：AKDS 皮肤上是 `body.skin-akds`，别的地方是 `class="ak-scope"` 的元素（Vue：`<AkScope>`）。所以同一个 widget 放在 AKDS 皮肤、prts.wiki 的其它皮肤（Vector 2022 …）或站外页面里，看起来都一样。样式从哪来按宿主分，见[在 Vue / prts-widgets 中使用](/guide/vue#样式从哪来)。

```vue
<template>
  <AkScope>
    <!-- widget 的整棵组件树 -->
  </AkScope>
</template>
```

AKDS 皮肤上 body 本身就是作用域，包不包都一样；所以写 widget 时一律在根节点包一层，不用判断皮肤。

## 局部主题

`theme="dark"` / `theme="light"` 让这一块固定走终端（暗）/ 档案（亮）配色，与页面主题无关——令牌块（`tokens.css`）同时挂在 `.ak-scope[data-theme]` 上，自定义属性在更近的祖先上声明就覆盖继承值；带主题的作用域连画布底色（`--ak-bg-canvas`）一起换，否则暗色的浅字会落在宿主的白底上。不传 `theme` 就跟随页面（`<html>` 上的 clientpref 类 / `data-theme`，都没有时跟随系统）。

@demo Scope/Theme

## 作用域里还有什么

排版基线之外，作用域在**别的宿主上**（不在 `body.skin-akds` 里时，选择器都带 `:not(.skin-akds *)`）还要把宿主的页面环境换成 AKDS 皮肤上组件看到的那一个——AKDS 皮肤上这些本来就由 `base/` 全页提供，所以不生效：

- **继承下来的文字属性**：宿主容器往下传的 `overflow-wrap`、`letter-spacing`、`text-align` 之类在作用域根上回到初始值。
- **皮肤全局基底**（`base/root.css`）里组件看得见的几条：滚动条、选区色、焦点环、减弱动效（`prefers-reduced-motion`）。
- **宿主的元素规则**：Vector 给 `h1`–`h6` 的字号 / 外边距 / `display: flow-root`、`li` 的下外边距、`img` 的 `vertical-align`、`code` 的底色边框 …在组件自己的元素（类名以 `ak-` 开头的，以及组件元素直接包着的 `<img>`）和 `ak-not-prose` 子树里退回浏览器默认（`revert`，特指度 (0,0,1)，组件类照样盖得过）；Vector 带类名上下文的 `.mw-body p` 段距、`.mw-parser-output a` 断词也在这些地方同特指度压回。宿主正文里 `.mw-body h3` 这类 (0,1,1) 规则压得过单个组件类——组件标题元素是 `h1`–`h6` 时，规则自带一条 `:is(h1, h2, h3, h4, h5, h6).ak-x` 的同义选择器。
- **裸控件**：组件里的 `<button>` / `<input>` / `<select>` / 勾选框的底子是 `base/forms.css` 的裸控件规则（去原生外观、字体跟正文、勾选 / 单选的自绘脸），作用域补同一套，特指度与 `base/forms.css` 完全相同；`scripts/css-order.ts` 逐条核对两边一致。
- **not-prose 隔离**：宿主皮肤的全局链接规则（Vector 的 `a` 链接色、`a:visited` / `a:active` 换色、`a:hover` 换色 + 下划线）会把「整块是链接」的组件（`a.ak-card`、`a.ak-op-card` …）染成链接色。作用域里 `ak-not-prose` 子树内的链接按宿主规则的特指度逐条退回继承色、去下划线——与宿主同特指度、靠后加载压过宿主，组件自己的 `a` 规则仍在它之后生效。AKDS 皮肤自己的正文链接规则本来就排除 not-prose，用不着这段。
  这些 (0,1,1) 规则也压得过组件写在 `<a>` 根节点上的单个类 (0,1,0)：根节点颜色不是继承色的链接型组件（`.ak-btn`、`.ak-stage-code`、`.ak-op-card`、`a.ak-card`、`a.ak-item` …）自己把颜色规则写到 `:hover` / `:visited` / `:active` 上（0,2,0+），新组件照做。

组件里夹的正文内容（不带 `ak-` 类、不在 not-prose 里的段落 / 列表 / 链接）不动，跟着宿主的正文排版走——MW 正文排版（`base/`）不随组件走。三种宿主一致由 `node scripts/verify/styles.ts hosts` 逐元素核对（对照页 `preview/gallery.html?host=akds|vector|bare`），静态与 `:hover` / `:focus-visible` / `:visited` 各比一轮。

## Vue API

<PropsTable of="AkScope" />

## CSS 实现

在 widget / 模板输出的最外层加 `class="ak-scope"`；局部主题再加 `data-theme="dark|light"`。

<CssClasses :files="['scope.css']" />
