---
title: 干员卡 Op Card
component: op-card
---

游戏干员列表那张卡：方形头像（底部压一层渐暗）+ 左上星级 / 左下职业 / 右下精英阶段三个角标 + 名字，名字上方一条 3px 的稀有度色线；悬停上浮 3px、描边变青。整张卡是一个链接（`href`），外层带 `ak-not-prose`，正文里不会被 `a:visited` 染色。

素材全部由调用方传：`avatar` 头像、`rarity-icon` 星级原图、`profession-icon` 职业图标、`elite-icon` 精英图标；`profession` / `elite` 给对应角标的 `alt`。

## 网格

`AkOpGrid`（`.ak-op-grid`）按宽度自动排列，每列最窄 112px，卡片宽度由网格定。

@demo OpCard/Grid

## 尺寸

`sm` 88 · 默认 128 · `lg` 180（px 宽，不放网格时）。`sm` 的职业角标用头像同款小图标 `profession/icon_<职业>.png`（= 现网 `图标_职业_*.png`）；首页「亮点干员」就是一排 `sm` 卡，小字写生日 / 获得方式。

@demo OpCard/Sizes

## 色条 · CSS 星形 · 当前项 · 角标

- `variant="rail"`：稀有度色改成左边条，与 1px 框直角拼接，名字上方不再有色线。
- 不传 `rarity-icon` 时左上角画 CSS 星形（[稀有度](/arknights/rarity)组件，与原图等大）；不传职业 / 精英图标就不显示那个角标。
- `current`：异格一览里正在看的这位——青色描边 + `aria-current="page"`。
- `#badge` 插槽放右上角的额外角标（首页凭证兑换的「兑」、模组类型小图标）。

@demo OpCard/Variants

## 可访问性

头像是装饰（`alt=""`）；三个角标的 `alt`（「六星」「近卫」「精英二」）和名字、小字一起组成链接的可访问名。异格卡这类只有名字的，`title`（透传到根元素）可以补一句「陈（原型）」。

## Vue API

### AkOpCard

<PropsTable of="AkOpCard" />

### AkOpGrid

干员卡网格，只有默认插槽。

## CSS 实现

<CssClasses :files="['arknights/op-card.css']" />
