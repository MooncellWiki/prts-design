# 色彩

令牌分三层：**原始色板** `--ak-{hue}-{step}`（每个颜色标明出处）→ **语义令牌** `--ak-{role}`（随主题变化，组件只用这一层）→ **Codex 桥接**（MediaWiki 核心 / 扩展 UI 自动跟随）。

```
Primitive  --ak-gray-800 / --ak-cyan-500 / --ak-rarity-6 …          有出处的原始色
Semantic   --ak-bg-surface / --ak-fg-muted / --ak-accent / --ak-link …  随主题变化
Bridge     --background-color-base / --color-progressive …           Codex / MW 令牌映射
```

命名一律 `--ak-{group}-{name}`。源文件是 `packages/tokens/src/` 下的 JSON5（W3C DTCG 格式）；`pnpm tokens`（`packages/tokens/build.ts`，Style Dictionary）生成 `packages/css/src/tokens.css`（CSS 自定义属性；同一份复制到 `packages/tokens/tokens.css`，随 `@mooncellwiki/prts-design-tokens` 发布）、`packages/css/src/bridge-codex.css`（Codex 桥接，见下）与 `packages/tokens/tokens.json`（机器可读，下面的表都读它）——这些都是生成物，改令牌改 JSON5，CI 会检查生成物是否最新。

点色块复制 `var(--…)`。

## 原始色板

组件不直接用原始色；需要时经由语义令牌引用。每个颜色都有出处，不用「看起来像」：

| 令牌 | 出处 | 用途 |
|---|---|---|
| gray-50 `#F5F5F5` | 游戏亮色面板 `left_bkg` | 亮色画布 |
| gray-500 / 600 / 700 | 游戏 `btn_done` / `max_bg` / `btn_account_center` | |
| gray-800 `#313131` | **游戏标准按钮** `btn_off` / `black_btn` | 默认按钮 |
| gray-200 / 400 / 850 / 900 | 官网 | 官网灰阶、面板 |
| gray-950 `#181818` / 1000 `#000` | 游戏深底 / 官网页面底 | |
| **cyan-500** `#18D1FF` | 官网 CSS（42 处） | 暗色主题主强调 |
| cyan-400 / 300 / 200 | 游戏 `select_round` / 官网 | 暗色链接、悬停 |
| **blue-500** `#0098DC` | 游戏 `selected_back`、`bkg_openserver`、`<ba.vup>` | 亮色主题主强调；富文本增益 |
| blue-400 / 600 | `<ba.kw>` / 游戏 `toggle_on` | 关键词 / 开关开启 |
| **yellow-500** `#FFD800` | 游戏 `go_to_shop`、`image_exp_circle`；稀有度星 `#FFDE00` | 次强调、稀有度、提示 |
| yellow-600 `#FFC90E` | `<ga.subtitle>` | 卡池副标题 |
| lime-400 / 500 / 600 | 游戏 SP cost 底 / 官网 | SP、自动回复 |
| orange-400 / 500 / 600 | 六星色 / `<ba.rem>` / 游戏任务追踪 | 六星、提醒 |
| red-400 / 500 / 600 | `<ba.vdown>` / `<ba.enemy>` / 游戏 NEW | 减益、敌方、NEW |
| red-700 / 800 / 900 | BREAKING NEWS / 确认按钮 / 专精三角 | 危险横幅、危险动作、专精 |
| green-500 `#2FAC78` | `<ba.gild>` | 镀层 / 成功 |
| purple-400 `#BF96ED` | 四星色 | |

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
<div class="ak-flex ak-gap-2 ak-wrap ak-items-center"><span class="ak-sp">自动回复</span><span class="ak-sp ak-sp--attack">攻击回复</span><span class="ak-sp ak-sp--hit">受击回复</span><span class="ak-sp ak-sp--passive-recovery">被动回复</span><span class="ak-sp ak-sp--passive">被动</span><span class="ak-sp-trigger">手动触发</span><span class="ak-sp-trigger ak-sp-trigger--auto">自动触发</span><span class="ak-sp-cost">25</span><span class="ak-sp-init">14</span></div>
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

已访问链接不换色相（不用紫），就是链接色「褪一层」：亮色 = 链接色 55% + `--ak-fg-muted` 45%，暗色 = 青 62% + 画布 38%；悬停回到完整的 `--ak-link-hover`。**写死算好的实色**：不用 `color-mix`（正文链接不该依赖较新的特性），也不能写半透明——浏览器为防历史嗅探会丢掉 `:visited` 颜色的 alpha。活动主题要改链接色，就连 `--ak-link-visited` 一起给。样张见[排版 · 链接与行内](/content/typography#链接与行内)；对比度要求见[可访问性](/foundations/accessibility#对比度)。

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

非 MW 环境（预览、Storybook、本站示例）用 `data-theme="light | dark"`。**局部主题**：亮 / 暗两块令牌同时挂在 `.ak-scope[data-theme="light | dark"]` 上（自定义属性在更近的祖先上声明就覆盖继承值），一个 widget 可以固定走终端 / 档案配色，与页面主题无关——Vue 里是 `<AkScope theme>`，见[作用域](/components/scope)；主题无关块里引用了语义令牌的 `--ak-select-arrow` 在作用域上重新声明，高对比偏好也作用于作用域亮色。切换：`mw.user.clientPrefs.set('skin-theme', 'night')`；页眉里的外观开关就是做这件事（见[皮肤骨架 · 页眉](/chrome/header#外观开关)）。

## 页眉 / 头图 / 画布的主题接口

皮肤的「框」在两套主题下都是黑的；活动主题（Gadget / Common.css）只覆盖这一组变量，不碰选择器。怎么用、示例主题见[皮肤骨架 · 头图与主题接口](/chrome/theming)。

<TokenTable prefix="chrome" />

## Codex / MediaWiki 桥接

MediaWiki 核心与扩展（Codex 组件、mw-message-box、OOUI 的一部分）读这些变量；映射到 PRTS Design 语义令牌后，皮肤之外的 UI 自动换肤。它们单独生成在 `bridge-codex.css`（`skins.akds.base` 模块），只属于 Arknights 皮肤：加载到别的皮肤（Vector 2022 …）上会把宿主自己的 Codex 配色整体改掉，所以不在 `tokens.css`、也不进 npm 包的默认入口 `standalone.css`。

<TokenTable prefix="codex" />
