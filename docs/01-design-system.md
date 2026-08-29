# AKDS · 明日方舟网页设计系统 — 规范

> Arknights Web Design System · 为 prts.wiki 新皮肤（MediaWiki 1.43）设计
> 版本 0.1 · 令牌 → 组件 → 模式分层；视觉母体为明日方舟官网 + 游戏内 UI

## 0. 一句话

**黑白为体、青为用；直角、斜纹、网点；拉丁大写字作装饰层，中文思源做正文；终端 / 档案双主题。**

---

## 1. 设计理念

| 维度 | AKDS（方舟本体） |
|---|---|
| 世界观 | 泰拉 · PRTS 终端 / 罗德岛档案 |
| 母色 | 黑白灰 + 青 `#18D1FF`（官网）/ 蓝 `#0098DC`（游戏内）+ 黄 `#FFD800` |
| 形状 | 直角 0；角标三角、斜纹、半调网点。**没有切角 / 斜切 / 斜带**——整套系统里不出现 45° 的斜边 |
| 字体 | Novecento Sans Wide / Bender / Oswald + 思源黑体 |
| 光效 | **无辉光**；用明度反转（黑/白）与色条表达强调 |
| 主题 | **双正典**：终端（暗）/ 档案（亮），跟随系统 |
| 图标 | 游戏白色线稿图标（职业/精英/势力），亮色下反相 |
| 目标 | **MediaWiki 皮肤 + 模板可用的纯 CSS 组件** |

### 1.1 六条原则

1. **Monochrome first** — 大面积黑/白/灰承载信息；青只用于选中、链接、主动作、强调条、文字高亮（`<mark>` / `:target` / 表格当前行都是同一块淡青底）；黄为次强调（稀有度/提示/通知徽标），不做荧光笔；红只表示危险与"NEW/BREAKING"（未读计数不算）。
2. **Square, not rounded** — `border-radius: 0`，也不做切角 / 斜切 / 斜带；层级与状态用色条、黑白反转、角标三角表达。输入框允许 2px。色条 + 细框的盒子（pre / 消息 / 面板头 / 模组卡 / 弹层顶条 …）用 `border-image` 把色条与 1px 框直角拼接——不同宽度的 border 会被浏览器在角上斜接（miter）出一道小斜边，那也是斜边（`tokens.css` §Shape 有写法）。
3. **Latin as ornament** — 大写拉丁展示字（Novecento/Bender/Oswald）只做标题旁英文、编号、数值、水印；中文永远用思源黑体，行高 1.7。
4. **Two canonical themes** — 游戏本身是双色世界（主界面/作战为黑，档案/商店为白灰）。两套主题等价，用 MW 1.43 `skin-theme-clientpref-*` 切换。
5. **Wiki-native** — 先把 wikitext 产物（标题、表格、TOC、引用、图库、TabberNeue、Cargo）做好，再谈组件；组件是纯 CSS 类，可写进模板/TemplateStyles。
6. **Traceable tokens** — 每个颜色标明出处（官网 CSS / 解包精灵采样 / gamedata），不用"看起来像"。

### 1.2 DO / DON'T

DO：标题左侧粗色条 + 短横条；色条/黑白反转/角标表示选中；数值编号用 Bender/Oswald；白色线稿图标亮色下 `filter: invert(1)`；斜纹表示危险/施工/禁用；黑白反转做主动作。
DON'T：圆角卡片、阴影堆叠、玻璃拟态；切角、平行四边形、斜带、border 斜接出来的小斜边；菱形项目符号、辉光文字；金黄 `#FFD429` 做主色；大写英文替代中文标题；正文用 Orbitron/等宽；非官方稀有度色；**青色给不可点的装饰文字**——青 = 链接 / 选中 / 焦点 / 主动作，卡片 eyebrow、标题英文副标、页眉命名空间这类 overline 小标签用 `--ak-fg-muted`（同 `.ak-overline` / `.ak-stat__label` / `.ak-attr__label`；亮色下 `#0098DC` 压白底只有 3.2:1，11px 小字也过不了 AA）。例外：活动卡 `.ak-event__type` 带「进行中」状态、Hero 黑底海报上的 eyebrow 留青。

### 1.3 prose / not-prose（正文排版的作用域）

同 Tailwind Typography 的 `prose` / `not-prose`：**wikitext 解析产物（`.mw-parser-output`）天然是「正文」**，`base.css` 的正文排版规则——标题色条与短横条、段距、列表方块符 / `ol::marker`、dl / blockquote / poem、链接色（含 `:visited` 褪色、`a.new`、外链图标）——默认作用于整篇；每条都带 `:not(:where(.ak-not-prose, .ak-not-prose *))`（特指度 0，不改原规则的权重）。模板 / 组件把 **`ak-not-prose` 标在输出的最外层**，子树内就完全不受正文排版影响：链接退回 `color: inherit`、无下划线，颜色 / 悬停由组件自己定。

为什么需要它：`a.ak-op-card` / `a.ak-stage` / 首页入口格这类「整块是链接」的组件写 `color`（0,1,0）永远打不过全局 `a:visited`（0,1,1）——预览里所有 `href="#"` 都算已访问，卡片名字会整体变成褪色的链接色；页眉 / 搜索面板 / 分页过去各自补过 `a:visited { color: inherit }`。规则：**标在最外层、不要只标在 `<a>` 上**；不-prose 区域里需要「看起来像正文链接」的地方，组件自己引用 `--ak-link` / `--ak-link-hover`（首页 `.mp-link` 就是这么做的）。不做「not-prose 里再开一层 prose」（Tailwind 也不支持），那是内容结构该拆开的信号。

