---
title: 文字提示 Tooltip
component: tooltip
---

悬停或键盘聚焦时浮出的一句解释：术语（「晕眩」「无敌」）、缩写、图标按钮的名字、技力回复方式。反转底（暗主题白底黑字、亮主题黑底白字）、直角、12px 字。

## 两种实现

| | 纯 CSS：`data-ak-tip` | Vue：`AkTooltip` |
|---|---|---|
| 写法 | 任意元素加 `data-ak-tip="文字"`（气泡是 `::after`） | `#trigger` 放触发元素，默认插槽放内容 |
| 内容 | 属性里的一句字符串 | 任意内容（加粗、换行、链接） |
| 方向 | 只在上方 | `placement`：上 / 下 / 左 / 右，上下可左 / 右缘对齐 |
| 触发 | 悬停 + 触发元素自己 `:focus-visible` | 悬停 + 聚焦（默认）/ 只聚焦 / 点击 / 手动（`v-model`） |
| 读屏 | 气泡文字不关联到元素 | 触发元素 `aria-describedby` 指向 `role="tooltip"`；`Esc` 收起 |
| 用在 | MW 模板、Lua 输出、不需要 JS 的地方；`AkItem` 的 `tip` 也是它 | 小部件里需要上面任何一项时 |

两者外观相同（`.ak-tooltip` 与 `[data-ak-tip]::after` 用同一组令牌）。一两句话的长解释：纯 CSS 版加 `.ak-tip--wide`（允许折行、最宽 280）；Vue 版自动在 280px 处折行。

```html demo
<p>属性表头：<span class="ak-term" data-ak-tip="不包括信赖及潜能加成">精英0 1级</span> · 技力：<span class="ak-tag ak-tag--outline" data-ak-tip="每次攻击回复1点技力">攻击回复</span></p>
<p>技能生效期间，持有效果：<span class="ak-term ak-tip--wide" data-ak-tip="无敌：无法被不同阵营选中（属于无法选择类效果）；受到的伤害与元素值变为 0；无法触发任何单位未绑定选择器的能力">无敌</span>、<span class="ak-term ak-tip--wide" data-ak-tip="晕眩免疫：使自身的晕眩失效，但不会清除相关 Buff">晕眩免疫</span></p>
```

纯 CSS 版的气泡闲置时收成 0 宽（`max-width: 0` + `overflow: hidden`），不只是透明——透明的气泡仍占布局，靠近右缘的长提示会把手机页面撑出横向滚动。

## 基本用法

写法同 Naive UI 的 `n-tooltip`。触发元素取 `#trigger` 里的第一个元素 / 组件；是 `<span class="ak-term">` 这种不可聚焦的元素时自动补 `tabindex="0"`，键盘用户也能看到。`trigger="click"` 改成点击开合（点外面 / `Esc` 收起）。

@demo Tooltip/Basic

## 方向

`placement`：`top`（默认）· `bottom` · `left` · `right`，间距 6px，同纯 CSS 版；`top-start` / `bottom-end` 这类是与触发元素左 / 右缘对齐（同 Naive）。**不自动翻转**（不引定位库）：贴着视口边缘的触发元素自己选方向 / 对齐。下面用 `v-model` 让四个提示常显。

@demo Tooltip/Placements

## 弹出卡片 Popover

`AkPopover`（同 Naive 的 `n-popover`）：白底卡片、顶边 2px 主色条、最宽 360，能放标题（`title` / `#header`）、段落、链接、道具。**默认点击开合**——里面常有可点的东西，悬停弹出的卡片键盘用户够不着；只是富文本解释时可以 `trigger="hover"`。点外面 / `Esc` 收起，焦点在卡片里时还给触发元素。

@demo Tooltip/Popover

## 可访问性

- 提示里只放**补充说明**：不要把完成任务必需的信息只写在提示里（触屏没有悬停）。
- 触发元素必须可聚焦；`AkTooltip` 对原生不可聚焦的元素自动补 `tabindex="0"`，组件（如 `AkButton`）假定自己渲染可聚焦元素。
- 悬停出现的提示可以移进去（离开后 `duration` 毫秒才消失），`Esc` 随时收起——满足 WCAG 1.4.13。
- 点击打开的 Popover 是非模态对话框：触发元素 `aria-haspopup="dialog"` + `aria-expanded` + `aria-controls`，卡片 `role="dialog"`、有标题时 `aria-labelledby` 指向标题；悬停打开的等同富文本提示（`aria-describedby`）。

## Vue API

### AkTooltip

<PropsTable of="AkTooltip" />

### AkPopover

<PropsTable of="AkPopover" />

## CSS 实现

`.ak-term` 是术语的虚线下划线（悬停淡青底），`data-ak-tip` 与 `AkTooltip` 都可以配它。`.ak-tip-anchor` 与 `.ak-tooltip--*` / `.ak-popover--*` 方向修饰是给 Vue 版定位用的：外层相对定位，气泡贴在一边。

<CssClasses :files="['components/tooltip.css']" />
