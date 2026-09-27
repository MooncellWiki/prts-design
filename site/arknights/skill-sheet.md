---
title: 技能全等级表 SkillSheet
component: skill-sheet
---

**干员页正文的技能用这个**：同现网 prts.wiki，一张表列完 1–7 级 + 专精 Ⅰ–Ⅲ，初始 / 消耗 / 持续按列对齐、上下直接对比，不做「选一个等级看一份」的切换器。表头是一张不写数值的宽[技能卡](/arknights/skill)（名称行居中对齐图标），列头直接用 [SP 芯片](/arknights/sp)当图例。

另一种对比法是[参数矩阵](/arknights/skill-matrix)：描述只写一遍、等级横着放。长描述、参数多于三四个时用全等级表；短描述 / 手机优先时用矩阵。

## 全等级表

`levels` 每项是一级（第 8–10 项 = 专精 Ⅰ–Ⅲ，三星及以下只有 7 项）：`description` 是游戏原始标记，`vars` 是这一级的 blackboard——直接把 `skill_table` 的描述模板和各级 blackboard 传进来，由 [AkRichText](/arknights/rich-text) 填数、上色；`init` / `cost` / `duration` 是三列数值，空着的格显示「—」。`highlight` 高亮一行（当前等级），`terms` 给描述里的术语（晕眩）悬停说明。表头卡放在 `#header` 插槽。

@demo SkillSheet/Basic

## 范围 · 注释

表头卡的右侧槽放技能范围；表下的注释（「※不可对空」）写在 `#footer` 插槽里，每条一个 `<p>`。要自己画某一级的描述时用 `#description` 插槽（`{ row, level }`）。

@demo SkillSheet/Notes

## 表格里的数字

`table-numerals.css`（方舟组件最后加载）是一条硬规则：**表格数据里的数字一律用正文字体**，不用 Bender 系——Bender 数字是比例宽度、子集里没有 `tnum`、小字号发虚，成列就对不齐。全等级表、[参数矩阵](/arknights/skill-matrix)、[天赋条件表](/arknights/talent-table)、键值表自身都按正文字体写；这条规则兜底的是掉进 `td` / `th` / 键值表 `dd` 的 HUD 类小件（SP 芯片、精英化标记、道具数量角标、信赖值……）：字体回正文，字重 / 字号 / 颜色照旧。面板级的 HUD 数值（属性面板、统计数字、技能卡里的芯片）不在表格里，不受影响。

## Vue API

<PropsTable of="AkSkillSheet" />

## CSS 实现

结构：`.ak-skill-sheet > .ak-skill.ak-skill--wide`（表头）+ `table.ak-skill-table`（`th.lv / .desc / .num`；`tr.is-mastery` 专精行，7 级与专精之间一道略深的分隔；`tr.is-hl` 高亮行；`td.num` 为空时画「—」）+ `.ak-skill-sheet__note`。窄屏时数值列收窄、列头芯片只留图形。

<CssClasses :files="['arknights/skill-sheet.css']" />
