---
title: 骨架屏 Skeleton
component: skeleton
---

内容到之前先占住它的形状，加载完不跳版。底色在表面 2 与表面 3 之间扫光（1.4s 一轮）。写法同 Naive UI 的 `n-skeleton`：`text` / `circle` / `repeat` / `width` / `height`。

## 形状 · 尺寸

不写形状时是 1em 高、占满一行的块，配 `height` 画图片 / 卡片封面的占位（`height="120"` = CSS 的 `.ak-skeleton--rect`）；`text` 是文字行（.9em 高、上下 .35em，一组里最后一行 60% 宽），配 `repeat` 画一段；`circle` / `square` 宽高相等、由 `width` 定（头像、道具）。数字按 px，字符串原样（`"60%"`）。

@demo Skeleton/Shapes

## 拼成列表占位

照真实内容的版式拼：头像位一个方块、名字一短行、副信息一长行。加载中的容器标 `aria-busy="true"`。

@demo Skeleton/Layout

## 可访问性

骨架对读屏隐藏（`aria-hidden`）——它只是形状，没有信息。「正在加载」由外层容器的 `aria-busy` 或一枚[加载](/components/spinner)（`role="status"`）说。

## Vue API

<PropsTable of="AkSkeleton" />

## CSS 实现

`<span class="ak-skeleton ak-skeleton--text"></span>`；宽高不同的占位在模板里写 `style="width: …"`。

<CssClasses :files="['components/skeleton.css']" />
