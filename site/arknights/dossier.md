---
title: 档案 Dossier
component: dossier
---

同现网 <code v-pre>{{人员档案}}</code> 的一段：标题行（中文 + 英文小标 + 右侧解锁条件）+ 正文。正文的 `<p>` 保留换行（`white-space: pre-line`），游戏文本里的 `\n` 可以原样放进一个 `<p>`。

## 档案条目 · 涂黑

`AkRedacted`（`.ak-redacted`）是不予公开 / 剧透的涂黑文本，悬停显出。CSS 版只认 `:hover`；Vue 版还可以聚焦（聚焦时显出），点按或 Enter / Space 切换常显（`v-model`），触屏也能看。[剧情对话](/arknights/dialogue)里也用它。

@demo Dossier/Basic

## 未解锁

`locked`：正文模糊、不可选，盖斜纹 + 🔒 解锁条件（`unlock` 同时写在标题行和遮罩上）。文本仍在 DOM 里，可被搜索。

@demo Dossier/Locked

## 人员档案

干员页的 9 段档案：竖排[标签页](/components/tabs)（`placement="left"`）每页放一个 `AkDossier`；「基础档案」里是[键值表](/arknights/kv)，「综合体检测试」是紧凑的[属性面板](/arknights/attrs)。页签第二行小字写解锁条件的短写；面板用 `display-directive="show:lazy"`，切到过的页保留。

@demo Dossier/Files

## Vue API

### AkDossier

<PropsTable of="AkDossier" />

### AkRedacted

<PropsTable of="AkRedacted" />

## CSS 实现

<CssClasses :files="['arknights/dossier.css']" />