---

## 2. 令牌（Design Tokens）

文件：`src/tokens.css`（CSS 自定义属性）· `tokens/tokens.json`（机器可读）。命名 `--ak-{group}-{name}`。三层：

```
Primitive  --ak-gray-800 / --ak-cyan-500 / --ak-rarity-6 …   ← 有出处的原始色
Semantic   --ak-bg-surface / --ak-fg-muted / --ak-accent / --ak-link …   ← 随主题变化
Bridge     --background-color-base / --color-progressive …   ← Codex/MW 令牌映射
```

### 2.1 中性色（Primitive · Neutrals）

| 令牌 | 值 | 出处 |
|---|---|---|
| gray-0 / 50 / 100 | `#FFFFFF` `#F5F5F5` `#EBEBEB` | 游戏亮色面板 `left_bkg` `#F5F5F5` |
| gray-200 / 300 / 400 | `#D2D2D2` `#B1B1B1` `#8D8D8D` | 官网 |
| gray-500 / 600 / 700 | `#626262` `#535353` `#3B3B3B` | 游戏 `btn_done` `max_bg` `btn_account_center` |
| gray-800 | `#313131` | **游戏标准按钮** `btn_off/black_btn` |
| gray-850 / 900 | `#272727` `#1D1F20` | 官网面板 |
| gray-950 / 1000 | `#181818` `#000000` | 游戏深底 / 官网页面底 |

### 2.2 品牌色（Primitive · Brand）

| 令牌 | 值 | 出处 | 用途 |
|---|---|---|---|
| **cyan-500** | `#18D1FF` | 官网 CSS（42 处） | 暗色主题主强调 |
| cyan-400 / 300 / 200 | `#22BBFF` `#5DDCFF` `#7EE5FF` | 游戏 `select_round` / 官网 | 暗色链接、悬停 |
| **blue-500** | `#0098DC` | 游戏 `selected_back`、`bkg_openserver`、`<ba.vup>` | 亮色主题主强调；富文本增益 |
| blue-400 / 600 | `#00B0FF` `#0075A9` | `<ba.kw>` / 游戏 `toggle_on` | 关键词 / 开关开启 |
| **yellow-500** | `#FFD800` | 游戏 `go_to_shop`、`image_exp_circle`；稀有度星 `#FFDE00` | 次强调、稀有度、提示 |
| yellow-600 | `#FFC90E` | `<ga.subtitle>` | 卡池副标题 |
| lime-400 / 500 / 600 | `#CAEC46` `#C8EB21` `#8FC31F` | 游戏 SP cost 底 / 官网 | SP、自动回复 |
| orange-400 / 500 / 600 | `#FF9433` `#F49800` `#E5622B` | 六星色 / `<ba.rem>` / 游戏任务追踪 | 六星、提醒 |
| red-400 / 500 / 600 | `#FF6237` `#D83C3C` `#C82A36` | `<ba.vdown>` / `<ba.enemy>` / 游戏 NEW | 减益、敌方、NEW |
| red-700 / 800 / 900 | `#A40000` `#711111` `#860101` | BREAKING NEWS / 确认按钮 / 专精三角 | 危险横幅、危险动作、专精 |
| green-500 | `#2FAC78` | `<ba.gild>` | 镀层/成功 |
| purple-400 | `#BF96ED` | 四星色 | |

### 2.3 稀有度（官方色阶）

来源 `gamedata/excel/sandbox_table.json → charRarityColorList`：

| ★ | 填充 `--ak-rarity-N` | 文字（亮）`--ak-rarity-N-text` |
|---|---|---|
| 1 | `#BABABA` | `#6F6F6F` |
| 2 | `#D3DC35` | `#7F8A00` |
| 3 | `#82C5F5` | `#1D78B8` |
| 4 | `#BF96ED` | `#7D4FC2` |
| 5 | `#EFD691` | `#A87A00` |
| 6 | `#FF9433` | `#D45F00` |

用法：容器加 `data-rarity="6"` 后，子元素可用 `var(--ak-r)` / `var(--ak-r-text)`；便捷类 `.ak-r-text .ak-r-bg .ak-r-border .ak-r-bar .ak-r-chip`。

### 2.4 游戏内富文本（`gamedata_const.richTextStyles`）

| 标签 | 类 | 暗 | 亮（AA 校正） |
|---|---|---|---|
| `<@ba.vup>` 增益 | `.ak-rt-vup` | `#0098DC` | `#007BB5` |
| `<@ba.vdown>` 减益 | `.ak-rt-vdown` | `#FF6237` | `#D0421C` |
| `<@ba.rem>` 提醒 | `.ak-rt-rem` | `#F49800` | `#B86F00` |
| `<@ba.kw>` 关键词 | `.ak-rt-kw` | `#00B0FF` | `#0077B3` |
| `<@ba.talpu>` 潜能加成 | `.ak-rt-talpu` | 同 vup | 同 vup |
| `<$ba.xxx>` 术语 | `.ak-rt-term` | 虚线下划线 + tooltip | |
| `<@tu.imp>` | `.ak-rt-imp` | `#FF3B3B` | `#D40000` |
| `<@ba.enemy>` | `.ak-rt-enemy` | `#D83C3C` | `#C22F2F` |
| `<@ba.gild>` | `.ak-rt-gild` | `#2FAC78` | `#1F8F5F` |
| `mission.levelname` | `.ak-rt-level` | `#FFDE00` | `#9A7B00` |

