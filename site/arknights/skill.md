---
title: 技能卡 Skill
component: skill
---

一个技能的摘要卡：64px 图标（SP 类型色描边 + 底部色条，同游戏）、名称、[SP 类型 / 触发](/arknights/sp)、消耗 / 初始 / 持续，下面一段描述。给列表、侧栏、干员卡悬停这类「一眼看一个等级」的场合；**干员页正文用[全等级表](/arknights/skill-sheet)**（或[参数矩阵](/arknights/skill-matrix)），不做「选一个等级看一份」的切换。

右栏撑满图标高度、两端对齐：名称行贴图标顶边，数值芯片行贴图标底边。

## 技能卡

`sp-type` 决定图标描边 / 底条色与 SP 标签（`auto` 绿 · `attack` 橙 · `hit` 黄 · `passive` 灰）；`trigger` 是手动 / 自动触发，被动技能不写。`cost` / `init` 画成芯片，`duration` 写成「持续 25s」（数字按秒），哪个不写哪个不显示。描述写在默认插槽里——游戏原始标记套一层 [AkRichText](/arknights/rich-text)。`selected` 是游戏内的选中态（蓝框 + 左上角标）。

@demo Skill/Cards

## 未解锁

`locked`：图标灰化 + 锁。名称行末尾的附加内容（「未解锁」标签）用 `#header-extra` 插槽。

@demo Skill/States

## 右侧槽

写了 `unlock`（开放条件，可带 `unlock-icon` 精英化图标）或 `#aside` 插槽（技能[范围](/arknights/range)）就是三栏的宽卡 `.ak-skill--wide`；窄屏时右侧槽换到第二行。全等级表 / 参数矩阵的表头就是一张不写数值的宽卡。

@demo Skill/Wide

## Vue API

<PropsTable of="AkSkill" />

## CSS 实现

结构：`.ak-skill > .ak-skill__icon + div( .ak-skill__head( __name + .ak-sp + .ak-sp-trigger ) + .ak-skill__stats ) [+ .ak-skill__aside] + .ak-skill__desc`。技能名是标题元素（`heading-level`，默认 `h4`；干员页正文里是 `h3`），MW 章节标题的装饰由 `title-reset.css` 去掉。

<CssClasses :files="['arknights/skill.css']" />
