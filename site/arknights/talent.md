---
title: 天赋卡 Talent
component: talent
---

一个天赋的摘要：名称 + 解锁条件（Bender 小字 + 精英化 / 潜能图标）+ 描述，左侧强调色条、浅底。给列表、侧栏这类只看最终效果的场合；**干员页正文用[天赋条件表](/arknights/talent-table)**，一张表列完各阶段的效果。

## 天赋卡

`requirements` 是跟在名字后面的解锁条件（`{ icon, text }`，图标地址由调用方给）；描述写在默认插槽里，游戏原始标记套一层 [AkRichText](/arknights/rich-text)（潜能加成 `<@ba.talpu>` 是增益蓝）。

@demo Talent/Basic

## Vue API

<PropsTable of="AkTalent" />

## CSS 实现

<CssClasses :files="['arknights/talent.css']" />
