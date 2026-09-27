# 色彩

令牌分三层：**原始色板** `--ak-{hue}-{step}`（每个颜色标明出处）→ **语义令牌** `--ak-{role}`（随主题变化，组件只用这一层）→ **Codex 桥接**（MediaWiki 核心 / 扩展 UI 自动跟随）。源文件是 `tokens/src/` 下的 JSON5（W3C DTCG 格式），`pnpm tokens` 生成 `src/tokens.css` 与 `tokens/tokens.json`；下面的表都读生成的 JSON。

点色块复制 `var(--…)`。

## 原始色板

组件不直接用原始色；需要时经由语义令牌引用。

### 中性色

取自游戏内 UI（标准按钮 `#313131`、亮色面板 `#F5F5F5`）与官网（`#1D1F20`、`#8D8D8D`、`#D2D2D2`）。

<TokenTable prefix="color.neutral" />

### 品牌：青 / 蓝

<TokenTable prefix="color.brand" />

### 黄 · 绿 · 橙 · 红 · 紫

<TokenTable prefix="color.yellow" />
<TokenTable prefix="color.lime" />
<TokenTable prefix="color.orange" />
<TokenTable prefix="color.red" />
<TokenTable prefix="color.green-purple" />

### 稀有度（官方色阶）

来源 `gamedata/excel/sandbox_table.json → charRarityColorList`，不用「看起来像」的近似色。填充色 `--ak-rarity-N`；文字用 `--ak-rarity-N-text`——暗色下就是填充色，亮色下加深到白底可读（见下面[稀有度文字色](#稀有度文字色)）。

<TokenTable prefix="color.rarity" />

用法：容器写 `data-rarity="1–6"`，子元素用 `var(--ak-r)`（填充）/ `var(--ak-r-text)`（文字）；便捷类 `.ak-r-text` `.ak-r-bg` `.ak-r-border` `.ak-r-bar`（左侧色条）`.ak-r-chip` `.ak-r-swatch`。星级组件见[稀有度 Rarity](/arknights/rarity)。

```html demo
<div class="ak-flex-col ak-gap-3">
  <div class="ak-flex ak-gap-2 ak-wrap"><span data-rarity="1" class="ak-r-chip">★1 #BABABA</span><span data-rarity="2" class="ak-r-chip">★2 #D3DC35</span><span data-rarity="3" class="ak-r-chip">★3 #82C5F5</span><span data-rarity="4" class="ak-r-chip">★4 #BF96ED</span><span data-rarity="5" class="ak-r-chip">★5 #EFD691</span><span data-rarity="6" class="ak-r-chip">★6 #FF9433</span></div>
  <div class="ak-flex ak-gap-4 ak-wrap"><span data-rarity="6" class="ak-r-text ak-fw-700">六星文字色</span><span data-rarity="5" class="ak-r-text ak-fw-700">五星文字色</span><span data-rarity="4" class="ak-r-text ak-fw-700">四星文字色</span><span data-rarity="3" class="ak-r-text ak-fw-700">三星文字色</span><span data-rarity="2" class="ak-r-text ak-fw-700">二星文字色</span><span data-rarity="1" class="ak-r-text ak-fw-700">一星文字色</span></div>
</div>
```

### 技能 SP 回复类型

自动回复 / 攻击回复 / 受击回复 / 被动四种回复方式各一个色（游戏内 SP 条的颜色）；颜色不是唯一的信息载体，芯片上总有文字。触发方式不用彩色，用黑白反转：手动触发黑底白字、自动触发灰底。组件见[技能 SP](/arknights/sp)。

<TokenTable prefix="color.sp" />

```html demo
<div class="ak-flex ak-gap-2 ak-wrap ak-items-center"><span class="ak-sp">自动回复</span><span class="ak-sp ak-sp--attack">攻击回复</span><span class="ak-sp ak-sp--hit">受击回复</span><span class="ak-sp ak-sp--passive">被动</span><span class="ak-sp-trigger">手动触发</span><span class="ak-sp-trigger ak-sp-trigger--auto">自动触发</span><span class="ak-sp-cost">25</span><span class="ak-sp-init">14</span></div>
```

## 语义令牌

两套主题等价（终端 / 档案是双正典），同一个令牌在两列里各自的值。组件、模板、TemplateStyles 只用这一层。

### 背景 / 表面

<TokenTable prefix="theme.background" themed />

### 文字

<TokenTable prefix="theme.foreground" themed />

### 强调色

<TokenTable prefix="theme.accent" themed />

### 链接

<TokenTable prefix="theme.link" themed />

### 边框 / 焦点 / 选区

<TokenTable prefix="theme.border" themed />

### 状态

<TokenTable prefix="theme.status" themed />

### 游戏内富文本

来源 `gamedata_const.richTextStyles`：技能 / 天赋 / 模组描述里的 `<@ba.vup>…</>` 等标签，Lua / 模板转成 `<span class="ak-rt-*">`（也认别名 `.ba-vup` 这类）。暗色取游戏原色，亮色逐个加深到 AA 对比度。渲染与术语提示见[富文本 Rich text](/arknights/rich-text)。

<TokenTable prefix="theme.rich-text" themed />

```html demo
<table class="wikitable ak-compact" style="width:100%">
<tr><th>标签</th><th>类名</th><th>游戏内色</th><th>示例</th></tr>
<tr><td>&lt;@ba.vup&gt;</td><td>.ak-rt-vup</td><td>#0098DC</td><td>攻击力<span class="ak-rt-vup">+50%</span></td></tr>
<tr><td>&lt;@ba.vdown&gt;</td><td>.ak-rt-vdown</td><td>#FF6237</td><td>防御力<span class="ak-rt-vdown">-30%</span></td></tr>
<tr><td>&lt;@ba.rem&gt;</td><td>.ak-rt-rem</td><td>#F49800</td><td>造成<span class="ak-rt-rem">法术</span>伤害</td></tr>
<tr><td>&lt;@ba.kw&gt;</td><td>.ak-rt-kw</td><td>#00B0FF</td><td>普通攻击连续造成<span class="ak-rt-kw">两次</span>伤害</td></tr>
<tr><td>&lt;@ba.talpu&gt;</td><td>.ak-rt-talpu</td><td>#0098DC</td><td>攻击力+6%<span class="ak-rt-talpu">（+1%）</span></td></tr>
<tr><td>&lt;$ba.stun&gt;</td><td>.ak-rt-term</td><td>—</td><td>令目标<span class="ak-rt-term" data-ak-tip="晕眩：无法移动、攻击、使用技能">晕眩</span>1.5秒</td></tr>
<tr><td>&lt;@tu.imp&gt;</td><td>.ak-rt-imp</td><td>#FF0000</td><td><span class="ak-rt-imp">注意：</span>本关卡无法撤退</td></tr>
<tr><td>&lt;@ba.enemy&gt;</td><td>.ak-rt-enemy</td><td>#D83C3C</td><td><span class="ak-rt-enemy">敌方</span>单位</td></tr>
<tr><td>&lt;@ba.gild&gt;</td><td>.ak-rt-gild</td><td>#2FAC78</td><td><span class="ak-rt-gild">镀层</span></td></tr>
<tr><td>mission.levelname</td><td>.ak-rt-level</td><td>#FFDE00</td><td>通关<span class="ak-rt-level">1-7</span></td></tr>
</table>
```

### 稀有度文字色

<TokenTable prefix="theme.rarity-text" themed />

### 装饰

<TokenTable prefix="theme.decoration" themed />

## 主题机制

两套主题等价，按 `<html>` 上的类切换——与 Vector 2022 / Minerva 的 `mw.user.clientPrefs` 同一机制（未登录也可用），核心与扩展对暗色的适配（Codex 令牌）因此可以复用：

```
html.skin-theme-clientpref-os      跟随系统（默认；@media prefers-color-scheme）
html.skin-theme-clientpref-day     档案模式（亮）
html.skin-theme-clientpref-night   终端模式（暗）
```

非 MW 环境（预览、Storybook、本站示例）用 `data-theme="light | dark"`。切换：`mw.user.clientPrefs.set('skin-theme', 'night')`；页眉里的外观开关就是做这件事（见[皮肤骨架 · 页眉](/chrome/header#外观开关)）。

## 页眉 / 头图 / 画布的主题接口

皮肤的「框」在两套主题下都是黑的；活动主题（Gadget / Common.css）只覆盖这一组变量，不碰选择器。怎么用、示例主题见[皮肤骨架 · 头图与主题接口](/chrome/theming)。

<TokenTable prefix="chrome" />

## Codex / MediaWiki 桥接

MediaWiki 核心与扩展（Codex 组件、mw-message-box、OOUI 的一部分）读这些变量；映射到 AKDS 语义令牌后，皮肤之外的 UI 自动换肤。

<TokenTable prefix="codex" />
