---
title: 属性面板 Attrs
component: attrs
---

干员属性读数，照游戏内 HUD 的读法：Bender 大号数字 + overline 小标（英文缩写 + 中文名）。等宽网格（每格最窄 140px，放不下换行），格间 1px 缝线。干员页「属性」节的属性计算器（现网 `Widget:PropertyCalc`）用它显示读数；按精英阶段 / 等级列的四档属性表仍是 wikitable。

写法：`AkAttrs` 里放若干 `AkAttr`，一格一个属性（思路同 Naive UI 的 `n-statistic`：小标签 + 数值 + 单位）。

## 属性面板

四维（生命 / 攻击 / 防御 / 法抗）加 `accent`（顶部 2px 主色线），部署类（费用 / 阻挡 / 攻击间隔 / 再部署）不加；单位写在 `unit`（数值后的小号灰字）。

@demo Attrs/Panel

## 紧凑

`compact`：名 / 值左右排开，数值降到正文字号——表格侧栏读数、人员档案里的「综合体检测试」（属性名直接写中文）。要上色的值写在默认插槽里。

@demo Attrs/Compact

## Vue API

### AkAttrs

<PropsTable of="AkAttrs" />

### AkAttr

<PropsTable of="AkAttr" />

## CSS 实现

<CssClasses :files="['arknights/attrs.css']" />
