---
title: 模组 Module
component: module
---

同现网 <code v-pre>{{模组}}</code>（`.equiptemplate`），一张卡装完：型号（类型图标 + SWO-X）+ 名称 + 说明 tooltip + 基础信息（故事）+ 三阶段属性 / 特性追加 · 天赋更新 + 解锁任务 + 解锁需求与材料。`color`（= 模板参数「类型颜色」，游戏模组类型底色）决定左侧粗色条、型号块与阶段条的颜色：`red` / `blue` / `green` / `yellow` / `purple`，原型证章不写 = 灰。

写法参考 Naive UI 的 `n-card`（`#header-extra`）+ `n-ellipsis`（`line-clamp` + 点击展开）：头部走 props，故事是默认插槽；三张表的行放在具名插槽里——`#stages` 放 `AkModuleStage`、`#unlock` 放 `AkModuleUnlock`，表头由卡片画。解锁任务是纯文本时用 `tasks`，要链接关卡号时用 `#tasks` 插槽写 `<li>`。

## 完整卡片

`AkModuleStage` 的 `stats` 按写的顺序排、数值绿字，`kicker` 是反色小标（特性追加 / 天赋更新），描述写在默认插槽里；`AkModuleUnlock` 的 `#requirement` 放信赖 / 精英阶段 / 任务标签，默认插槽放材料（[道具](/arknights/item)）。

@demo Module/Full

## 故事折叠

故事默认只露 3 行，「全文阅读」展开、「收起全文」收回。展开态是组件自己的状态，也可以用 `v-model` 接出来（外面放「全部展开」之类的开关）。无论展开与否，全文都在 DOM 里，可被搜索。

CSS 版的开关靠 `data-toggle-class` 约定：勾选「全文阅读」时皮肤脚本（`skin.js`，预览里是 `preview.js`）给 `data-toggle-target=".ak-module__main"` 切 `.is-open`；无 JS 时复选框照样在，只是故事停在 3 行。Vue 版自带状态。

@demo Module/Collapse

## 原型证章

`:collapsible="false"`：短文全文展开、不出开关；不写 `color`（灰条）；`#header-extra` 放说明标签。

@demo Module/Original

## 键盘与可访问性

- 「全文阅读」是 `<label>` 包着的原生复选框（`aria-controls` 指向故事），Tab 聚焦、Space 切换。复选框本身是 0×0 的隐形控件，焦点环画在整个开关上。
- 「说明 ⓘ」可聚焦，聚焦时显示解释（同悬停）。
- 阶段条是装饰（`aria-hidden`），读屏只读「STAGE n」。

## Vue API

### AkModule

<PropsTable of="AkModule" />

### AkModuleStage

<PropsTable of="AkModuleStage" />

### AkModuleUnlock

<PropsTable of="AkModuleUnlock" />

## CSS 实现

<CssClasses :files="['arknights/module.css']" />
