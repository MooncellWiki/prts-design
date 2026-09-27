---
title: 标签页 Tabs
component: tabs
---

同一位置切换几组平级内容。正文里编辑写的 `<tabber>`（TabberNeue）由皮肤单独换肤（见 [MediaWiki 内容样式 · TabberNeue](/content/tabber)），这里是模板 / 小部件用的版本。

## 变体

下划线（默认，选中项青色下划线 + 左上角标）· 胶囊底 · 游戏内块状（选中项黑白反转）。

写法同 Naive UI 的 `n-tabs`：`AkTabs` 里放若干 `AkTabPane`（页签 + 面板，`name` 是 `v-model` 的值，`tab` 是页签文字）；只要一排页签当筛选、内容在别处时，改放 `AkTab`。

@demo Tabs/Variants

## 竖排

`placement="left"`：干员档案那种，页签竖排在左、面板在右，上下方向键切换。页签要第二行小字（解锁条件）时用 `AkTabPane` 的 `#tab` 插槽，小字放 `<small>`。

面板默认只渲染当前页（`display-directive="if"`，同 Naive）；`show` 全部渲染、非当前页 `hidden`；`show:lazy` 第一次切到时才渲染，之后保留——档案、语音这类切来切去的长内容用它。

@demo Tabs/Vertical

## 键盘

| 键 | 行为 |
|---|---|
| `←` / `→`（竖排为 `↑` / `↓`） | 移到上一个 / 下一个页签并选中 |
| `Home` / `End` | 第一个 / 最后一个 |
| `Tab` | 从页签组进入当前面板 |

只有当前页签在 Tab 顺序里（roving tabindex），符合 [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) 的自动激活模式。

## Vue API

### AkTabs

<PropsTable of="AkTabs" />

### AkTabPane

<PropsTable of="AkTabPane" />

### AkTab

<PropsTable of="AkTab" />

## CSS 实现

CSS 实现只负责外观；切换由皮肤脚本（`data-tabs` 分组）或 Vue 组件负责。

<CssClasses :files="['components/tabs.css']" />
