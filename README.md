# AKDS · 明日方舟网页设计系统（for prts.wiki 新皮肤）

> Arknights Web Design System — 令牌 → 组件 → 模式分层，视觉母体为 [明日方舟官网](https://ak.hypergryph.com/) 与游戏内 UI（torappu 解包），目标是 prts.wiki（MediaWiki 1.43）的新皮肤。

## 在线预览

GitHub Pages（`master` 推送后由 `.github/workflows/pages.yml` 构建部署，`scripts/build-site.sh` 组装）：

- **文档站**（参考 [primer.style](https://primer.style/)，VitePress，`site/`）：https://mooncellwiki.github.io/prts-design/ ——
  入门 · 基础（令牌表由 `tokens/tokens.json` 生成：色彩 / 字体 / 尺寸 / 装饰语言 / 图标）· 组件（页头列出 CSS / Vue 两种实现各自的状态、源码、Storybook、现网模板；
  概览 / 指南 / 可访问性 三个页签；每个示例在 iframe 里跑全套样式，带「Vue」源码与「HTML」结构两个页签——HTML 就是 Vue 组件实际渲染出的结构，模板照着输出即可；Props 表由组件的 TS 类型自动生成；CSS 类名表直接从样式表抽取）· 整页样例
- **Storybook**（Vue 组件工作台 + 整页样例，工具栏切 终端 / 档案 / 跟随系统 与示例活动主题）：https://mooncellwiki.github.io/prts-design/storybook/
  文档站也收录两层纯 CSS：[MediaWiki 内容样式](https://mooncellwiki.github.io/prts-design/content/)（L1，编辑写的 wikitext / MW 生成的 HTML）与 [皮肤骨架](https://mooncellwiki.github.io/prts-design/chrome/)（L2，页眉 / 侧栏 / 目录 / 主题接口）。
  原来运行在皮肤骨架里的 5 张展示页（基础 / 皮肤骨架 / MediaWiki 内容 / 通用组件 / 方舟组件）已退役，内容都在文档站；旧地址（`/components.html`、`/preview/components.html` …）留了跳转页。
- 首页设计稿（信息结构取自 prts.wiki 现网首页；Swiper 自动轮播、进度条长在候选列表当前行底边；页面只管自己——各区块样式在页面的 `<style>` 里，对应生产环境的 TemplateStyles，整页标 `ak-not-prose`，正文排版规则不进组件，见规范 §1.3；去标题 / 去目录 / 去白纸归皮肤，Skin:Arknights 已内置，站点不用写 `MediaWiki:Common.css`，见 03 §3.4）：https://mooncellwiki.github.io/prts-design/preview/home.html
- 干员页整页样例（陈；信息结构 1:1 取自 prts.wiki 现网「陈」页面的 19 个章节——异格一览 / 干员信息 / 特性 / 获得方式 / 属性（含属性计算器 + 模组选择）/ 攻击范围 / 天赋（潜能 · 算法开关）/ 潜能提升 / 技能 / 后勤技能 / 精英化材料 / 技能升级材料 / 模组 / 相关道具 / 干员档案 / 语音记录 / 干员密录 / 悖论模拟 / 干员异格任务 / 干员模型；顶部「干员信息」**= 现网 `{{CharinfoV2}}` Widget 原样**——DOM / CSS / JS 一字不改（静态文件钉版本抓成快照 `preview/vendor/charinfo/`，`scripts/fetch-charinfo.py`；立绘 / 场景 / BGM / 语音运行时从现网拉，试听语音 · BGM · 时装 / 场景抽屉 · 看图 / 全屏都是现网的行为），页面只加几条接缝规则（正文列窄时整块 zoom、皮肤的 img 规则不进舞台、全屏层 z-index），先把现网的动效 / 文本排布 / 小交互原样看全，再定换皮范围（`src/charinfo.css` 那份皮肤化样式表暂不接入）；其余章节 = 现网各模板 → 设计系统组件的映射，见 03 §3.6）：https://mooncellwiki.github.io/prts-design/preview/operator.html
- 单文件版（图片内联，可另存离线）：`dist/` 下同名文件，https://mooncellwiki.github.io/prts-design/dist/home.html · https://mooncellwiki.github.io/prts-design/dist/operator.html

本地预览站（两张整页样例，运行在皮肤骨架里）：直接打开 `preview/home.html` / `preview/operator.html`（右上角切换 终端(暗) / 档案(亮) / 跟随系统；页眉在两套主题下都是黑色「终端」顶栏——官网导航栏 / 游戏主界面顶栏 / 档案页顶部黑边的框架语言，配色只读 `--ak-chrome-*`；侧栏「示例活动主题」按钮（或 `?demo=1`）演示大活换皮：头图 / 站标 / 活动主色 / 画布底纹 / 页眉玻璃透度全部只是覆盖 `tokens.css §2d` 的接口变量，见 `src/chrome/demo-theme.css`——头图从页面顶端铺起，页眉是压在它上面的一块均匀黑玻璃，可读性由玻璃保证、不赌画面；页眉不放站点级主导航——那 8 项与侧栏「通用」组重复，导航只由侧栏承担；桌面页眉是与正文三列对齐的 品牌 · 搜索 · 工具，窗口 <1120 时外观切换 / 通知 / 用户收进右上角 ≡ 拉下的卡片）。预览侧栏使用 prts.wiki 现网 `#MenuSidebar` 的真实结构（分组 → 分组项 → 子项，可多层），悬停可预览、点击展开并记忆。搜索是参考 Citizen（starcitizen.tools）的悬浮面板：点页眉搜索框或按 `/`、`⌘K` 打开，试试 `陈`、`yh`（拼音首字母）、`>`（动作）、`/`（命令列表）。

本地文档站 / Storybook：`pnpm install` 后 `pnpm dev:docs`、`pnpm storybook`（见下「重新生成」）。

## 目录

分层同 [Primer](https://github.com/primer)：令牌（≈ primer/primitives）→ CSS 实现（≈ primer/css）→ Vue 实现（≈ primer/react）→ 文档站（≈ primer.style），放在一个仓库里。

```
tokens/             令牌源（≈ primer/primitives）：src/**/*.json5（W3C DTCG 格式；base/ 原始色板 · 字体 · 尺寸 · 动效 · 层级，functional/ themes/light · dark · contrast-more 语义令牌 + chrome 页眉 / 头图 / 画布主题接口 + control，bridge/codex MediaWiki Codex 桥接）
                    build.ts（Style Dictionary）→ src/tokens.css（按原选择器结构输出：亮 :root / 暗 data-theme · clientpref-night / 跟随系统 @media 同一份源 / 高对比）+ tokens/tokens.json（每个令牌带 CSS 写法与亮 / 暗解析值，文档站读它）
src/                CSS 实现（≈ primer/css），每个组件一份样式表；index.css 与各层 index.css 的 @import 顺序 = 唯一的加载顺序
  fonts.css         自托管 web 字体的 @font-face（scripts/fetch-fonts.py 生成；最先加载）
  fonts/            woff2 + 各族 LICENSE / NOTICE：官网同源 Novecento Sans Wide 500–800 · Bender 400/700（ASCII 子集，来源见 NOTICE.md）；OFL 的 Noto Sans SC 可变字重（101 片）· Oswald VF · Chakra Petch 400–700 · JetBrains Mono VF（合计 ≈4.9MB）
  img/              CSS 直接引用的游戏素材（item/bg_1–6.png 道具稀有度底框 = prts.wiki 文件:道具_背景_N.png，即游戏 sprite_item_r1–r6，给 .ak-item--bare 裸图标叠框用；scripts/fetch-item-bg.py 抓取；NOTICE.md）
  tokens.css        生成物（pnpm tokens）：令牌 + 双主题 + 页眉/头图/画布主题接口（§2d）+ Codex/MW 令牌桥接
  base/             L1 MediaWiki 内容：root（html / body 基底，紧跟令牌）· typography（正文排版，带 prose / not-prose 作用域，规范 §1.3）· tables · media · toc · collapsible · references · notices · catlinks · tabber · forms（裸控件）· special-pages · print
  components/       L3 通用组件：button · tag · chip · badge · card · panel · heading · tabs · message · cbox · tooltip · dropdown · dialog · toast · progress · stat · skeleton · spinner · empty · avatar · breadcrumb · pagination · timeline · stepper · form · table · accordion · divider · fab · title-reset · keyframes
  decor/            L4 方舟装饰语言（色条/斜纹/网点/角标/线稿/反转/拉丁字…）
  arknights/        L4 游戏数据组件（稀有度/职业/精英化/潜能/干员卡/道具/技能（卡 + 全等级表 + 参数矩阵）/天赋条件表/属性/键值表/攻击范围/模组/语音/档案/关卡/敌人/活动…；table-numerals（B99）最后）
  chrome/           L2 皮肤骨架：黑色页眉/头图带 .ak-keyart/侧栏（含多层树 + 悬停飞出）/页面头/TOC/搜索面板/页脚/responsive（各块断点，最后）；demo-theme.css = 示例活动主题（只覆盖接口变量，不进 index.css）
  utilities.css     工具类（最后）
  index.css         本地汇总入口（按层 @import）
  charinfo.css      干员页「干员信息」舞台的皮肤化样式表草案（**预览页目前不接入**，见 preview/vendor/charinfo/ 与 03 §3.6）
  sidebar-tree.js   侧栏多层导航增强（皮肤与预览共用）
  search-palette.js 悬浮搜索面板核心（数据源由调用方注入，皮肤与预览共用）
vue/                Vue 3 实现（≈ primer/react，@akds/vue）：src/components/<Name>/{Ak<Name>.vue, Ak<Name>.stories.ts, demos/*.vue}（demos 由 Storybook 与文档站共用）· src/icons.ts（界面线稿图标，= 骨架 sprite）· src/index.ts；pages/ 整页样例 stories。组件只输出 .ak-* 结构 + 状态 / 键盘 / ARIA，不带样式
.storybook/         Storybook 10（@storybook/vue3-vite）：主题 / 活动主题工具栏，组件包在 .mw-body-content.mw-parser-output 里渲染；preview/ 挂到 /preview/
site/               文档站（≈ primer.style，VitePress）：.vitepress/registry.ts 组件注册表（侧栏 / 总览 / 页头都读它）· plugins/（`@demo X/Y` 示例、```html demo 代码块、vue-component-meta → Props 表）· theme/；public/ 链着 preview/ 与 src/
skin/               MediaWiki 皮肤骨架：skin.json（样式模块逐文件列出，由 scripts/css-order.ts 从 src/index.css 同步）· templates/skin.mustache · resources/skin.js + search-providers.js（MW 搜索数据源）（base/ components/ decor/ arknights/ chrome/ fonts/ img/ 与 tokens.css、utilities.css、共用 JS 为 src 的符号链接）· i18n
preview/            预览站（home / operator 两张整页样例，scripts/build-preview.py 从 _src/ 生成：_src/skeleton.html 皮肤骨架只写一份 + _src/pages/*.html 各页 front matter + 正文；改源文件再重跑，别直接改生成物）+ preview.js + search-mock.js + assets/（torappu 解包的游戏图标 / 现网拼好的道具图 item/framed/ / 头图 keyart/ / 首页素材 mainpage/ / 页脚徽章 badge/ / 模组图 module/ …）+ vendor/（Swiper 11、现网 Widget:CharinfoV2 快照、jQuery 3.7.1，各见其 NOTICE.md）
dist/               单文件打包（图片 + 拉丁字体内联，思源黑体指回 ../src/fonts/；scripts/build-dist.py 生成）
docs/               01 规范 · 02 组件清单 · 03 MediaWiki 接入（全文也在文档站「参考」下，内容正逐步拆进文档站各页）
scripts/            fetch-*.py（字体 / 道具图 / 底框 / Widget 快照）· build-preview.py（_src → preview/*.html）· build-dist.py · build-site.sh（组装 Pages 站点）· css-order.ts（skin.json ↔ index.css 同序）· verify/styles.ts（计算样式快照比对）
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

- 任何页面：`<link rel="stylesheet" href="src/index.css">`（按层 @import；`fonts.css` 在最前）。
- MediaWiki：把 `skin/` 复制到 `skins/AKDS/`，`wfLoadSkin('AKDS')`；`resources/` 下的样式目录 / 文件由 `src/` 同步（符号链接）。skin.json 里样式模块逐文件列出（ResourceLoader 不跟 @import），顺序由 `node scripts/css-order.ts --write` 从 `src/index.css` 同步。字体是独立模块 `skins.akds.fonts`，可整体关掉。详见文档站「在 MediaWiki 中使用」与 `docs/03-mediawiki-integration.md`。
- 模板/TemplateStyles：直接输出 `.ak-*` 结构（文档站每个示例的「HTML」页签就是要输出的结构），令牌可在 TemplateStyles 中 `var(--ak-accent)` 引用。
- Vue（prts-widgets 等）：`import { AkButton, AkTabs } from "@akds/vue"`（目前在仓库 `vue/` 里，未发包）；组件不带样式，wiki 页面上由皮肤提供。

## 重新生成

```bash
pnpm install                                           # Node 24 + pnpm（版本见 package.json 的 packageManager）
pnpm tokens                                            # tokens/src/**/*.json5 → src/tokens.css + tokens/tokens.json（CI 会检查两者是否最新）
pnpm dev:docs                                              # 文档站开发（site/）
pnpm storybook                                         # Storybook 开发（:6006）
pnpm typecheck                                         # vue-tsc
node scripts/css-order.ts [--write]                    # 检查 / 同步 skin/skin.json 的样式列表与 src/index.css 同序
node scripts/verify/styles.ts snap <标签> · diff <A> <B> # 预览页每个元素（含伪元素）在 亮 / 暗 / 跟随系统 / 平板 / 手机 / 活动主题 下的计算样式快照与比对——重构 CSS 前后跑一遍，保证视觉零变化
python3 scripts/fetch-fonts.py                         # 官网静态资源（Novecento / Bender）+ npm 上的 Fontsource 包 → src/fonts/ + src/fonts.css（URL / 版本钉死，官网 hash 变了会自动重新发现；--registry https://registry.npmmirror.com 走镜像）
python3 scripts/fetch-item-framed.py                   # 现网拼好的道具图 道具_带框_<名>.png → preview/assets/item/framed/<id>.png（扫各页用到的 id，manifest 查名，按文件名 md5 算 media 路径；已有的跳过，--force 重抓）
python3 scripts/fetch-item-bg.py                       # 游戏道具稀有度底框（prts.wiki 文件:道具_背景_1–6.png，钉 media 路径）→ src/img/item/bg_1–6.png（.ak-item--bare 用）
python3 scripts/fetch-charinfo.py                      # 现网 Widget:CharinfoV2 的 CSS / JS / 字体 / HUD 图标 + jQuery → preview/vendor/{charinfo,jquery}/（版本号钉在脚本里；charVoice 只留 --chars 指定的干员）
python3 scripts/build-preview.py                       # preview/_src/{skeleton.html, pages/*.html} → preview/*.html（改了骨架或任一页都要跑）
python3 scripts/build-dist.py                          # preview/*.html → dist（需要 Pillow；跟随 @import 内联）
pnpm build:site                                        # = bash scripts/build-site.sh _site：构建文档站 + Storybook 并组装 Pages 站点（本地自查：AKDS_BASE=/ pnpm build:site，python3 -m http.server -d _site）
```

## 说明

- 字体：预览与皮肤自托管全部 web 字体（`src/fonts.css`），人人看到一致——展示字 **Novecento Sans Wide**、HUD 标签 / 数值 **Bender** 取自官网静态资源（PRTS 为官方赞助站点，与鹰角同一组织下共用授权；官网发布的是 ASCII 子集，非 ASCII 字符逐字落到后一段）；正文 Noto Sans SC（= 思源黑体，Google 的 101 片切分、页面只下用到的片）、压缩字 Oswald、Chakra Petch（接 Bender 缺字）、等宽 JetBrains Mono 为 OFL。
- 游戏素材版权归鹰角网络所有；本仓库仅作 PRTS 皮肤设计用途。
