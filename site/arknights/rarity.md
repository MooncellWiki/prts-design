---
title: 稀有度 Rarity
component: rarity
---

干员稀有度就是星数（游戏数据里的 `rarity` 是 0–5，显示时 +1）。星形默认用 CSS `clip-path` 画——跟字号走、放进哪行字就是那行的大小、颜色走令牌；要和游戏界面一个像素不差时换成原图。

## 颜色

默认游戏星黄；`white` 走正文色（亮色黑、暗色白），给不想抢眼的列表；`tier` 按稀有度色阶上色（一星灰 → 六星橙，同 `.ak-rarity--r1…r6`），颜色跟着 `value` 走。

@demo Rarity/Variants

## 尺寸

`sm` 0.8em · 默认 1em · `lg` 1.4em。是相对字号的，放进正文 / 标题里跟着那一行缩放。

@demo Rarity/Sizes

## 游戏原图

`src` 换成游戏原图 `.ak-rarity-img`（固定 14px 高）：黄星 `rarity_yellow_N.png` 两套主题都不变；白星 `rarity_N.png` 写 `glyph`，亮色主题下反相为黑（`.ak-glyph`）。N = 星数 − 1。

@demo Rarity/Image

## 稀有度色轨

表格行、卡片、头像要带稀有度色时，不用组件：在容器上写 `data-rarity="1–6"`，它提供 `--ak-r`（色块）/ `--ak-r-text`（文字色：亮色主题下换成加深的 text-safe 版）两个变量，再配下面几个工具类。[干员卡](/arknights/op-card)、[干员条目](/arknights/op-row)的头像底都是这么来的（[道具](/arknights/item)的裸图标底框也认 `data-rarity`，但画的是游戏底图）。

```html demo
<div class="ak-flex ak-wrap ak-gap-3 ak-items-center">
  <span data-rarity="6" class="ak-r-chip">6★</span>
  <span data-rarity="5" class="ak-r-chip">5★</span>
  <span data-rarity="4" class="ak-r-chip">4★</span>
  <span data-rarity="3" class="ak-r-chip">3★</span>
  <span data-rarity="2" class="ak-r-chip">2★</span>
  <span data-rarity="1" class="ak-r-chip">1★</span>
</div>
<p class="ak-mt-2"><span data-rarity="6"><span class="ak-r-swatch"></span><b class="ak-r-text">陈</b></span>　<span data-rarity="5"><span class="ak-r-swatch"></span><b class="ak-r-text">德克萨斯</b></span>　<span data-rarity="4"><span class="ak-r-swatch"></span><b class="ak-r-text">桃金娘</b></span></p>
<div data-rarity="6" class="ak-r-bar ak-p-2">左侧稀有度色条（<code>.ak-r-bar</code>）</div>
```

| 类 | 作用 |
|---|---|
| `.ak-r-text` | 文字用稀有度色（`--ak-r-text`） |
| `.ak-r-bg` | 稀有度色底 + 深色字 |
| `.ak-r-border` | 边框用稀有度色 |
| `.ak-r-bar` | 左侧粗色条（`--ak-bar-w`） |
| `.ak-r-chip` | 20px 高的稀有度色芯片 |
| `.ak-r-swatch` | 1em 小色块，放在名字前 |
| `.ak-r-avatar` | 头像底：稀有度色渐变（见下） |

## 头像底

透明底的干员头像垫一块稀有度色渐变：一排里混着几种星级时扫一眼底色就能分开，头像下面 / 旁边不必再拉一道同色的色条（那是重复信息）。画法照现网的抽卡模拟器（`GachaSimulatorV2` 的 `.rarity-5` / `.rarity-4`）：上面稀有度色、往下褪成浅灰 `#e6e5e2`，6★ 另是斜向 32° 的 奶油 `#eee2b8` → 橙；稀有度色仍用令牌（模拟器自己的 4★ 紫偏灰，和 1★ 的灰底分不开）。[干员卡](/arknights/op-card)、[干员条目](/arknights/op-row)的头像默认就垫；别处的头像框（[头像](/components/avatar)、页面自己排的小头像、公招结果、表格里的头像列）写 `.ak-r-avatar`，稀有度照旧从祖先或自己的 `data-rarity` 来；下面是 `.ak-avatar--lg` + `.ak-r-avatar`（2★ / 1★ 没有图，只看底）。叠在 `--ak-r` 上的那层渐变是变量 `--ak-r-fade`（随 `data-rarity` 给），自己画背景时写 `background: var(--ak-r) var(--ak-r-fade)`。

底的上半截是饱和的稀有度色：压在上面的黄星（5★ 金、2★ 黄绿底上看不清）、白色线稿图标要自己垫半透明黑底（同干员卡的角标）。

```html demo
<div class="ak-flex ak-wrap ak-gap-2">
  <span class="ak-avatar ak-avatar--lg ak-r-avatar" data-rarity="6"><img src="assets/avatar/char_010_chen_2.png" alt=""></span>
  <span class="ak-avatar ak-avatar--lg ak-r-avatar" data-rarity="5"><img src="assets/avatar/char_102_texas_2.png" alt=""></span>
  <span class="ak-avatar ak-avatar--lg ak-r-avatar" data-rarity="4"><img src="assets/avatar/char_151_myrtle_2.png" alt=""></span>
  <span class="ak-avatar ak-avatar--lg ak-r-avatar" data-rarity="3"><img src="assets/mainpage/avatar/yunji-skin1.png" alt=""></span>
  <span class="ak-avatar ak-avatar--lg ak-r-avatar" data-rarity="2"></span>
  <span class="ak-avatar ak-avatar--lg ak-r-avatar" data-rarity="1"></span>
</div>
```

## 可访问性

CSS 星形是一串空的 `<i>`，读屏读不到：`AkRarity` 在外层补 `role="img"` + `aria-label`（默认「六星」，`label` 可改写）；原图版的 `alt` 同样默认「六星」。

## Vue API

<PropsTable of="AkRarity" />

## CSS 实现

<CssClasses :files="['arknights/rarity.css']" />
