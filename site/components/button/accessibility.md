---
title: 按钮 Button · 可访问性
component: button
---

## 语义

- 动作用 `<button type="button">`，导航用 `<a href>`。`AkButton` 有 `href` 时自动渲染成 `<a>`。
- 表单里的提交按钮显式写 `type="submit"`；默认是 `button`，避免意外提交。

## 名称

- 有文字的按钮，名称就是文字。
- **只有图标的按钮必须有名称**：`AkButton` 只写 `icon`、不写文字时 `label` 必填（漏写开发时控制台会警告），同时输出 `aria-label` 与 `title`。CSS 实现里写 `<button class="ak-btn ak-btn--icon" aria-label="搜索">`。
- 按钮里的装饰图标 `aria-hidden="true"`（`AkIcon` 不传 `label` 时自动加）。

## 状态

| 状态 | 输出 |
|---|---|
| 禁用 | `<button disabled>`；链接形态用 `aria-disabled="true"` 并去掉 `href`（`<a>` 没有 `disabled`） |
| 加载中 | `aria-busy="true"`，并不可点（`pointer-events: none`） |
| 按钮组 | 组上 `role="group"`，一组有意义的动作时加 `aria-label`（`AkButtonGroup` 的 `label`） |

## 键盘与焦点

- `Tab` 聚焦，`Enter` / `Space` 触发（原生 `<button>` 行为）。
- 焦点环：`2px solid var(--ak-focus)`、外偏 2px，两套主题下对比都足够；不要去掉 `outline`。

## 对比度与尺寸

- 大号 UI 文字 / 按钮 ≥ 3:1（规范 §6）；各变体在两套主题下都满足。
- 触控目标 ≥ 36px（默认高度）；`xs` / `sm` 只用在密集的桌面表格里。
