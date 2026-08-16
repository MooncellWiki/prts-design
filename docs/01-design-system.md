# AKDS · 明日方舟网页设计系统 — 规范

> Arknights Web Design System · 为 prts.wiki 新皮肤（MediaWiki 1.43）设计
> 版本 0.1 · 参考：ReEnd-Components（终末地设计系统）的分层与文档结构；视觉母体为明日方舟官网 + 游戏内 UI

## 0. 一句话

**黑白为体、青为用；直角、斜切、斜纹、网点；拉丁大写字作装饰层，中文思源做正文；终端 / 档案双主题。**

---

## 1. 设计理念（对照 ReEnd）

| | ReEnd（终末地） | AKDS（方舟本体） |
|---|---|---|
| 世界观 | 塔卫二 · 工业科幻 · 战术 HUD | 泰拉 · PRTS 终端 / 罗德岛档案 |
| 母色 | 黑 + 金黄 `#FFD429` + 荧光绿 `#CBFF40` | 黑白灰 + 青 `#18D1FF`（官网）/ 蓝 `#0098DC`（游戏内）+ 黄 `#FFD800` |
| 形状 | 切角 12px、菱形 ◆、边角括号 | 直角 0、切角 8px、平行四边形斜切、角标三角、斜纹、半调网点 |
| 字体 | Orbitron / Bender / JetBrains Mono | Novecento Sans Wide / Bender / Oswald + 思源黑体 |
| 光效 | 辉光、扫描线、故障字 | **无辉光**；用明度反转（黑/白）与色条表达强调 |
| 主题 | 暗色优先，亮色为辅 | **双正典**：终端（暗）/ 档案（亮），跟随系统 |
| 图标 | 线稿 1.5px 描边 | 游戏白色线稿图标（职业/精英/势力），亮色下反相 |
| 目标 | React 组件库 | **MediaWiki 皮肤 + 模板可用的纯 CSS 组件** |

### 1.1 六条原则

1. **Monochrome first** — 大面积黑/白/灰承载信息；青只用于选中、链接、主动作、强调条；黄为次强调（稀有度/提示）；红只表示危险与"NEW/BREAKING"。
2. **Cut, not rounded** — `border-radius: 0`；层级与状态用切角（chamfer）、斜切（skew）、角标三角、色条表达。输入框允许 2px。
3. **Latin as ornament** — 大写拉丁展示字（Novecento/Bender/Oswald）只做标题旁英文、编号、数值、水印；中文永远用思源黑体，行高 1.7。
4. **Two canonical themes** — 游戏本身是双色世界（主界面/作战为黑，档案/商店为白灰）。两套主题等价，用 MW 1.43 `skin-theme-clientpref-*` 切换。
5. **Wiki-native** — 先把 wikitext 产物（标题、表格、TOC、引用、图库、TabberNeue、Cargo）做好，再谈组件；组件是纯 CSS 类，可写进模板/TemplateStyles。
6. **Traceable tokens** — 每个颜色标明出处（官网 CSS / 解包精灵采样 / gamedata），不用"看起来像"。

### 1.2 DO / DON'T

