# AKDS · 明日方舟网页设计系统（for prts.wiki 新皮肤）

> Arknights Web Design System — 令牌 → 组件 → 模式分层，视觉母体为 [明日方舟官网](https://ak.hypergryph.com/) 与游戏内 UI（torappu 解包），目标是 prts.wiki（MediaWiki 1.43）的新皮肤。

## 在线预览

GitHub Pages（`master` 推送后由 `.github/workflows/pages.yml` 自动部署，站点内容 = `preview/` 提到根目录 + `src/` + `dist/`）：

- 设计系统展示（运行在皮肤骨架内）：https://mooncellwiki.github.io/prts-design/
- 干员页整页样例（陈）：https://mooncellwiki.github.io/prts-design/operator.html
- 单文件版（图片内联，可另存离线）：https://mooncellwiki.github.io/prts-design/dist/index.html · https://mooncellwiki.github.io/prts-design/dist/operator.html

本地：直接打开 `preview/index.html` / `preview/operator.html`（右上角切换 终端(暗) / 档案(亮) / 跟随系统；页眉在两套主题下都是黑色「终端」顶栏——官网导航栏 / 游戏主界面顶栏 / 档案页顶部黑边的框架语言，配色只读 `--ak-chrome-*`；侧栏「示例活动主题」按钮（或 `?demo=1`）演示大活换皮：头图 / 站标 / 活动主色 / 画布底纹 / 页眉玻璃透度全部只是覆盖 `tokens.css §2d` 的接口变量，见 `preview/demo-theme.css`——头图从页面顶端铺起，页眉是压在它上面的一块均匀黑玻璃，可读性由玻璃保证、不赌画面；页眉不放站点级主导航——那 8 项与侧栏「通用」组重复，导航只由侧栏承担；桌面页眉是与正文三列对齐的 品牌 · 搜索 · 工具，窗口 <1120 时外观切换 / 通知 / 用户收进右上角 ≡ 拉下的卡片）。预览侧栏使用 prts.wiki 现网 `#MenuSidebar` 的真实结构（分组 → 分组项 → 子项，可多层），悬停可预览、点击展开并记忆。搜索是参考 Citizen（starcitizen.tools）的悬浮面板：点页眉搜索框或按 `/`、`⌘K` 打开，试试 `陈`、`yh`（拼音首字母）、`>`（动作）、`/`（命令列表）。

## 目录

```
docs/
  01-design-system.md          规范：理念、令牌（含每个颜色的出处）、字体、间距、装饰语言、图标、可访问性
  02-components.md             组件清单：L1 MW 内容 / L2 皮肤骨架 / L3 通用 / L4 方舟 / L5 页面模式；MW 映射
  03-mediawiki-integration.md  皮肤落地：skin.json、RL 模块、mustache 结构、clientPrefs 主题、Codex 桥接、TemplateStyles/Lua 用法、迁移路线
src/
  fonts.css         自托管 web 字体的 @font-face（scripts/fetch-fonts.py 生成；最先加载）
  fonts/            woff2 + 各族 LICENSE / NOTICE：官网同源 Novecento Sans Wide 500–800 · Bender 400/700（ASCII 子集，来源见 NOTICE.md）；OFL 的 Noto Sans SC 可变字重（101 片）· Oswald VF · Chakra Petch 400–700 · JetBrains Mono VF（合计 ≈4.9MB）
  tokens.css        令牌 + 双主题 + 页眉/头图/画布主题接口（§2d）+ Codex/MW 令牌桥接（必须最先加载）
  base.css          .mw-parser-output / wikitable / toc / tabber / 表单 / diff …
  components.css    通用组件 .ak-btn .ak-tag .ak-card .ak-panel .ak-tabs .ak-message …
  arknights.css     方舟装饰（色条/斜纹/网点/角标）+ 游戏数据组件（稀有度/职业/技能/道具/干员卡/模组/档案…）
  skin.css          皮肤骨架：黑色页眉/头图带 .ak-keyart/侧栏（含多层树 + 悬停飞出）/页面头/TOC/搜索面板/页脚/响应式
  sidebar-tree.js   侧栏多层导航增强（树形展开/记忆/当前页路径/桌面飞出；皮肤与预览共用）
  search-palette.js 悬浮搜索面板核心（触发器替换 / 分组结果 / 命令模式 / 键盘 / 最近访问；数据源由调用方注入，皮肤与预览共用）
  utilities.css     工具类
  index.css         本地汇总入口
skin/               MediaWiki 皮肤骨架：skin.json · templates/skin.mustache · resources/skin.js + search-providers.js（MW 搜索数据源：REST 标题搜索 / 动作 / 分类 / 用户 / 文件）（CSS、fonts/、sidebar-tree.js、search-palette.js 为 src 的符号链接）· i18n
tokens/tokens.json  机器可读令牌（scripts/export-tokens.py 生成）
preview/            展示页 + 干员页样例 + preview.js + search-mock.js（搜索面板演示数据：干员/道具本地索引 + 假页面）+ demo-theme.css（示例活动主题：只覆盖接口变量）+ assets/（torappu 解包的游戏图标：职业/精英/潜能/专精/稀有度/势力/道具/技能/头像；keyart/ 为罗德岛主界面昼夜背景做的头图 + 罗德岛三角章站标；badge/ 为 prts.wiki 现网页脚徽章，badge/mono/ 为 MW / SMW / CC 三枚通用徽章的白描版）
dist/               单文件打包（图片 + 拉丁字体内联，思源黑体指回 ../src/fonts/；scripts/build-dist.py 生成）
scripts/            fetch-fonts.py（拉字体、生成 src/fonts.css）· export-tokens.py · build-dist.py · build-site.sh（组装 GitHub Pages 站点）
```

## 三句话看懂这套系统

1. **黑白为体、青为用**：大面积黑/白/灰；青 `#18D1FF`（官网，暗色主题）/ `#0098DC`（游戏内，亮色主题）只做选中、链接、主动作与强调条；黄 `#FFD800` 为次强调；红只表示危险/NEW。
2. **直角、斜纹、半调网点、角标三角、黑白反转、大写拉丁装饰字、白色线稿图标**——这组几何装饰语言（`.ak-stripes .ak-halftone .ak-corner .ak-inverse .ak-en .ak-glyph`）就是方舟本体的形状语言：不做圆角，不做辉光，也没有切角 / 斜切 / 斜带（色条与细框用 border-image 直角拼接，不让 border 斜接出斜边）。
3. **终端 / 档案双主题**是双正典（游戏本身就是双色 UI），走 MediaWiki 1.43 的 `skin-theme-clientpref-*` 机制，并把 Codex 令牌桥接到 `--ak-*`，核心/扩展 UI 自动跟随。

## 颜色出处（可追溯）

| 来源 | 取得的令牌 |
|---|---|
| 官网 CSS（`web.hycdn.cn/arknights/official/_next/static/css/*`） | `#18D1FF` 青、灰阶 `#1D1F20 #8D8D8D #D2D2D2`、字体 Novecento Sans Wide / Bender / Oswald / 思源黑体、标题左 8px 色条与短横条、右上三角 |
| 游戏解包精灵（torappu：`ui/pages/home_page` `ui/character/*` `arts/*_hub` `arts/ui/hometheme/*` `arts/ui/homebackground/*` …） | 选中蓝 `#0098DC`、`#22BBFF`、开关 `#0075A9`、黄 `#FFD800`、SP 荧光绿 `#CAEC46`、红 `#A40000/#711111/#C82A36`、标准按钮灰 `#313131`、亮色面板 `#F5F5F5`、稀有度星/职业/精英/潜能/专精/势力图标；页眉的半调网点（`img_back` / `bkg_openserver`）、搜索触发器的图标框（`announce_title_on`）、选中块的青（`selected_back` / `toggle_on`）；示例头图 = 主界面「罗德岛 · 昼 / 夜」背景 |
| gamedata（`gamedata_const.richTextStyles`、`sandbox_table.charRarityColorList`） | 富文本 `ba.vup #0098DC / ba.vdown #FF6237 / ba.rem #F49800 / ba.kw #00B0FF …`；稀有度 `#BABABA #D3DC35 #82C5F5 #BF96ED #EFD691 #FF9433` |

## 使用

- 任何页面：`<link rel="stylesheet" href="src/index.css">`（或分文件按需，`fonts.css` 放最前）。
- MediaWiki：把 `skin/` 复制到 `skins/AKDS/`，`wfLoadSkin('AKDS')`；`resources/*.css`、`resources/fonts/` 由 `src/` 同步（符号链接）。字体是独立模块 `skins.akds.fonts`，可整体关掉。详见 `docs/03-mediawiki-integration.md`。
- 模板/TemplateStyles：直接输出 `.ak-*` 结构（示例见 `preview/*.html` 源码），令牌可在 TemplateStyles 中 `var(--ak-accent)` 引用。

## 重新生成

```bash
python3 scripts/fetch-fonts.py                         # 官网静态资源（Novecento / Bender）+ npm 上的 Fontsource 包 → src/fonts/ + src/fonts.css（URL / 版本钉死，官网 hash 变了会自动重新发现；--registry https://registry.npmmirror.com 走镜像）
python3 scripts/export-tokens.py                       # tokens.css → tokens/tokens.json
python3 scripts/build-dist.py                          # preview → dist（需要 Pillow）
bash scripts/build-site.sh _site                       # 组装 Pages 站点（CI 用同一脚本；本地 `python3 -m http.server -d _site` 可自查）
```

## 说明

- 字体：预览与皮肤自托管全部 web 字体（`src/fonts.css`），人人看到一致——展示字 **Novecento Sans Wide**、HUD 标签 / 数值 **Bender** 取自官网静态资源（PRTS 为官方赞助站点，与鹰角同一组织下共用授权；官网发布的是 ASCII 子集，非 ASCII 字符逐字落到后一段）；正文 Noto Sans SC（= 思源黑体，Google 的 101 片切分、页面只下用到的片）、压缩字 Oswald、Chakra Petch（接 Bender 缺字）、等宽 JetBrains Mono 为 OFL。
- 游戏素材版权归鹰角网络所有；本仓库仅作 PRTS 皮肤设计用途。
