---
title: 材料表 Materials
component: materials
---

精英化 / 技能升级 / 专精训练要的材料：左列是阶段或等级（Bender 小号大写标签字，可带精英化图标），右列是这一步要的一排[道具](/arknights/item)，一行一步。两列网格对齐，左列按最宽的标签收紧。

写法同 Naive UI 的 `n-descriptions`：`AkMaterials` 里放若干 `AkMaterialsRow`（`label` 是左列文字，默认插槽放 `AkItem`）；里面的 `AkItem` 没写 `size` 时自动画成 `sm`（40px，材料表的规格；同 `AkItemList` 的 `size`，由行向下提供），写了就以写的为准。

## 精英化材料

左列要放精英化图标时用 `#label` 插槽。图标是游戏白线稿，亮色主题下自动反相。

@demo Materials/Promotion

## 技能升级材料 · 分段说明

`AkMaterialsDivider` 是横跨两列的一条虚线 + 小字（「达到精英阶段 1 后解锁」），放在它说明的那几行之前。数据驱动时 `v-for` 出行即可。

@demo Materials/Skill

## 专精训练

左列可以放别的组件——这里是换了专精小图标的[精英化](/arknights/elite)标记。

@demo Materials/Mastery

## Vue API

### AkMaterials

<PropsTable of="AkMaterials" />

### AkMaterialsRow

<PropsTable of="AkMaterialsRow" />

### AkMaterialsDivider

<PropsTable of="AkMaterialsDivider" />

## CSS 实现

结构：`.ak-materials` 两列网格，每行是相邻的两个子元素 `span.ak-materials__label` + `span.ak-item-list`（`AkMaterialsRow` 因此是两个根元素的组件）；`.ak-materials__divider` 占满一整行。左列里的 `img` 16px 高、跟主题反相。

<CssClasses :files="['arknights/materials.css']" />
