---
title: 潜能 / 专精 Potential
component: potential
---

潜能 1–6、专精 1–3 的游戏图标（`potential_hub` / `specialized_hub`）。图标自带颜色、不随主题反相，所以默认坐在一块深色底座上（两套主题一样）；放进已有深底或行内小图时用 `bare` 去掉底座。

## 潜能

`value` 给出默认 `alt`「潜能 N」；旁边已经写了「潜能 N」时 `label=""` 当装饰（[潜能提升一览](/arknights/pot-list)就是这样）。图标文件是 `potential_{N−1}.png`。

@demo Potential/Potentials

## 专精

`AkSpecialization` = `.ak-spec`，同一套底座；`value` 1–3 给出默认 `alt`「专精 N」。技能等级选择器里的专精小图标见技能组件。

@demo Potential/Specialization

## Vue API

### AkPotential

<PropsTable of="AkPotential" />

### AkSpecialization

<PropsTable of="AkSpecialization" />

## CSS 实现

<CssClasses :files="['arknights/potential.css']" />