DO：标题左侧粗色条 + 短横条；切角/斜切/角标表示选中；数值编号用 Bender/Oswald；白色线稿图标亮色下 `filter: invert(1)`；斜纹表示危险/施工/禁用；黑白反转做主动作。
DON'T：圆角卡片、阴影堆叠、玻璃拟态；菱形项目符号、辉光文字（那是终末地）；金黄 `#FFD429` 做主色；大写英文替代中文标题；正文用 Orbitron/等宽；非官方稀有度色。

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
| `--ak-link / -visited / -new` | `#0072A8` `#6A4AA8` `#C82A36` | `#5DDCFF` `#C3A6FF` `#FF6B6B` |
| `--ak-border / -strong` | `#D9DBDC` `#B1B1B1` | `#2F3133` `#4A4C4F` |
| `--ak-info / success / warning / danger` | `#0072A8` `#1F8F5F` `#B86F00` `#C8102E` | `#5DDCFF` `#4FD18F` `#FFB340` `#FF5C5C` |
| `--ak-glyph-filter` | `invert(1)` | `none` |

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
--ak-font-body     "Source Han Sans SC","Noto Sans SC","PingFang SC","HarmonyOS Sans SC","Microsoft YaHei",system-ui
--ak-font-display  "Novecento Sans Wide","Bender","Oswald","Michroma","Arial Narrow",system-ui   （大写拉丁展示字）
--ak-font-label    "Bender","Rajdhani","Chakra Petch","Saira","Oswald",system-ui                （HUD 标签 / 数值）
--ak-font-condensed "Oswald","Roboto Condensed","Arial Narrow"
--ak-font-mono     "JetBrains Mono","SF Mono",Menlo,Consolas,monospace
```
官网实际加载 Novecento Sans Wide（商用授权）/ Bender / Oswald（OFL）/ 思源黑体（OFL）。建议：ResourceLoader 自托管 **Oswald + 思源黑体子集**（OFL 可分发）；Novecento / Bender 视授权决定，回退顺序已保证降级可读。

字号：display-xl 56 / display 40 / h1 32 / h2 24 / h3 20 / h4 17 / body 16 / sm 14 / xs 12 / overline 11。行高：正文 1.7、标题 1.25、展示 1.05。字距：大写 `.08em`、overline `.14em`、展示 `-.02em`。

### 2.9 间距 / 形状 / 动效 / 层级 / 断点

- 间距 4px 基准：`--ak-space-1..24`（4 8 12 16 20 24 32 40 48 64 80 96）
- 形状：`--ak-radius 0`、`--ak-radius-sm 2px`、`--ak-cut 8px`（切角）、`--ak-skew -14deg`、`--ak-bar-w 4px / -lg 8px`
- 动效：`--ak-dur-fast 150ms / normal 250ms / slow 400ms`；`--ak-ease cubic-bezier(.2,.8,.2,1)`；`prefers-reduced-motion` 全局关闭
- z-index：dropdown 100 · sticky 200 · header 1000 · overlay 1500 · modal 2000 · toast 3000 · tooltip 4000
- 断点（与 Codex 一致）：640 / 1120 / 1680，另有 1400 作为目录导轨断点
- **窄屏导航（<1400，参考 VitePress）**：页眉长出第二行 `.ak-local-nav`「二级吸顶栏」——左「菜单」拉出侧栏抽屉（<1120）、右「本页目录」拉下目录浮层；向下滚动时页眉主行（品牌 / 搜索 / 工具）上移收起，只留这条 48px 的二级栏贴顶，向上滚或回到顶部再展开；「回到顶部」放在目录浮层首项，`.ak-fab` 只在 ≥1400 显示。**不用角落浮动按钮开目录**（方位与面板割裂、和回到顶部抢屏幕角落）
- 布局：`--ak-header-h 56` · `--ak-local-nav-h 48` · `--ak-sidebar-w 248` · `--ak-toc-w 240` · `--ak-content-max 1240`
- **搜索（参考 Citizen Command Palette / starcitizen.tools）**：页眉里那条「输入框」其实是触发器（无 JS 时是真表单），点击或按 `/`、`⌘K` 打开居中悬浮的搜索面板：直角、顶部 3px 青条、56px 输入行、`--ak-bg-overlay` 遮罩 + 2px 模糊；空态给最近访问 + 快捷入口，有字给分组结果（干员带头像 / 职业 / 稀有度）+ 末尾固定「全文搜索」行；`/` 列命令、`>` `#` `@` `~` 进入模式（斜切 chip）。高亮行沿用「左 2px 青条 + 淡青底」；键位提示用 `.ak-kbd`。**不做**页眉内下拉建议（Vector 式）：内容页面宽、页眉是玻璃底，下拉在毛玻璃上叠层次会脏；居中面板一层遮罩把注意力收拢，也天然适配手机（8px 内边距全宽卡片）

---

## 3. 装饰语言（Signature primitives）

全部为可叠加的纯 CSS 类（`src/arknights.css` A 段）：

