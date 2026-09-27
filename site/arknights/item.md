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

`sm` 40 · 默认 56 · `lg` 76；`AkItemList` 的 `size` 给整排定默认尺寸（道具自己写了 `size` 以自己为准，同按钮组；[材料表](/arknights/materials)的每行就是这样给成 `sm`）；`disabled` 去色；`inline` 是放进正文的 22px 小图 + 文字：文字默认是「×`count`」（也可以写在默认插槽里），`href` / `tip` / `insufficient` 照常生效，`size` / `avatar` 不适用。

@demo Item/Sizes

## 裸图标

手里只有 torappu 的透明图标（解包数据 / 搜索面板）时：`bare` 让 CSS 按 `rarity` 1–6 叠游戏的稀有度底框（白 / 绿 / 蓝 / 紫 / 金 / 特殊，= 现网 `文件:道具_背景_N.png`），图标占 94%。

@demo Item/Bare

## Vue API

### AkItem

<PropsTable of="AkItem" />

### AkItemList

一排道具：换行，间距 6 / 8。

<PropsTable of="AkItemList" />

## CSS 实现

结构 `.ak-item( .ak-item--sm / --lg / .is-disabled ) > img + .ak-item__count( .is-short )`；尺寸只改私有变量 `--_s`，框 / 图 / 数量字号 / 落点按比例走。数量是骑在框沿右下的粗体描边数字（现网 `.prts-item-quantity-label` 的做法：亮色黑字白晕、暗色白字黑晕，晕色取 `--ak-bg-surface`）。招聘合同 = 现网 `招聘合同_5.png` 底图（留着一个空方框）+ `img.ak-item__avatar` 把干员头像叠进方框（同现网 60px 框 / 30px 头像的落点）。早先自己画的「稀有度色方框 + 黑底数量角标」已经换掉，`--round` 随之移除；圆框是游戏素材本身（见[设计理念](/foundations/principles)）。

材料表 `.ak-materials`（阶段 → 材料行）也在这里。

<CssClasses :files="['arknights/item.css', 'arknights/materials.css']" />
