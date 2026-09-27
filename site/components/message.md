---
title: 消息 Message
component: message
---

界面 / 系统给读者的反馈：「数据来自哪个版本」「已同步」「本页含未实装内容」「删除不可撤销」。左侧 4px 等级色条 + 等级色淡底，标题行用等级色；与 [轻提示 Toast](/components/toast) 同族（Toast 是会自己消失的浮层版）。

与 [正文提示框 Cbox](/components/cbox) 的分工：Cbox 是**编辑写在正文里的内容**（= 现网 `Template:Cbox2`）；Message 是**界面**说的话——横幅、可关闭、操作结果。

## 变体

写法同 Naive UI 的 `n-alert`：`variant` 定等级色（info 默认 · success · warning · danger · neutral · accent），`title` 是加粗的标题行，图标按等级自动选，`icon` 可换、`show-icon` 可关。危险提示可叠 `stripes` 斜纹。

@demo Message/Variants

## 可关闭

`closable` 在右侧放一枚 ✕：点了触发 `close` 并隐藏自己。不绑定 `v-model` 时关了就没了；绑定了可以再打开。标题要带链接时用 `#header` 插槽。

@demo Message/Closable

## 横幅

`banner`：顶边 3px 色条、文字居中，给站点公告 / 页顶通知；危险横幅配 `stripes`。

@demo Message/Banner

## 可访问性

- `warning` / `danger` 输出 `role="alert"`，其余 `role="status"`：动态插入（提交后出现的结果）时读屏会念，前者立即、后者礼貌播报。页面一加载就在的提示不会被重复念。
- 图标是装饰（`aria-hidden`），等级靠文字表达——不要只写一个图标或只靠颜色区分「成功 / 失败」。
- 关闭按钮读屏名「关闭」，有焦点环（`message.css` 补回了被 `all: unset` 清掉的 `:focus-visible` 描边）。

## Vue API

<PropsTable of="AkMessage" />

## CSS 实现

模板 / Lua 输出 `div.ak-message(.ak-message--success …)` > `svg.ak-message__icon` + `div.ak-message__body`（里面可有 `div.ak-message__title`）+ 可选 `button.ak-message__close`。

<CssClasses :files="['components/message.css']" />
