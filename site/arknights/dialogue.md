---
title: 剧情对话 Dialogue
component: dialogue
---

剧情页的对话，输出 `<dl>`：说话人一列右对齐（主色粗体）、台词一列。`AkDialogue` 里放若干 `AkDialogueLine`：`speaker` 是说话人；不写就是旁白——说话人列写「旁白」，整句灰色斜体（`.narrator`）。

## 对话与旁白

@demo Dialogue/Basic

## 分段 · 剧透

分段就是几个 `AkDialogue` 之间插小标题。剧透用[档案](/arknights/dossier)里的 `AkRedacted` 涂黑，台词里、说话人里（`#speaker` 插槽）都能放。

@demo Dialogue/Segments

## Vue API

### AkDialogue

只有默认插槽：若干 `AkDialogueLine`。

### AkDialogueLine

<PropsTable of="AkDialogueLine" />

## CSS 实现

`dt` 显式 `margin: 0`（同[键值表](/arknights/kv)）：否则正文的 `.mw-parser-output dt { margin-top }` 漏进来，说话人比台词低 8px。

<CssClasses :files="['arknights/dialogue.css']" />
