<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 消息框

`base/notices.css`：核心与扩展输出的提示——`mw-message-box`（旧式 `Html::warningBox` 等）、Codex 的 `cdx-message`（编辑页、特殊页面）、维基常见的 <code v-pre>{{ambox}}</code> 式表格消息框，以及 hatnote（「关于 X，请见 Y」）。

统一做法：浅色状态底 + 左侧 4px 状态色条 + 1px 细框，色条与细框用 `border-image` 直角拼接；状态色走 `--_c` 一个变量，四种状态只换它和底色。颜色全部来自语义令牌（`--ak-info` / `--ak-warning` / `--ak-danger` / `--ak-success` 与对应的 `-bg`），两套主题各自成立。

```html demo
<div class="mw-message-box mw-message-box-notice">本页面内容基于游戏版本 2.7.61 数据。</div>
<div class="mw-message-box mw-message-box-warning">本条目包含剧情剧透，请谨慎阅读。</div>
<div class="mw-message-box mw-message-box-error">数据校验失败：技能表缺少 skchr_chen_3 等级 10。</div>
<div class="mw-message-box mw-message-box-success">已保存到你的干员计划。</div>
<div class="hatnote">本文介绍干员「陈」。关于假日威龙陈，请见「陈（假日威龙）」。</div>
```

## ambox

<code v-pre>{{ambox}}</code> 一类的表格消息框（`table.ambox` / `.messagebox`）同一张脸，底色固定浅一档，类型只换色条：`ambox-notice` 信息 · `ambox-content` 警告 · `ambox-delete` / `ambox-serious` 危险 · `ambox-style` 黄。

```html demo
<table class="ambox ambox-content" style="width:100%"><tr><td class="mbox-text">本条目需要补充更多来源。请协助添加可靠来源。</td></tr></table>
<table class="ambox ambox-style" style="width:100%"><tr><td class="mbox-text">本条目的格式需要整理。</td></tr></table>
```

## 和组件的关系

这里是**MW 自己输出**的提示。编辑在正文里写提示用[正文提示框 Cbox](/components/cbox)（= 现网 <code v-pre>{{Cbox2}}</code>）；模板 / 小部件里的状态消息用[消息 Message](/components/message)。三者同一套色条语言，但结构和用途不同，不要互相冒充。

## CSS

<CssSelectors :files="['base/notices.css']" />