| 类 | 说明 | 出处 |
|---|---|---|
| `.ak-chamfer` `--tr --br --all --sm --lg` / `.ak-chamfer-frame` | 45° 切角，双层实现带边框 | 游戏面板 |
| `.ak-skew` `--l --r --arrow` / `.ak-skew-text` | 平行四边形标签/箭头 | 游戏 `announce_title_on` |
| `.ak-stripes` `--strong --warning --danger --hazard` / `.ak-stripe-bar` / `.ak-stripe-edge` | 45° 斜纹 | 游戏 `btn_done`、`image_btn_ap_confirm` |
| `.ak-halftone` `--l --full` / `.ak-blue-band` | 半调网点渐隐 | 游戏 `bkg_openserver` |
| `.ak-bg-grid` `.ak-bg-dots` `.ak-bg-diag` `.ak-scanlines` | 网格/点阵背景 | PRTS 终端 |
| `.ak-corner` `--tr --yellow --red --lg` / `.ak-corner-tag` | 角标三角 / 斜带文字 | 官网右上三角、游戏 `selected_decor` |
| `.ak-brackets` | 细线边角（仅用于图片） | |
| `.ak-en` `.ak-display` `.ak-overline` `.ak-num` `.ak-code-id` `.ak-watermark` `.ak-bilingual` | 拉丁装饰字 | 官网 |
| `.ak-glyph` `.ak-glyph-box` | 白色线稿图标反相 | |
| `.ak-inverse` | 黑白反转块 | 游戏 `btn_on/off` |
| `.ak-chevrons` | 链接尾部 `»` | 游戏 `transferarrow` |

---

## 4. 图标

- **游戏原图**（torappu 解包）：职业 8 + 分支 ~70 + 精英化 4 + 潜能 6 + 专精 4 + 稀有度星 + 势力 logo 43 + 道具/技能/头像。全部白色线稿或彩色精灵；白色线稿类加 `.ak-glyph` 或所在组件内已内置 `filter: var(--ak-glyph-filter)`。
- **UI 图标**：单色 SVG，24 网格、2px 描边、`currentColor`；尺寸 14/18/24/32/48。预览页 `<symbol id="i-*">`。
- 图标资源目录：`preview/assets/{profession,subprofession,elite,potential,specialized,rarity,camp,item,skill,avatar}`；生产环境放到 `File:` 命名空间或皮肤 `resources/images`，路径经 `--ak-asset-base` 配置。

---

## 5. 可访问性

- 所有交互元素 `:focus-visible` 2px 青色描边（`--ak-focus`）。
- 颜色不作为唯一信息载体：稀有度同时有星数；SP 类型同时有文字标签；增减益同时有 +/- 与 ▲▼。
- 触控目标 ≥ 36px（`.ak-btn` 默认 36，`.ak-btn--lg` 44）。
- `prefers-reduced-motion` / `prefers-contrast: more` / `forced-colors` 均有处理（`tokens.css` / `base.css`）。
- 折叠/标签页/对话框使用原生 `details` / `dialog` / `aria-selected`。

---

## 6. 文件与用法

```
src/tokens.css       令牌 + 主题 + Codex 桥接（必须最先加载）
src/base.css         MW 内容样式（.mw-parser-output、wikitable、toc、tabber、表单、diff…）
src/components.css   通用组件（.ak-btn/.ak-tag/.ak-card/.ak-panel/.ak-tabs/.ak-message/…）
src/arknights.css    方舟装饰 + 游戏数据组件（.ak-rarity/.ak-op-card/.ak-skill/…）
src/skin.css         皮肤骨架（页眉/侧栏/页面标签/TOC/页脚/搜索面板/响应式）
src/search-palette.js 悬浮搜索面板核心（皮肤与预览共用；数据源由调用方注入）
src/sidebar-tree.js  侧栏多层导航
src/utilities.css    工具类
src/index.css        本地预览汇总入口
preview/index.html   设计系统展示（运行在皮肤骨架内）
preview/operator.html 干员页整页样例（陈 · gamedata 2.7.61）
```
