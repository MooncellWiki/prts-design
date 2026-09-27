---
title: 天赋条件表 TalentTable
component: talent-table
---

**干员页正文的天赋用这个**：同现网 prts.wiki，一张表列完各精英阶段 / 模组等级下的效果，一个天赋一张表（「第一天赋」「第二天赋」）。列表 / 侧栏里的摘要用[天赋卡](/arknights/talent)。

## 条件表

`rows` 每项是一个条件下的效果：`name` 天赋名（相邻几行同名合并成一格）、`condition` 条件、`description` 描述（游戏原始标记，由 [AkRichText](/arknights/rich-text) 渲染）。条件格要放[精英化](/arknights/elite)图标时用 `#condition` 插槽（`{ row, index }`）。

@demo TalentTable/Basic

## 潜能 · 算法开关

表头右侧两枚开关，都是组件自己的状态，也可以用 `v-model` 暴露出来：

- **潜能**（默认 `v-model`）：有任一行写了 `potential`（潜能加成后的描述，加成部分一般是 `<@ba.talpu>（+1%）</>`）就出现；打开后描述换成潜能版。`potential-rank` / `potential-icon` 是开关上的「潜能5」与图标。
- **算法**（`v-model:calc`）：`calc-toggle` 打开时出现。描述里每个加成项前用 `AkCalc` 标出它进公式的方式——绿 + 直接加算 · 蓝 + 直接乘算 · 橙 + 最终加算 · 橙 × 最终乘算（同现网的四枚小图标）；开关打开时标记与表尾图例一起出现，图例末尾可用 `#legend` 插槽加「详见」链接。

要插 `AkCalc` 就得自己画描述：`#description` 插槽（`{ row, index, potential }`）——有潜能版的行调两次，`potential` 告诉你这次画的是哪一版。

@demo TalentTable/Toggles

预览页 / 皮肤里的纯 CSS 版靠 `input[data-toggle-class]` + 脚本给表加类（`.is-pot` / `.is-calc`），现皮肤脚本还没接上这段；Vue 版自带状态，不受影响。

## 可访问性

开关是带 `<label>` 的原生复选框（读作「潜能5加成」「算法」）。两版描述都在 DOM 里、由 CSS 切换显示，隐藏的那版 `display: none`，读屏也跳过。`AkCalc` 是 `role="img"`，读作「直接乘算」等（悬停同）。

## Vue API

### AkTalentTable

<PropsTable of="AkTalentTable" />

### AkCalc

<PropsTable of="AkCalc" />

## CSS 实现

结构：`table.ak-talent-table > thead( th.name th.cond th.desc > label.ak-check.ak-talent-table__toggle ) + tbody > tr( td.name[rowspan] td.cond td.desc( .ak-talent-table__base + .ak-talent-table__pot ) ) + tfoot > tr.ak-talent-table__legend`；表上 `.is-pot` / `.is-calc` 切换。窄屏时开关不再浮在右侧、换到「描述」下面。表格数字走正文字体（见[表格里的数字](/arknights/skill-sheet#表格里的数字)）。

<CssClasses :files="['arknights/talent-table.css']" />
