---
title: 正文提示框 Cbox
component: cbox
---

编辑写在正文里的提示——「另见 xx 页面」「本节内容已删除，仅作存档」「剧透警告」。现网满站都是 `Template:Cbox2`，新皮肤给它换了外观：左侧图标井（等级色 24% 淡底 + 等级色线稿，图标贴顶、井随正文拉高）+ 右侧正文；直角、1px 边、不投影。

与 [Message](/components/message) 的分工：Message 是界面 / 系统反馈（横幅、可关闭、与 Toast 同族）；Cbox 是编辑写在正文里的内容。

## 等级

@demo Cbox/Levels

## 窄版

`narrow` 最宽 640（= 模板 `narrow=`）。长文字时图标贴顶。

@demo Cbox/Narrow

## 与现网模板的对应

| `Template:Cbox2` | `AkCbox` | CSS |
|---|---|---|
| `lv=0`（绿，另见 / 提示） | `level="tip"` | `.ak-cbox--tip` |
| `lv=1`（蓝，默认） | `level="info"`（默认） | `.ak-cbox` |
| `lv=2` / `lv=3`（黄 / 橙，注意） | `level="warning"` | `.ak-cbox--warning` |
| `lv=4`（红） | `level="danger"` | `.ak-cbox--danger` |
| — | `level="neutral"` | `.ak-cbox--neutral` |
| `narrow=` | `narrow` | `.ak-cbox--narrow` |

现网夜间样式本来就把 lv2 / lv3 并成一档，这里沿用。

## Vue API

<PropsTable of="AkCbox" />

## CSS 实现

<CssClasses :files="['components/cbox.css']" />