Lua/模板把 `<@ba.vup>…</>` 转为 `<span class="ak-rt-vup">…</span>` 即可（也提供别名 `.ba-vup`）。

### 2.5 技能 SP 类型 / 触发

`--ak-sp-auto #8FC31F`（自动回复）· `--ak-sp-attack #FF8A00`（攻击回复）· `--ak-sp-hit #FFD800`（受击回复）· `--ak-sp-passive #8D8D8D`。触发类型用黑白反转标签：手动触发（黑底白字）/ 自动触发（灰底）。

### 2.6 语义令牌（随主题）

| 令牌 | 亮 · 档案模式 | 暗 · 终端模式 |
|---|---|---|
| `--ak-bg-canvas` | `#F5F5F5` | `#0F0F10` |
| `--ak-bg-surface / -2 / -3` | `#FFF` `#F5F5F5` `#EBEBEB` | `#1A1B1C` `#232425` `#2D2E30` |
| `--ak-bg-inverse` | `#1D1F20` | `#FFFFFF` |
| `--ak-fg / -secondary / -muted / -subtle` | `#1D1F20` `#454647` `#626262` `#8D8D8D` | `#F0F0F0` `#C9C9C9` `#8D8D8D` `#6F7071` |
| `--ak-accent` / `-fg` | `#0098DC` / `#FFF` | `#18D1FF` / `#000` |
| `--ak-accent-2` | `#FFD800` | `#FFD800` |
| `--ak-link / -visited / -new` | `#0072A8` `#2C6B88`⁺ `#C82A36` | `#5DDCFF` `#3F8EA4`⁺ `#FF6B6B` |
| `--ak-border / -strong` | `#D9DBDC` `#B1B1B1` | `#2F3133` `#4A4C4F` |
| `--ak-info / success / warning / danger` | `#0072A8` `#1F8F5F` `#B86F00` `#C8102E` | `#5DDCFF` `#4FD18F` `#FFB340` `#FF5C5C` |
| `--ak-glyph-filter` | `invert(1)` | `none` |

⁺ 已访问链接不换色相（不用紫）：就是链接色「褪一层」——亮色 = 链接色 55% + `--ak-fg-muted` 45%（变灰变钝，白底 5.9:1），暗色 = 青 62% + 画布 38%（= 视觉上 62% 透明的青，黑底 5:1）；悬停回到完整的 `--ak-link-hover`（`a:visited:hover`）。**写死算好的实色**，不用 `color-mix`（链接色是常量，正文链接不该依赖 2023 年才普及的特性；活动主题要改链接色就连 `--ak-link-visited` 一起给）。**不能**直接写半透明：浏览器为防历史嗅探会丢掉 `:visited` 颜色的 alpha 只保留 RGB，结果与未访问一模一样，所以「透明度」必须混成实色。

对比度：正文 ≥ 7:1，次要文字 ≥ 4.5:1，链接 ≥ 4.5:1（亮色下用 `#0072A8` 而非 `#0098DC`），大号 UI 文字/按钮 ≥ 3:1。

### 2.7 主题机制

```
html.skin-theme-clientpref-os     跟随系统（默认；@media prefers-color-scheme）
html.skin-theme-clientpref-day    档案模式（亮）
html.skin-theme-clientpref-night  终端模式（暗）
```
非 MW 环境用 `data-theme="light|dark"`。与 Vector 2022 / Minerva 的 `mw.user.clientPrefs` 完全同一机制，因此核心/扩展对暗色的适配（Codex 令牌）可复用。

### 2.8 字体

```
--ak-font-body     "Source Han Sans SC","Noto Sans SC"*,"PingFang SC","HarmonyOS Sans SC","Microsoft YaHei",system-ui
--ak-font-display  "Novecento Sans Wide"*,"Bender"*,"Oswald"*,"Michroma","Arial Narrow",system-ui   （大写拉丁展示字）
--ak-font-label    "Bender"*,"Chakra Petch"*,"Rajdhani","Saira","Oswald",system-ui                （HUD 标签 / 数值）
--ak-font-condensed "Oswald"*,"Roboto Condensed","Arial Narrow"
--ak-font-mono     "JetBrains Mono"*,"SF Mono",Menlo,Consolas,monospace
```
带 \* 的都由 `src/fonts.css` 用 `@font-face` 自托管（`src/fonts/`，`scripts/fetch-fonts.py` 生成），因此不论访客装没装字体，看到的都是同一套——这也就是上线效果。链的后段（装机备选 → 系统字）只在字体模块被关掉时起作用。

| 角色 | 自托管 | 来源 / 说明 |
|---|---|---|
| 展示字 | **Novecento Sans Wide** 500 / 600 / 700 / 800 | 官网静态资源原文件（web.hycdn.cn）。商用字（Synthview）；PRTS.wiki 为明日方舟官方赞助站点，按与鹰角同一组织下共用授权使用（`src/fonts/novecento-sans-wide/NOTICE.md`） |
| HUD 标签 / 数值 | **Bender** 400 / 700 | 同上（`src/fonts/bender/NOTICE.md`）。Bender 也是展示链第二位 |
| 正文 | Noto Sans SC 可变字重 100–900 | OFL；= 思源黑体的 Google 构建，沿用 Google Fonts 的 101 片 `unicode-range` 切分（共 4.4MB），一页只下载用到的几片 |
| 压缩字 | Oswald 可变字重 200–700 | OFL；官网也自托管 Oswald。同时是展示链在 Novecento / Bender 之后的接字 |
| 标签缺字接住 | Chakra Petch 400 / 500 / 600 / 700 | OFL；同为切角方形的 HUD 字，只在 Bender 缺字时逐字顶上 |
| 等宽 | JetBrains Mono 可变字重 100–800，正体 + 斜体 | OFL；语法高亮的注释用斜体 |

