---
title: 道具 Item
component: item
---

**游戏道具图标原样，图就用现网拼好的**：`<img>` 直接放 prts.wiki `文件:道具_带框_<名>.png`（游戏底图 sprite_item_r* + 图标合成，183×183，每个道具都有；现网 `Template:道具图标` 输出的就是它），占满框，皮肤不自己叠框。数量是骑在框沿上的描边数字（同现网 `.prts-item-quantity-label`，晕色跟主题）。

这是整套系统里除单选之外唯一的圆：它不是 UI 盒子，而是游戏素材本身。

## 合成图（默认）

`insufficient` 数量不足（红字）。悬停提示默认是道具名，`tip` 可改写（如「固源岩 ×12」），`tip=false` 关掉。

@demo Item/Framed

## 尺寸 · 状态 · 行内

`sm` 40 · 默认 56 · `lg` 76；`disabled` 去色；`inline` 是放进正文的 22px 小图 + 文字：文字默认是「×`count`」（也可以写在默认插槽里），`href` / `tip` / `insufficient` 照常生效，`size` / `avatar` 不适用。

@demo Item/Sizes

## 裸图标

手里只有 torappu 的透明图标（解包数据 / 搜索面板）时：`bare` 让 CSS 按 `rarity` 1–6 叠游戏的稀有度底框（白 / 绿 / 蓝 / 紫 / 金 / 特殊，= 现网 `文件:道具_背景_N.png`），图标占 94%。

@demo Item/Bare

## Vue API

### AkItem

<PropsTable of="AkItem" />

### AkItemList

一排道具：换行，间距 6 / 8。只有默认插槽。

## CSS 实现

材料表 `.ak-materials`（阶段 → 材料行）也在这里。

<CssClasses :files="['arknights/item.css', 'arknights/materials.css']" />
