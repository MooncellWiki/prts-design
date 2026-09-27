---
title: 空状态 Empty
component: empty
---

没有数据、筛选没有结果、页面不存在：虚线框、表面 2 底，居中一枚 48px 半透明线稿图标 + 粗体标题 + 小字说明 + 可选的操作。写法同 Naive UI 的 `n-empty`：`description`（或默认插槽）、`#icon`、`#extra`。

## 基础 · 操作

标题默认「暂无数据」；`icon` 换图标（`false` 不要图标）；说明里要放链接 / 加粗时写在默认插槽；`#extra` 放「清除筛选」这类让用户走出空状态的操作。

@demo Empty/Basic

## 状态码

`code` 在图标的位置放一个 Novecento 大号状态码（404 / 403），描边色、不抢标题。

@demo Empty/Code

## Vue API

<PropsTable of="AkEmpty" />

## CSS 实现

<CssClasses :files="['components/empty.css']" />