**Bender 的使用边界（HUD 层，不进正文尺寸的连续数字）**：Bender 是游戏 HUD 字——粗体、大字号、独立出现时才成立；14px 常规字重时笔画细、斜杠 0 读作「Ø」、和思源混排灰度不齐，而且**它的数字是比例宽度**（`1` 360 / `0` 604 单位）、子集不带 `tnum`，`font-variant-numeric: tabular-nums` 对它无效，数字列对不齐。因此：

- ✅ 用 Bender：属性面板 `.ak-attr__value`、`.ak-stat__value`、`.ak-level`、倒计时、SP 芯片、关卡码、稀有度 chip、tag、overline / eyebrow 小标签、`ol::marker`——都是**粗体（700）或 ≥ h3 的独立数值 / 编号 / 大写标签**。显式的 HUD 数字类是 `.ak-num`（粗体 Bender，只用于面板级、不进表格）
- ❌ 不用 Bender：表格数字列（`.wikitable td.num` / `.ak-table .num`）、目录编号、引用角标、diff 行号、最近更改 ±、分页、时间戳、Stat 的 delta、技能数值行、通知计数徽标（`.ak-badge`：Bender Bold 在 11px 下笔画细字形窄，18px 圆里读不清）——统一正文字体 + `tabular-nums`（Noto Sans SC 的数字默认等宽 521 单位，列天然对齐）。**表格数据数字一律不用 Bender，没有例外**：技能全等级表 / 参数矩阵 / 天赋条件表 / 键值表的数字列都是正文字体；`.ak-num` `.ak-code-id` `.ak-trust` `.ak-item__count` `.ak-elite` 等带数字的 HUD 类若落进 `td` / `th` / `.ak-kv > dd`，`arknights.css` 末尾 B99 会兜底回正文字体（字重 / 字距 / 颜色照旧）

**官网发布的 Novecento / Bender 是 ASCII 子集**（各 101 字形：A–Z a–z 0–9 及 ASCII 标点），`·` `»` `—` `–` `…` `×` `°` 等非 ASCII 字符不在其中，浏览器会按链逐字回退——展示字落到 Oswald、标签落到 Chakra Petch，两者风格相近，视觉上是间隔号 / 破折号级别的差异；若日后拿到全字符集文件，替换 `src/fonts/` 里同名 woff2 即可。拉丁 OFL 字体只带 latin + latin-ext 子集（拼音声调在 latin-ext）。

字号：display-xl 56 / display 40 / h1 32 / h2 24 / h3 20 / h4 17 / body 16 / sm 14 / xs 12 / overline 11。行高：正文 1.7、标题 1.25、展示 1.05。字距：大写 `.08em`、overline `.14em`、展示 `-.02em`。

### 2.9 间距 / 形状 / 动效 / 层级 / 断点

