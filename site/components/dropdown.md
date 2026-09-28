---
title: 下拉菜单 Dropdown
component: dropdown
---

点一枚按钮拉下一列动作或链接：页面动作簇的「更多」、用户菜单、排序 / 语种切换。白底卡片、1px 边、投影；悬停 / 键盘移到的项是**左 2px 青条 + 淡底**，与侧栏当前项、搜索面板高亮行同一语言；危险项红字；组之间一条分隔线。

## 基本用法

写法同 Naive UI 的 `n-dropdown`：默认插槽放触发元素（一般是 `AkButton`），`options` 给菜单项，选中触发 `select(key, option)`，之后菜单收起、焦点回到触发按钮。菜单项 `{ key, label, icon?, disabled?, danger?, href? }`，`{ type: "divider" }` 是分隔线。

给了 `value` 就是单选菜单：当前项高亮（`.is-active`）、`role="menuitemradio"` + `aria-checked`，打开时焦点落在它上面。

@demo Dropdown/Basic

## 分组 · 链接项

`{ type: "group", label, children }` 是带小标题的一组，相邻两组之间自动一条线——对应 MW 门户（`#p-cactions` / `#p-tb`）塞进卡片的写法。有 `href` 的项渲染成 `<a>`（照常跳转，也触发 `select`）。触发按钮靠右时用 `placement="bottom-end"` 让菜单右对齐。

@demo Dropdown/Groups

## 键盘

按 [WAI-ARIA 菜单按钮](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)：

| 焦点在 | 键 | 行为 |
|---|---|---|
| 触发按钮 | `Enter` / `空格` / `↓` | 打开，焦点到第一项（单选菜单到当前项） |
| 触发按钮 | `↑` | 打开，焦点到最后一项 |
| 菜单 | `↓` / `↑` | 下一项 / 上一项（首尾循环；禁用项也停，但选不了） |
| 菜单 | `Home` / `End` | 第一项 / 最后一项 |
| 菜单 | 字母 / 汉字 | 跳到下一个以它开头的项 |
| 菜单 | `Enter` / `空格` | 选中（链接项跳转），收起，焦点回到按钮 |
| 菜单 | `Esc` | 收起，焦点回到按钮 |
| 菜单 | `Tab` | 收起，焦点照常移到后面的元素 |

鼠标点菜单外面也会收起。菜单是 `role="menu"`，名字默认取触发按钮的文字（`aria-labelledby`），`label` 可另给；组是 `role="group"` + `aria-label`（小标题只给眼睛看）。

## Vue API

<PropsTable of="AkDropdown" />

`options` 的类型 `DropdownMixedOption` / `DropdownOption` 从 `@mooncellwiki/prts-design-vue` 导出。

## CSS 实现

无 JS 的写法：`.ak-dropdown > details > summary + .ak-menu`（原生 `<details>` 开合，皮肤的用户菜单 / 「更多」就是这样）；有 JS 时在 `.ak-dropdown` 上切 `.is-open`（Vue 版就是这样）。菜单可以是 `ul.ak-menu > li > a`，也可以是 `div.ak-menu > nav.ak-menu__group( .ak-menu__label + ul )` 分组卡片，`.ak-menu__head` 是卡片抬头（用户名）。放在正文里时外层标 `ak-not-prose`，免得吃正文的列表符与链接色。

```html demo
<div class="ak-dropdown ak-not-prose"><details><summary class="ak-btn">下拉菜单 ▾</summary><ul class="ak-menu"><li class="ak-menu__label">页面操作</li><li><a href="#">移动</a></li><li><a href="#">保护</a></li><li class="ak-menu__sep"></li><li><a href="#" class="ak-menu__item--danger">删除</a></li></ul></details></div>
<div style="height: 170px"></div>
```

<CssClasses :files="['components/dropdown.css']" />
