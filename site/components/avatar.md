---
title: 头像 Avatar
component: avatar
---

直角 1px 边的方块头像，图片铺满；没有图时显示文字（缩写、「+9」，Bender 粗体，字号随尺寸）。写法同 Naive UI 的 `n-avatar` / `n-avatar-group`。干员列表行里带稀有度色条的那种见干员行组件，这里是通用头像。

## 尺寸 · 圆形 · 状态点 · 文字

`xs` 24 · `sm` 32 · 默认 40 · `lg` 56 · `xl` 80。系统默认直角，`round` 只给用户头像这类确需圆形的场合；`status` 右下角一枚绿色状态点（纯视觉，含义要在旁边文字里说出来）。图片加载失败时退回默认插槽的文字（同 Naive 的 fallback）。

@demo Avatar/Sizes

## 头像组

后一枚压前一枚 8px。给 `options`（`{ src, alt }[]`）由组件画，`max` 把其余收成一枚「+N」；也可以直接在默认插槽里放 `AkAvatar`。组上的 `size` 给组内头像统一尺寸（经 provide，同 `AkButtonGroup`）。

@demo Avatar/Group

## 可访问性

- 头像旁边已经写了名字时，`alt` 留空（默认），读屏不重复念。
- 头像单独出现（头像组、只有头像的作者栏）时每枚都写 `alt`（人名），头像组再给 `label`（「第一小队」）作组名。

## Vue API

### AkAvatar

<PropsTable of="AkAvatar" />

### AkAvatarGroup

<PropsTable of="AkAvatarGroup" />

## CSS 实现

尺寸由私有变量 `--_s` 定（字号是它的 40%），页眉用户菜单、干员行这类场合在自己的规则里改 `--_s`。

<CssClasses :files="['components/avatar.css']" />