- 间距 4px 基准：`--ak-space-1..24`（4 8 12 16 20 24 32 40 48 64 80 96）
- 形状：`--ak-radius 0`、`--ak-radius-sm 2px`、`--ak-bar-w 4px / -lg 8px`；没有切角 / 斜切令牌（已移除）。色条 + 细框：`border: 1px solid var(--ak-border); border-left-width: 4px; border-image: linear-gradient(to right, <色条色> 4px, var(--ak-border) 4px) 1 1 1 4`（slice 与各边 border-width 一致；顶部色条同理）
- 动效：`--ak-dur-fast 150ms / normal 250ms / slow 400ms`；`--ak-ease cubic-bezier(.2,.8,.2,1)`；`prefers-reduced-motion` 全局关闭
- 加载指示：`.ak-spinner` 是**菱形涟漪**——游戏内 loading：中央常驻一枚空心菱形（= 中坚术师分支图标那枚），另一枚环从它身上冒出来、边扩边淡到没，下一枚再来（1.2s 一枚；游戏里环出生时还带随机剪切，这个尺寸下施展不开、没做）；按钮的 `.is-loading` 只有 36px 高、涟漪放不开，退回 14px 圆弧转圈
- z-index：dropdown 100 · sticky 200 · header 1000 · overlay 1500 · modal 2000 · toast 3000 · tooltip 4000
- 断点（与 Codex 一致）：640 / 1120 / 1680，另有 1400 作为目录导轨断点
- **窄屏导航（<1400，参考 VitePress）**：页眉长出第二行 `.ak-local-nav`「二级吸顶栏」——左「菜单」拉出侧栏抽屉（<1120）、右「本页目录」拉下目录浮层；向下滚动时页眉主行（品牌 / 搜索 / 工具）上移收起，只留这条 48px 的二级栏贴顶，向上滚或回到顶部再展开；「回到顶部」放在目录浮层首项，`.ak-fab` 只在 ≥1400 显示；目录浮层宽高锁死（360px / ≤639 拉满，限高 `100dvh` 到视口底、超出内滚），抽屉与浮层开着时锁住页面滚动（`html.ak-scroll-lock`）。**不用角落浮动按钮开目录**（方位与面板割裂、和回到顶部抢屏幕角落）
- 布局：`--ak-header-h 56` · `--ak-local-nav-h 48` · `--ak-sidebar-w 248` · `--ak-toc-w 240` · `--ak-content-max 1240`（≥1680 侧栏 / 目录 268，写在 `:root`）
- **页眉 = 三列的列头**：主行网格 `var(--ak-sidebar-w) minmax(0,1fr) auto` 与 `.ak-layout` 同列同 gutter——品牌盖着侧栏、搜索从正文列左缘起（≤560px，与标题左缘同线）、工具盖着目录列；1680 容器一律 `border-box`。**页眉不放站点级主导航**（与侧栏「通用」组重复），导航只由侧栏承担；<1120 外观 / 通知 / 用户收进 ≡ 拉下的 320px 卡片
- **页眉是黑色「终端」顶栏，两套主题下都不变**：官网导航栏（#000 底 · 青色当前项 · 白线稿图标）、游戏主界面顶栏（深底 · 半调网点 · 青色选中块）、干员档案页顶部那道黑边——「黑框白纸 / 黑框黑纸」是方舟本体的框架语言。配色不读明暗主题，只读 §2.10 的 `--ak-chrome-*`（`skin.css` 在 `.ak-header` 内把语义令牌重映射过去，页眉里的按钮 / 搜索 / 头像 / 菜单自动跟随）。构件：`rgba(8,9,10,.9)` 底 + 毛玻璃 + 1px 亮线；右侧半调网点场向左渐隐；标语与悬停用活动主色；**页眉与头图是一整块**——头图从页面顶端铺起，页眉是压在它上面的一块均匀黑玻璃（活动主题只调 `--ak-chrome-bg` 的 alpha 决定画透多少），可读性由玻璃保证、不赌画面；不做「顶栏一张照片从左缘渐入」的底图（压不住白色图标、又像贴上去的），`--ak-chrome-image` 只放画在玻璃之上的深色角饰；搜索触发器 = 左端深色图标框（游戏 HUD `announce_title_on` 的图标位）+ 矩形浅条，打开时图标框反成主色实底（曾试过右端斜切，Tab 焦点描边会被 clip-path 裁断，作罢）；外观开关选中项用主色实底（游戏 `selected_back` / `toggle_on`），亮暗主题下不反色；页眉内链接不分已访问色
- **搜索（参考 Citizen Command Palette / starcitizen.tools）**：页眉里那条「输入框」其实是触发器（无 JS 时是真表单），点击或按 `/`、`⌘K` 打开居中悬浮的搜索面板：直角、顶部 3px 青条、56px 输入行、`--ak-bg-overlay` 遮罩 + 2px 模糊；空态给最近访问 + 快捷入口，有字给分组结果（干员带头像 / 职业 / 稀有度）+ 末尾固定「全文搜索」行；`/` 列命令、`>` `#` `@` `~` 进入模式（主色实底的矩形 chip）。高亮行沿用「左 2px 青条 + 淡青底」；键位提示用 `.ak-kbd`。**不做**页眉内下拉建议（Vector 式）：内容页面宽、页眉是玻璃底，下拉在毛玻璃上叠层次会脏；居中面板一层遮罩把注意力收拢，也天然适配手机（8px 内边距全宽卡片）

### 2.10 页眉 / 头图 / 画布的主题接口（活动主题只改这些）

prts.wiki 大活期间会换头图、顶栏角饰、站标、侧栏配色（现网 `ext.gadget.seventhStyle` 改的就是这些）。新皮肤把这些位置抽成 `tokens.css §2d` 的一组变量，Gadget / `MediaWiki:Common.css` 在 `:root`（或 `html.skin-theme-clientpref-*` 分昼夜）上覆盖即可，不碰任何选择器；示例见 `preview/demo-theme.css`（罗德岛主界面昼 / 夜背景做头图、警示黄做活动主色、页眉玻璃调到 `.8`）。

**页眉与头图的关系**：头图 `.ak-keyart` 从页面顶端铺起（盒子上探一个页眉高、`padding-top` 把内容压回页眉之下；<1400 连二级栏一起探），页眉是压在它上面的一块**均匀**黑玻璃——横向无渐隐、纵向无渐变，可读性由玻璃的 alpha 保证，与底下是什么画无关。照片一律走 `--ak-keyart-image`；`--ak-chrome-image` 画在玻璃之上、不会被压暗，只放深色低对比的角饰 / 底纹。

