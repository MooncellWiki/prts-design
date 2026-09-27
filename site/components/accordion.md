---
title: 折叠面板 Accordion
component: accordion
---

原生 `<details>` 折叠块：标题行左侧主色 `+` / `−`，展开后标题行加底色和分隔线。常见问题、档案、默认收起的长表格。正文里编辑手写的 `mw-collapsible` 是另一回事，这里是模板 / 小部件用的。

## 基本

Vue 版照 Naive UI 叫 `AkCollapse` + `AkCollapseItem`（同 `n-collapse`）：`v-model` 是展开项 `name` 的数组；标题用 `title` 或 `#header` 插槽，展开内容写在默认插槽里（正文排版照常生效）。

@demo Accordion/Basic

## 手风琴

`accordion`：同一时间只展开一项，展开一项时收起其他。

@demo Accordion/Accordion

## 键盘与可访问性

每项就是原生 `<details>` + `<summary>`：按钮语义、展开状态、Enter / 空格开合都是浏览器给的，不另加 `aria-expanded`；页内查找（Ctrl+F）命中收起的内容时浏览器会自动展开，`v-model` 跟着同步。`<summary>` 带 `aria-controls` 指向内容区。另外补了 [WAI-ARIA Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) 的可选键盘支持：

| 键 | 行为 |
|---|---|
| `Enter` / `空格` | 展开 / 收起当前项 |
| `↓` / `↑` | 移到下一项 / 上一项的标题（首尾循环） |
| `Home` / `End` | 第一项 / 最后一项的标题 |

## Vue API

### AkCollapse

<PropsTable of="AkCollapse" />

### AkCollapseItem

<PropsTable of="AkCollapseItem" />

## CSS 实现

模板直接输出 `<details>`，不需要脚本；要默认展开写 `open`。

```html demo
<details class="ak-details" open>
  <summary>什么是 AKDS？</summary>
  <div class="ak-details__body">明日方舟网页设计系统，为 prts.wiki 皮肤设计。</div>
</details>
<details class="ak-details">
  <summary>为什么不用 Codex 默认外观？</summary>
  <div class="ak-details__body">Codex 令牌被桥接到 <code>--ak-*</code>，核心 / 扩展 UI 自动跟随；但视觉语言完全按明日方舟本体重建，而不是套一层配色。</div>
</details>
```

<CssClasses :files="['components/accordion.css']" />
