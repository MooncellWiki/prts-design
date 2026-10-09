---
title: 干员卡 Op Card
component: op-card
---

游戏干员列表那张卡：方形头像 + 左上职业 / 右下星级 / 左下精英阶段三个角标（排法同现网 [微件:干员头像](https://prts.wiki/w/微件:干员头像)）+ 名字；头像垫稀有度色的渐变底（[稀有度 · 头像底](/arknights/rarity#头像底)），一排里混着几种星级时扫一眼底色就能分开，名字上方不再拉一道同色的线。三个角标都垫半透明黑底：黄星、白色图标压在往下褪成的浅灰 / 奶油色上，不垫看不清；连同右上角的额外角标，四个角标都贴角、不内缩（同现网）。悬停上浮 3px、描边变青。整张卡是一个链接（`href`），外层带 `ak-not-prose`，正文里不会被 `a:visited` 染色。

素材全部由调用方传：`avatar` 头像、`rarity-icon` 星级原图、`profession-icon` 职业图标、`elite-icon` 精英图标；`profession` / `elite` 给对应角标的 `alt`。

## 网格

`AkOpGrid`（`.ak-op-grid`）按宽度自动排列，每列最窄 112px，卡片宽度由网格定。

@demo OpCard/Grid

## 尺寸

`sm` 88 · 默认 128 · `lg` 180（px 宽，不放网格时）。`sm` 的职业角标用头像同款小图标 `profession/icon_<职业>.png`（= 现网 `图标_职业_*.png`）；首页「亮点干员」就是一排 `sm` 卡，纯头像（`avatar-only`）。

@demo OpCard/Sizes

## 色条 · CSS 星形 · 当前项 · 角标

- `variant="rail"`：头像底之外另加一条稀有度色左边条，与 1px 框直角拼接。
- 不传 `rarity-icon` 时右下角画 CSS 星形（[稀有度](/arknights/rarity)组件，与原图等大）；不传职业 / 精英图标就不显示那个角标。
- `current`：异格一览里正在看的这位——青色描边 + `aria-current="page"`。
- `#badge` 插槽放右上角的额外角标（首页凭证兑换的「兑」、模组类型小图标）。
- `avatar-only`：纯头像，不出名字栏（首页「亮点干员」）——名字改作头像的 `alt` 与悬停提示 `title`，`sub` 不显示。

@demo OpCard/Variants

## 可访问性

头像是装饰（`alt=""`）；三个角标的 `alt`（「六星」「近卫」「精英二」）和名字、小字一起组成链接的可访问名。`avatar-only` 时没有名字栏，头像就不再是装饰：名字写进头像的 `alt`，同一个名字也作 `title`（MediaWiki 的内链本来就带页面名作 `title`），悬停看得到是谁。异格卡这类只有名字的，`title`（透传到根元素）可以补一句「陈（原型）」。

## Vue API

### AkOpCard

<PropsTable of="AkOpCard" />

### AkOpGrid

干员卡网格，只有默认插槽。

## CSS 实现

<CssClasses :files="['arknights/op-card.css']" />