| 变量 | 默认 | 作用 |
|---|---|---|
| `--ak-theme-accent` / `-fg` | `#18D1FF` / `#000` | 活动主色：页眉标语与悬停、搜索图标框、开关选中项、侧栏 / 目录分组条、页脚斜纹、窄屏工具卡片顶条。正文链接 / 选中仍是 `--ak-accent`，想一起换就连它也覆盖 |
| `--ak-chrome-bg` / `-bg-solid` | `rgba(8,9,10,.9)` / `#0E0F10` | 页眉玻璃（半透明 + 毛玻璃，头图 / 滚过来的正文在下面均匀透出；想让头图多透一点调 alpha 到 `.78–.85`，别低于 `.72`——白色画面之下 `#F2F2F2` 仍 ≥7:1）/ 不透明处（窄屏工具卡片） |
| `--ak-chrome-fg` / `-fg-2` / `-fg-muted` | `#F2F2F2` / `.74` / `.5` 白 | 页眉前景三级 |
| `--ak-chrome-line` / `-line-strong` / `-hover` / `-field` | 白 `.14` / `.32` / `.08` / `.07` | 底线与分隔线 / 悬停底 / 搜索触发器底 |
| `--ak-chrome-image` / `-position` / `-size` / `-repeat` | `none` / `right top` / `auto 100%` / `no-repeat` | **顶栏角饰 / 底纹**：`url(left.png), url(right.png)`（现网 PRTSheadleft 的活动徽章 / Garanheadright 的波纹那种）。画在玻璃之上、不被压暗——只放深色低对比素材；照片请走 `--ak-keyart-image` |
| `--ak-chrome-texture` | `.55` | 右侧半调网点强度 0–1，有角饰时可设 0 |
| `--ak-keyart-image` / `-h` / `-position` / `-size` / `-bg` / `-fade` | `none` / `0` / `center 30%` / `cover` / `transparent` / `96px` | **头图** `.ak-keyart`：从页面顶端铺起、页眉压在它上面的通栏画；`-h` 是页眉之下可见的高度（0 = 只在页眉后面透，不占位）；`-position` / `-size` 相对整块（页眉 + `-h`）算；底部按 `-fade` 渐隐进画布；≤639 限高 40vw；`.ak-keyart__inner` 与页眉三列同宽、在页眉之下，主题可往里放活动标题 |
| `--ak-canvas-image` / `-position` / `-size` / `-repeat` / `-attachment` | `none` … | **画布底纹**：叠在 body 的 `--ak-bg-canvas` 之上（现网 body 的 bkg 位置）；侧栏 / 目录没有底色，宜低对比 |
| `--ak-logo-image` | 未设 | **站标**：设了就用 `content` 替换 `.ak-header__logo img`（Chromium / WebKit；Firefox 请改 `$wgLogos`） |

⚠ 接口变量里的 `url()` 请写**绝对地址**（`//media.prts.wiki/…`）：Chromium 把自定义属性里的相对 `url()` 按「使用处」（`skin.css`）的路径解析，Firefox / WebKit 按「声明处」解析，相对地址在两边会指向不同目录。

---

## 3. 装饰语言（Ornament primitives）

全部为可叠加的纯 CSS 类（`src/arknights.css` A 段）：

| 类 | 说明 | 出处 |
|---|---|---|
| `.ak-stripes` `--strong --warning --danger --hazard` / `.ak-stripe-bar` / `.ak-stripe-edge` | 45° 斜纹 | 游戏 `btn_done`、`image_btn_ap_confirm` |
| `.ak-halftone` `--l --full` / `.ak-blue-band` | 半调网点渐隐 | 游戏 `bkg_openserver` |
| `.ak-bg-grid` `.ak-bg-dots` `.ak-bg-diag` `.ak-scanlines` | 网格/点阵背景 | PRTS 终端 |
| `.ak-corner` `--tr --yellow --red --lg` | 角标三角（带文字的角标用矩形 `.ak-tag` 叠在角上；45° 斜带已移除） | 官网右上三角、游戏 `selected_decor` |
| `.ak-brackets` | 细线边角（仅用于图片） | |
| `.ak-en` `.ak-display` `.ak-overline` `.ak-num` `.ak-code-id` `.ak-watermark` `.ak-bilingual` | 拉丁装饰字 | 官网 |
| `.ak-glyph` `.ak-glyph-box` | 白色线稿图标反相 | |
| `.ak-inverse` | 黑白反转块 | 游戏 `btn_on/off` |
| `.ak-chevrons` | 链接尾部 `»` | 游戏 `transferarrow` |

---

## 4. 表单控件（Form controls）

wiki 里的表单来自三处，皮肤对它们的态度不同：

| 来源 | 例子 | 谁负责 |
|---|---|---|
| **裸控件**——Widget / Gadget / 模板直接吐出的 `<input>` `<select>` `<textarea>` `<button>`，身上没有任何 class | 干员页「属性计算器」（`Widget:PropertyCalc`：wikitable 里四个 `<input type="number">`）、公招 / 材料 / 掉落计算器、各种筛选栏、edittools 字符按钮 | **皮肤兜底**（`src/base.css` Forms 段，本节的规则）；模板什么样式都不用写 |
| **设计系统组件** `.ak-input .ak-select .ak-textarea .ak-check .ak-switch .ak-slider .ak-number .ak-field .ak-input-group …` | 模板 / TemplateStyles 里显式使用（预览 components.html「表单 · Forms」，裸控件落进 wikitable 的样子也在那一节） | `components.css`：与裸控件同一套尺寸 / 颜色 / 状态，多了尺寸变体、自绘勾选 / 开关、校验态与文案 |
| **核心 UI**——Codex `.cdx-*` / OOUI `.oo-ui-*` / `.mw-ui-*`（编辑页、参数设置、特殊页面、Echo） | 颜色经 `tokens.css` 令牌桥接自动跟随，**尺寸不改**（它们自己的 32px 档，成组出现、内部自洽） | 皮肤只桥接 |

裸控件的正确写法就是**什么都别写**：`<input type="number">` 落进 wikitable 就该是对的。皮肤的规则全部包在 `:where()` 里（特指度 0），所以 `.ak-input`、Codex / OOUI、模板自己的 class 都稳稳压在它上面，不必和 `input[type=…]` 较劲。

### 4.1 形状与尺寸

