---
title: 游戏内富文本 RichText
component: rich-text
---

技能 / 天赋 / 关卡描述里的配色标记。游戏数据（`gamedata_const.richTextStyles`）里写成 `<@ba.vup>+50%</>`，页面上对应 `.ak-rt-*` 类：配色取游戏内色，亮色主题下校正到 AA 对比度。Lua / 模板把 `<@ba.vup>…</>` 转成 `<span class="ak-rt-vup">…</span>` 即可；Vue 版 `AkRichText` 直接吃游戏原始标记。

| 标记 | 类 | 含义 |
|---|---|---|
| `<@ba.vup>` | `.ak-rt-vup` | 增益（数值） |
| `<@ba.vdown>` | `.ak-rt-vdown` | 减益 |
| `<@ba.rem>` | `.ak-rt-rem` | 提醒（伤害类型等） |
| `<@ba.kw>` | `.ak-rt-kw` | 关键词 |
| `<@ba.talpu>` | `.ak-rt-talpu` | 潜能加成（同增益色） |
| `<$ba.stun>` 等 | `.ak-rt-term` | 术语：虚线下划线 + 悬停说明 |
| `<@tu.imp>` | `.ak-rt-imp` | 重要提示 |
| `<@ba.enemy>` · `<@ba.gild>` · `<@ba.drop>` · `<@ba.acrem>` | `.ak-rt-enemy` 等 | 敌方 · 镀层等，同名游戏样式 |
| `mission.levelname` | `.ak-rt-level` | 关卡名 |
| `<@ba.pn>` | `.ak-rt-pn` | 斜体 |

## 游戏标记

`text` 是原始标记：样式标签按名字认（命名空间不论，`cc.vup` 与 `ba.vup` 同色；认不得的样式只留文字），可以嵌套，没闭合的在末尾自动闭合；换行变 `<br>`。术语 `<$ba.xxx>` 的悬停说明来自 `terms`（`termDescriptionDict`，键是完整的 `ba.stun`）。

@demo RichText/Tags

## 占位符 · blackboard

技能描述在游戏里是模板：`{atk_scale:0%}` 这类占位符由各级 blackboard 填。`vars` 给取值（键不分大小写）：`:0%` 乘 100 加 %、`:0.0` 保留一位小数，前缀 `-` 取负，没有格式就原样；没给取值的占位符原样留着。[全等级表](/arknights/skill-sheet)就是把同一个模板配上每级的 `vars`；[参数矩阵](/arknights/skill-matrix)用 `#var` 插槽把占位符画成可切换的变量位。

@demo RichText/Variables

## 只包一层

手写正文时不必拼游戏标记：不写 `text`，用 `variant` 包住默认插槽；术语（`variant="term"`）的说明写在 `tip`。

@demo RichText/Wrap

## 数值变化（CSS）

纯 CSS 的小件，没有 Vue 版：`.ak-delta-up` / `.ak-delta-down` 在数值后面跟一枚 ▲ / ▼（增益 / 减益色），用于版本对比、模组前后对比。

```html demo
<p>攻击力 <b class="ak-delta-up">610</b>　防御力 <b class="ak-delta-down">352</b>　再部署 <b class="ak-delta-down">70s</b></p>
```

## Vue API

<PropsTable of="AkRichText" />

## CSS 实现

每个 `.ak-rt-*` 都有同名别名 `.ba-*`（`.ba-vup`，直接对应游戏标签名；`<@tu.imp>` 是 `.tu-imp`），以及语义别名 `.ak-buff` = 增益、`.ak-debuff` = 减益。

<CssClasses :files="['arknights/rich-text.css']" />
