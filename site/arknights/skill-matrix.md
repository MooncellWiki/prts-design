---
title: 技能参数矩阵 SkillMatrix
component: skill-matrix
---

[全等级表](/arknights/skill-sheet)的另一种对比法（二选一，看版面）：等级横着放、参数竖着放（游戏内技能详情 / 各类工具箱的写法）。描述只写一遍，变量位写成区间（200%→320%）；每个参数一行、每级一列，**较上一级有变化的格子才亮**、没变的淡掉——一眼看出哪一级涨了什么、涨了多少，十句重复的话不用读十遍，手机上也不用横向滚。

## 参数矩阵

`description` 是描述模板（游戏原始标记），里面的 `{key}` 占位符是变量位；`rows` 是参数行，`key` 对上占位符的那几行驱动描述里的变量位，`sp`（`init` / `cost` / `duration`）的行用 SP 芯片当参数名。`values` 是各级已经写好的字（「200%」）。有没有变化（`td.is-up`）、7 级与专精之间的分隔由组件算。

**悬停某一列 → 整列高亮，描述里的变量位换成该级的值；离开还原区间。点列里任一格钉住这一列，再点取消。**

@demo SkillMatrix/Basic

## 配等级选择器

钉住的列就是 `v-model`（等级 1–10，没钉住是 `undefined`），可以和[技能等级选择](/arknights/skill-levels)绑同一个值：点选择器 = 钉住那一列，点矩阵的列 = 选择器跟着变。

@demo SkillMatrix/Linked

## 键盘与可访问性

列头的等级是按钮（`aria-pressed` = 钉住的列），一组只有一个 Tab 停点：

| 键 | 行为 |
|---|---|
| `Tab` | 进入列头（停在上次聚焦 / 钉住的列，否则第 1 列） |
| `←` / `→` | 移到上一列 / 下一列（聚焦即预览该列，同悬停） |
| `Home` / `End` | 第一列 / 最后一列 |
| `Enter` / `Space` | 钉住 / 取消这一列 |

矩阵本身是完整的数据表（`th scope`、`label` 作表格的可访问名），读屏用户直接读表即可；描述里变量位的切换只是视觉上的便利，不设 live region，免得每挪一列都播报一次。

## Vue API

<PropsTable of="AkSkillMatrix" />

## CSS 实现

结构：`.ak-skill-sheet > .ak-skill--wide + .ak-skill-sheet__tpl`（描述 + `.ak-var[data-var]`）`+ table.ak-skill-matrix`（`col.label`；`thead th` 等级，`th.is-mastery` 专精、`.m-start` 专精 Ⅰ 那一列的左分隔；`tbody tr[data-var] > th` 参数名 + `td.is-up` / `td`；`.is-hl` 当前列）。表格数字走正文字体（见[表格里的数字](/arknights/skill-sheet#表格里的数字)）。

纯 CSS 用法（模板 / Lua 输出）没有 JS 时就是一张静态矩阵；列头的 `<button>` 是 Vue 版加的（`all: unset` 去外观，焦点环补回）。

<CssClasses :files="['arknights/skill-matrix.css']" />