- **直角**：输入类控件 `--ak-radius-sm` 2px（§1.1 已允许的唯一例外），按钮 0；边框 1px `--ak-border-strong`。无阴影、无内阴影、无辉光。
- **高度三档 30 / 36 / 44**（`--sm` / 默认 / `--lg`），与 `.ak-btn` 同一刻度。裸控件默认 **36**（`.ak-input` / `.ak-btn` / 裸 `<button>` 都是 36，一行里混排齐平）；**落在表格单元格里自动收到 30**（紧凑档，字号跟表格）——wikitable 一行本身只有 ~35px，36 的控件会把这一行顶成 50，30 正好比表头行高一点，读得出「这一行是输入」又不抢戏。表格里想要 36 就显式用 `.ak-input`。
- **高度是确定的**：`box-sizing: border-box` + 上下内边距 0 + `min-height` 定高，单行文字由浏览器在盒内垂直居中，所以正文（行高 1.7）和表格（1.5）里一样高。**不要靠 padding 撑高度**——以前 content-box 下 `min-height 34 + 上下 6px + 边框 = 48px`，就是属性计算器那种比表头还高一截的输入框。
- **宽度不接管**：裸控件保留浏览器的 `size` 宽度（约 20 字符），皮肤只加 `max-width: 100%` 保证不撑破容器；一格里常常是「输入框 + 按钮」，强制满宽会把按钮挤到下一行。要满宽写 `width: 100%` 即可（已是 border-box，不必再 `calc(100% - .8em)`）；要窄写 `size="4"` 或 `style="width:5em"`。
- 内边距 `0 10px`（表格里 `0 8px`）；`textarea` `8px 10px`、最小高 72px、只允许竖向拖拽（`resize: vertical`）。
- 字：14px（`--ak-fs-sm`）正文字体、常规字重（在 `th` 里也不加粗）、行高 1.5；数字输入 `tabular-nums`。iPhone 上文本类控件在 ≤639 断点提到 16px——iOS Safari 对 <16px 的输入框聚焦时会把整页放大且不缩回。

### 4.2 颜色与状态

两套主题各自取语义令牌（§2.6），不写死色值。

| 状态 | 表现 |
|---|---|
| 默认 | 底 `--ak-bg-surface`、字 `--ak-fg`、边 `--ak-border-strong` |
| 占位符 | `--ak-fg-subtle`（Firefox 的默认 opacity 归 1）；只做提示，不承载必填信息 |
| 悬停 | **无**——输入框不做悬停态，按钮才有 |
| 焦点 | 边 `--ak-accent` + `--ak-shadow-accent`（3px 淡青环，同 `.ak-input`）；用 `:focus` 而非 `:focus-visible`——鼠标点进文本框也该亮。勾选 / 单选只在 `:focus-visible`（键盘）时亮同一套青边 + 淡青环；滑杆保留全局 `:focus-visible` 2px 描边（§6） |
| 只读 `[readonly]` | 底 `--ak-bg-inset`（下沉），边框不变，仍可选中复制。计算器「只显示不编辑」的结果格用它，**不要用 disabled 表示「只是显示」** |
| 禁用 `:disabled` | 底 `--ak-bg-surface-3`、字 `--ak-fg-disabled`（Safari 需同时写 `-webkit-text-fill-color`）、边 `--ak-border`、`cursor: not-allowed` |
| 校验失败 | 边 `--ak-danger`，聚焦时环换 `--ak-danger-bg`。触发条件是 `:user-invalid`（用户改过之后才判）或 `aria-invalid="true"`；**不用 `:invalid`**——它一进页面就把 required 空框全标红。设计系统组件另有 `.is-invalid / .is-valid` + `.ak-help--error` 文案 |
| 勾选 / 单选 | **自绘，裸控件与 `.ak-check` 同一张脸**（`appearance: none`，规则在 base.css 裸控件段；`.ak-check` 只管「控件 + 文字」排布）：18px、2px `--ak-border-strong` 边；勾选框直角，选中 = 主色实底 + 对比色勾（`:indeterminate` = 一横）；**单选是圆**（圆是单选的通用语义，也是整套系统里唯一的圆；不做菱形、不做圆角方），选中 = 主色实底 + 圆点。勾 / 点按百分比画，改 `width/height` 整体缩放（表头里的开关 16px）。禁用 = surface-3 / 选中灰。`accent-color` 仍写着兜底：不认 `appearance: none` 的老 WebView 退回主色原生控件。`vertical-align: middle` 与行内文字中线对齐 |
| 滑杆 `type=range` | 保留原生，只上 `accent-color`；要方形滑块用 `.ak-slider` |
| 数字 `type=number` | `tabular-nums`（改值不跳动）；保留原生 ▲▼ 步进器（Chrome 悬停 / 聚焦时才现身，Firefox 常显）；要一直可见的 − / + 用 `.ak-number` |
| 下拉 `select` | 自绘箭头：裸 `<select>` 与 `.ak-select` 同一枚 ▾（`--ak-select-arrow`，两条 45° 渐变拼成、颜色随 `--ak-fg-muted`；与下拉按钮的 ▾ 成套），`appearance: none` + 右内边距 30px（表格里 26px）；原生箭头各浏览器长得不一样、与自绘的不成套。`select[multiple]` 不画箭头、上下 4px 内边距 |
| 表格里 | 30px；文本类输入的**对齐跟随单元格**（`text-align: inherit`）：`text-align:center` 的计算器里，输入的数字和下一行的结果一样居中；`td.num` 右对齐列里的输入也右对齐；`select` 不跟。裸 `<button>` 在表格里同样收到 30 |
| 日期 / 时间 / 电话等 | 一律按文本框处理（选择器用排除法：不写 `type` 的 `<input>`、未知 type 都算文本框），不留浏览器 2px inset 默认外观 |

