---
title: 对话框 Dialog
component: dialog
---

打断当前操作、要读者明确回应的模态窗口：确认精英化、删除确认、引用格式。白底直角、1px 边、投影；标题栏左侧 4px 主色条 + 细底线，底栏 `--ak-bg-surface-2` 底、按钮右对齐；遮罩是 `--ak-bg-overlay` + 2px 模糊。

**先想想是不是非用不可**：能就地完成的（撤销代替确认、行内展开代替弹窗）就别弹。

## 确认对话框

写法同 Naive UI 的 `n-modal`（`preset="dialog"`）：`v-model` 是否打开，`title` 标题，`positive-text` / `negative-text` 在底栏放确认（黑白反转，游戏内 `btn_on`）/ 取消两枚按钮，点了分别触发 `positive-click` / `negative-click` 并关闭。

@demo Dialog/Basic

## 尺寸 · 自定义底栏 · 不可随手关

`size`：`sm` 420 · `md` 640（默认）· `lg` 900 · `full` 占满 96vw × 92vh。`#header` / `#footer` 插槽换掉标题与底栏按钮。不可逆的动作可以关掉遮罩与 `Esc`（`:mask-closable="false"` `:close-on-esc="false"`）并去掉 ✕（`:closable="false"`），逼读者明确点一个按钮——危险按钮配 `stripes`。

@demo Dialog/Options

## 可访问性

用原生 `<dialog>` + `showModal()`，浏览器负责大部分：

- **焦点**：打开时焦点进入对话框（第一个可聚焦元素，通常是 ✕）；背后的页面整个 inert，`Tab` 只在对话框的控件之间走（走到头会经过浏览器地址栏再回来——原生 `<dialog>` 的行为，不把人困在页面里）；关闭后焦点**还给打开前的元素**（`AkDialog` 自己记着，被卸载时也还）。
- **Esc** 关闭（`close-on-esc` 可关）；点遮罩关闭（`mask-closable` 可关）——从框里拖选到框外松手不算点遮罩。
- **名字**：`title` 作 `aria-labelledby`；没有标题时写 `label`（`aria-label`）。
- 对话框里的提示、下拉菜单按 `Esc` 只收起自己，不会连对话框一起关。

## Vue API

<PropsTable of="AkDialog" />

## CSS 实现

模板 / Gadget 输出 `dialog.ak-dialog(.ak-dialog--sm …)` > `.ak-dialog__head( .ak-dialog__title + 关闭按钮 )` + `.ak-dialog__body` + `.ak-dialog__foot`，脚本里 `showModal()` 打开（预览站的 `data-dialog-open="#id"` / `data-dialog-close` 就是这么做的）。同一个文件里还有抽屉 `.ak-drawer--left/--right`（`.is-open` 滑入）与全屏遮罩 `.ak-overlay`——皮肤的手机侧栏在用，暂无 Vue 版。

<CssClasses :files="['components/dialog.css']" />
