---
title: 回到顶部 FAB
component: fab
---

右下角 44px 的反色方块（悬停变主色），滚过一屏淡入，点了平滑滚回顶部。

**整页那一枚由皮肤输出**（骨架末尾的 `button.ak-fab`，`skin.js` 滚过 600px 加 `.is-visible`），模板 / 小部件不用再放。它在侧栏还在的宽度（≥ 1120）出现：更窄时侧栏变抽屉，「回到顶部」改由目录浮层首项承担——手机上浮动按钮太挡视野。1120–1400 目录浮层开着时它也让位。

## 外观

Vue 版照 Naive UI 叫 `AkBackTop`（同 `n-back-top`）。`v-model` 是是否显示；`:visibility-height="false"` 时不看滚动，显隐完全由 `v-model` 定。

@demo Fab/Basic

## 滚动区域里的回到顶部

Vue 版主要给页面里某个自己滚动的区域用（长列表、搜索结果面板）：`position="absolute"` 贴最近的定位祖先右下，`listen-to` 指向滚动容器（元素或选择器），滚过 `visibility-height`（默认 600，同皮肤）出现，点了把**这个容器**滚回顶部。`absolute` 的不受 < 1120 收起的影响。回到顶部按钮要放在滚动容器**外面**（和它同在一个 `position: relative` 的框里），否则会跟着内容一起滚走。

@demo Fab/Scroll

## 可访问性

- 只有图标，`label`（默认「回到顶部」）同时作 `aria-label` 与 `title`。
- 隐藏时（`opacity: 0`）标 `inert`：不可点、不进 Tab 顺序、读屏读不到——不会在角落留一枚看不见的按钮。
- 系统开了「减少动态效果」时直接跳回顶部，不平滑滚动。

## Vue API

<PropsTable of="AkBackTop" />

## CSS 实现

皮肤输出的结构（图标用 sprite）：

```html
<button class="ak-fab" aria-label="回到顶部"><svg width="18" height="18"><use href="#i-up"/></svg></button>
```

显隐由脚本切 `.is-visible`。`.ak-fab--absolute` 是 Vue 版 `position="absolute"` 用的修饰类：贴定位祖先右下、任何宽度都显示。

```html demo
<div class="ak-relative ak-border ak-bg-surface ak-p-4">
  <p class="ak-mb-0">右下角：<code>.ak-fab.ak-fab--absolute.is-visible</code></p>
  <p class="ak-mb-0 ak-fs-sm ak-fg-muted">整页那枚是 fixed，窄于 1120px 时被皮肤收起；</p>
  <p class="ak-mb-0 ak-fs-sm ak-fg-muted">这里用 absolute 看外观。</p>
  <button class="ak-fab ak-fab--absolute is-visible" aria-label="回到顶部"><svg width="18" height="18"><use href="#i-up"/></svg></button>
</div>
```

<CssClasses :files="['components/fab.css']" />
