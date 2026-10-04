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

## 框内的段落与列表

框里直接放的 `p` / `ul` / `ol` / `dl` 段距是 8px，不跟正文的 16px——框内字号 14px，现网又常见「`*` 列表 + 一行说明 + `:` 缩进」连着写，照正文段距每块之间都空出一行。最后一块不留下外边距（收尾的是列表或 `:` 缩进行时，最后一个 `li` / `dd` 的也归零，框底与框顶留白一致）；嵌套的列表照正文规则。

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

其余参数：`title=` → `.ak-cbox__title`，`text=` → `.ak-cbox__body` 的正文；三个自定义色参数落到私有变量上，模板用 `style="--_c:…;--_bg:…"` 覆盖即可——`bg` → `--_bg`（底色），`iconcolor` → `--_c`（图标与标题色），`bgleft`（图标井底）由 `--_c` 按 24% 算出，不单独给。

`mdi=true` + `icon=` 的 MDI 图标改从皮肤的 SVG sprite 取：`arrow-top-right-thick` → `i-arrow-ne`、`microphone-message` → `i-mic`、`delete-empty` → `i-trash`，提示 / 警告用 `i-info` / `i-warn`。MDI 名 → `i-*` 名的对照表由模板维护，缺的图标往 sprite 里补（见[图标](/foundations/icons#界面线稿图标)）。模板输出：

```html
<div class="ak-cbox ak-cbox--tip"><span class="ak-cbox__icon"><svg class="ak-icon"><use href="#i-arrow-ne"/></svg></span><div class="ak-cbox__body">…</div></div>
```

## Vue API

<PropsTable of="AkCbox" />

## CSS 实现

<CssClasses :files="['components/cbox.css']" />