### 4.3 给 Widget / 模板作者

- 直接写 `<input>`，不要给它写内联样式，高度 / 对齐 / 颜色 / 主题都会自己对；宽度要满就 `width:100%`。
- 列头当标签：`<th><label for="elite">精英等级</label></th>` + `<td><input id="elite">`（PropertyCalc 已经这么写），读屏器和点击标签聚焦都能用；不方便放 label 的加 `aria-label`。
- 结果格用 `readonly` 输入或直接文本，不用 `disabled`。
- 一行里要拼「前缀 / 输入 / 按钮」用 `.ak-input-group`；带标签 + 帮助 + 错误文案的字段用 `.ak-field`；步进用 `.ak-number`。
- 手机（≤639）上 wikitable 横向滚动，按 `size` 定宽的控件不会缩；写了 `width:100%` 的会随列宽缩（属性计算器写的 `calc(100% - .8em)` 就是这么活下来的，现在直接 `100%` 更好）。

---

## 5. 图标

- **游戏原图**（torappu 解包）：职业 8 + 分支 ~70 + 精英化 4 + 潜能 6 + 专精 4 + 稀有度星 + 势力 logo 43 + 道具/技能/头像。全部白色线稿或彩色精灵；白色线稿类加 `.ak-glyph` 或所在组件内已内置 `filter: var(--ak-glyph-filter)`。
- **UI 图标**：单色 SVG，24 网格、2px 描边、`currentColor`；尺寸 14/18/24/32/48。预览页 `<symbol id="i-*">`。
- 图标资源目录：`preview/assets/{profession,subprofession,elite,potential,specialized,rarity,camp,item,skill,avatar}`；生产环境放到 `File:` 命名空间或皮肤 `resources/images`，路径经 `--ak-asset-base` 配置。

---

## 6. 可访问性

- 所有交互元素 `:focus-visible` 2px 青色描边（`--ak-focus`）；文本类输入框改用 `:focus` 的青边 + 3px 淡青环（§4.2），鼠标点进去也亮。
- 颜色不作为唯一信息载体：稀有度同时有星数；SP 类型同时有文字标签；增减益同时有 +/- 与 ▲▼。
- 青色只给可交互 / 选中的东西：装饰性小标签（eyebrow / overline / 命名空间）用 `--ak-fg-muted`（暗 5.2:1 / 亮 6.1:1），不给静态文字假的可点暗示，也避开 `--ak-accent` 亮色下 3.2:1 的小字对比（§1.2）。
- 触控目标 ≥ 36px（`.ak-btn` / `.ak-input` / 裸控件默认 36，`--lg` 44）；表格里的紧凑档 30 是唯一例外——宽度远大于高度、外面还包着单元格内边距，且不承担主动作（§4.1）。
- `prefers-reduced-motion` / `prefers-contrast: more` / `forced-colors` 均有处理（`tokens.css` / `base.css`）。
- 折叠/标签页/对话框使用原生 `details` / `dialog` / `aria-selected`。

---

## 7. 文件与用法

```
src/tokens.css       令牌 + 主题 + Codex 桥接（必须最先加载）
src/base.css         MW 内容样式（.mw-parser-output、wikitable、toc、tabber、表单、diff…）
src/components.css   通用组件（.ak-btn/.ak-tag/.ak-card/.ak-panel/.ak-tabs/.ak-message/…）
src/arknights.css    方舟装饰 + 游戏数据组件（.ak-rarity/.ak-op-card/.ak-skill/…）
src/skin.css         皮肤骨架（页眉/侧栏/页面动作簇/TOC/页脚/搜索面板/响应式）
src/charinfo.css     干员页舞台的皮肤化样式表草案（对现网 Widget:CharinfoV2 同一套 DOM 换皮；预览页目前不接入——舞台先原样跑现网 CSS / JS，见 03 §3.6）
src/search-palette.js 悬浮搜索面板核心（皮肤与预览共用；数据源由调用方注入）
src/sidebar-tree.js  侧栏多层导航
src/utilities.css    工具类
src/index.css        本地预览汇总入口
preview/vendor/      第三方原样：swiper/（首页轮播）· charinfo/（现网 Widget:CharinfoV2 的 CSS / JS / 字体 / HUD 图标快照，scripts/fetch-charinfo.py 钉版本抓取，见其 NOTICE.md）· jquery/（3.7.1，同 MW 1.43，charinfo 脚本要）
preview/_src/        预览站源：skeleton.html（皮肤骨架，只写一份）+ pages/{home,index,chrome,mediawiki,components,arknights,operator}.html（各页 front matter + 正文）
preview/*.html       生成物（scripts/build-preview.py）：home 首页设计稿（信息结构取自现网首页；区块样式在页面自己的 <style> = TemplateStyles，「0. 页面级」那段是静态骨架的补丁——皮肤在首页的收敛行为已由 Skin:Arknights 内置，见 03 §3.4）· index 基础（理念 / 色彩 / 字体 / 装饰）· chrome 皮肤骨架 · mediawiki 内容样式 · components 通用组件 · arknights 方舟组件 · operator 干员页整页样例（陈；现网「陈」页面 19 节一节不少，顶部直接复用现网 {{CharinfoV2}} 组件，见 03 §3.6）
```
