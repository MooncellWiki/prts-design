# PRTS Design · 明日方舟网页设计系统（for prts.wiki 新皮肤）

> 明日方舟网页设计系统——令牌 → 组件 → 模式分层，视觉母体为 [明日方舟官网](https://ak.hypergryph.com/) 与游戏内 UI（torappu 解包），目标是 prts.wiki（MediaWiki 1.43）的新皮肤。

## 在线预览

GitHub Pages（`master` 推送后由 `.github/workflows/pages.yml` 构建部署，`scripts/build-site.sh` 组装；e2e 是单独的 `.github/workflows/e2e.yml`，不挡部署）：

- **文档站**（参考 [primer.style](https://primer.style/)，VitePress，`site/`）：https://mooncellwiki.github.io/prts-design/ ——
  入门（含 MediaWiki 接入：模块与层序 / skin.mustache 结构 / 模板与 TemplateStyles / 迁移与上线）· 基础（令牌表由 `packages/tokens/tokens.json` 生成：设计理念 / 色彩 / 字体 / 尺寸 / 装饰语言 / 图标 / 可访问性）· 组件（页头列出 CSS / Vue 两种实现各自的状态、源码、Storybook、现网模板；
  概览 / 指南 / 可访问性 三个页签；每个示例在 iframe 里跑全套样式，带「Vue」源码与「HTML」结构两个页签——HTML 就是 Vue 组件实际渲染出的结构，模板照着输出即可；Props 表由组件的 TS 类型自动生成；CSS 类名表直接从样式表抽取）· 整页样例
- **Storybook**（Vue 组件工作台 + 整页样例，工具栏切 终端 / 档案 / 跟随系统、示例活动主题，以及宿主 Arknights 皮肤 / Vector 2022 / 站外）：https://mooncellwiki.github.io/prts-design/storybook/
  文档站也收录两层纯 CSS：[MediaWiki 内容样式](https://mooncellwiki.github.io/prts-design/content/)（L1，编辑写的 wikitext / MW 生成的 HTML）与 [皮肤骨架](https://mooncellwiki.github.io/prts-design/chrome/)（L2，页眉 / 侧栏 / 目录 / 主题接口）。
  原来运行在皮肤骨架里的 5 张展示页（基础 / 皮肤骨架 / MediaWiki 内容 / 通用组件 / 方舟组件）已退役，内容都在文档站；旧地址（`/components.html`、`/preview/components.html` …）留了跳转页。
- 首页设计稿（信息结构取自 prts.wiki 现网首页；Swiper 自动轮播、进度条长在候选列表当前行底边；页面只管自己——各区块样式在页面的 `<style>` 里，对应生产环境的 TemplateStyles，整页标 `ak-not-prose`，正文排版规则不进组件，见文档站 /foundations/principles#prose-not-prose；去标题 / 去目录 / 去白纸归皮肤，Skin:Arknights 已内置，站点不用写 `MediaWiki:Common.css`，见文档站 /patterns/home#页面与皮肤的分工）：https://mooncellwiki.github.io/prts-design/preview/home.html
- 干员页整页样例（陈；信息结构 1:1 取自 prts.wiki 现网「陈」页面的 19 个章节——异格一览 / 干员信息 / 特性 / 获得方式 / 属性（含属性计算器 + 模组选择）/ 攻击范围 / 天赋（潜能 · 算法开关）/ 潜能提升 / 技能 / 后勤技能 / 精英化材料 / 技能升级材料 / 模组 / 相关道具 / 干员档案 / 语音记录 / 干员密录 / 悖论模拟 / 干员异格任务 / 干员模型（= 现网 SpineViewer 换新排布：时装 / 模型选择条 + 随列宽的舞台 + 一行一个的动作列表 + 标出判定帧的时间轴，真的从 torappu.prts.wiki 取模型来播，运行时快照在 `preview/vendor/spine/`，见文档站 /patterns/operator#干员模型）；顶部「干员信息」**= 现网 `{{CharinfoV2}}` Widget 原样**——DOM / CSS / JS 一字不改（静态文件钉版本抓成快照 `preview/vendor/charinfo/`，`scripts/fetch-charinfo.py`；立绘 / 场景 / BGM / 语音运行时从现网拉，试听语音 · BGM · 时装 / 场景抽屉 · 看图 / 全屏都是现网的行为），页面只加几条接缝规则（正文列窄时整块 zoom、全屏层 z-index），先把现网的动效 / 文本排布 / 小交互原样看全，再定换皮范围（`packages/css/src/charinfo.css` 那份皮肤化样式表暂不接入）；其余章节 = 现网各模板 → 设计系统组件的映射，见文档站 /patterns/operator）：https://mooncellwiki.github.io/prts-design/preview/operator.html
- 干员一览整页样例（列表 / 筛选页；信息结构取自 prts.wiki 现网「干员一览」= prts-widgets 的 CharList Widget：两条提示 / 三组筛选 / 排序 · 搜索 · 满潜能 · 满信赖 / 表格 · 半身像 · 头像三种显示方式 / 复制短链接 · 分页；筛选项、431 位干员的数据、筛选逻辑、地址栏 # 参数都与现网一致——数据是现网页面的快照 `preview/vendor/charlist/data.js`（`scripts/fetch-charlist.ts`），头像 / 半身像运行时从现网拉；筛选分两层（常用的职业 / 稀有度 · 位置一直在，分支选了职业才出，其余 12 行收进「高级筛选」按五类分页签）、职业 / 分支带游戏筛选面板的白线稿图标、会筛出 0 条的芯片压淡、八项数值各占一列可排序（排序项与同值次序照游戏的 `CharacterSortType` / `COMPARE_PRIORITY`）、结果区 <1000 换卡片，见文档站 /patterns/operators）：https://mooncellwiki.github.io/prts-design/preview/operators.html
- 公招计算整页样例（工具页；现网「公招计算」= prts-widgets 的 HrCalculator Widget 的重新设计，算法口径照游戏的招募流程改：标签个数不限 / 不选招募时限、一律按 9:00 算（3–5★，6★ 只随【高级资深干员】、1★ 只随【支援机械】）/ 每组至多 3 个标签、全部组合排成一张表、保底高的在前、结论先说；干员数据是现网 Widget 那条 cargoquery 的快照 `preview/vendor/recruit/data.js`（`scripts/fetch-recruit.ts`），地址栏 `?filter=` 与现网互通，见文档站 /patterns/recruit）：https://mooncellwiki.github.io/prts-design/preview/recruit.html

本地预览站（四张整页样例，运行在皮肤骨架里）：直接打开 `preview/home.html` / `preview/operators.html` / `preview/recruit.html` / `preview/operator.html`（右上角切换 终端(暗) / 档案(亮) / 跟随系统；页眉在两套主题下都是黑色「终端」顶栏——官网导航栏 / 游戏主界面顶栏 / 档案页顶部黑边的框架语言，配色只读 `--ak-chrome-*`；侧栏「示例活动主题」按钮（或 `?demo=1`）演示大活换皮：头图 / 站标 / 活动主色 / 画布底纹 / 页眉玻璃透度全部只是覆盖 `tokens.css §2d` 的接口变量，见 `packages/css/src/chrome/demo-theme.css`——头图从页面顶端铺起、垫在页眉与版面背后、只露一小条，页眉是压在它上面的一块均匀黑玻璃，版面压住的那段先糊（`--ak-keyart-veil-filter`）再蒙一层画布色的纱，可读性由玻璃和纱保证、不赌画面；页眉不放站点级主导航——那 8 项与侧栏「通用」组重复，导航只由侧栏承担；桌面页眉是与正文三列对齐的 品牌 · 搜索 · 工具，窗口 <1120 时外观切换 / 通知 / 用户收进右上角 ≡ 拉下的卡片）。预览侧栏使用 prts.wiki 现网 `#MenuSidebar` 的真实结构（分组 → 分组项 → 子项，可多层），悬停可预览、点击展开并记忆。搜索是参考 Citizen（starcitizen.tools）的悬浮面板：点页眉搜索框或按 `/`、`⌘K` 打开，试试 `陈`、`yh`（拼音首字母）、`>`（动作）、`/`（命令列表）。另有跨宿主对照页 `preview/gallery.html`（不在侧栏里）：同一份组件 HTML 按 `?host=akds|vector|bare` 放进 Arknights 皮肤 / Vector 2022 / 站外三种页面，`?theme=` 切主题（Vector 那一种要先 `node scripts/fetch-vector-css.ts`）。

本地文档站 / Storybook：`pnpm install` 后 `pnpm dev:docs`、`pnpm storybook`（见下「重新生成」）。

## 目录

分层同 [Primer](https://github.com/primer)：令牌（≈ primer/primitives）→ CSS 实现（≈ primer/css）→ Vue 实现（≈ primer/react）→ 文档站（≈ primer.style），放在一个 pnpm workspace 里。前三层在 `packages/` 下，都发 npm（scope `@mooncellwiki`；CSS 包只含代码，不含字体与游戏素材——皮肤全套在仓库里），文档站 / Storybook / 预览站 / 皮肤是根目录下的应用。

```
packages/tokens/    @mooncellwiki/prts-design-tokens 令牌源（≈ primer/primitives）：src/**/*.json5（W3C DTCG 格式；base/ 原始色板 · 字体 · 尺寸 · 动效 · 层级，functional/ themes/light · dark · contrast-more 语义令牌 + chrome 页眉 / 头图 / 画布主题接口 + control，bridge/codex MediaWiki Codex 桥接）
                    build.ts（Style Dictionary）→ packages/css/src/tokens.css（按原选择器结构输出：亮 :root / 暗 data-theme · clientpref-night / 跟随系统 @media 同一份源 / 局部主题 .ak-scope[data-theme] / 高对比；同一份复制到 packages/tokens/tokens.css 随令牌包发布）+ bridge-codex.css（Codex 桥接）+ tokens.json（每个令牌带 CSS 写法与亮 / 暗解析值，文档站读它）
packages/css/src/   CSS 实现（≈ primer/css；npm 包 @mooncellwiki/prts-design-css 只发代码——字体 fonts/ 与素材 img/ 不可转授，不在包里），每个组件一份样式表；index.css 与各层 index.css 的 @import 顺序 = 唯一的加载顺序
  fonts.css         自托管 web 字体的 @font-face（scripts/fetch-fonts.py 生成；最先加载）
  fonts/            woff2 + 各族 LICENSE / NOTICE：官网同源 Novecento Sans Wide 500–800 · Bender 400/700（ASCII 子集，来源见 NOTICE.md）；OFL 的 Noto Sans SC 可变字重（101 片）· Oswald VF · Chakra Petch 400–700 · JetBrains Mono VF（合计 ≈4.9MB）
  img/              CSS 引用的游戏素材（item/bg_1–6.png 道具稀有度底框 = prts.wiki 文件:道具_背景_N.png，即游戏 sprite_item_r1–r6，给 .ak-item--bare 裸图标叠框用，经 base/skin-assets.css 的变量引；scripts/fetch-item-bg.py 抓取；NOTICE.md）
  tokens.css        生成物（pnpm tokens）：令牌 + 双主题 + 局部主题 + 页眉/头图/画布主题接口（§2d）；任何宿主都能加载
  bridge-codex.css  生成物（pnpm tokens）：Codex/MW 令牌桥接——只属于皮肤（加载到别的皮肤上会改掉宿主的 Codex 配色）
  scope.css         作用域根：排版基线挂在 body.skin-arknights / .ak-scope 上；别的宿主上把宿主的继承属性 / 元素规则 / 裸控件 / 链接色换成皮肤上那一套（Vue：<AkScope>）
  base/             L1 MediaWiki 内容：root（html / body 基底）· skin-assets（皮肤持有的素材接口 --ak-item-bg-*，由 index.css 直接引；放在 base/ 这一层是因为 Chromium 按使用处解析自定义属性里的相对 url()）· typography（正文排版，带 prose / not-prose 作用域，见文档站 /foundations/principles#prose-not-prose）· tables · media · toc · collapsible · references · notices · catlinks · tabber · forms（裸控件）· special-pages · print
  components/       L3 通用组件：button · tag · chip · badge · card · panel · heading · tabs · message · cbox · tooltip · dropdown · dialog · toast · progress · stat · skeleton · spinner · empty · avatar · breadcrumb · pagination · timeline · stepper · form · table · accordion · divider · fab · title-reset · keyframes
  decor/            L4 方舟装饰语言（色条/斜纹/网点/角标/线稿/反转/拉丁字…）
  arknights/        L4 游戏数据组件（稀有度/职业/精英化/潜能/干员卡/道具/技能（卡 + 全等级表 + 参数矩阵）/天赋条件表/属性/键值表/攻击范围/模组/语音/档案/关卡/敌人/活动…；table-numerals（B99）最后）
  chrome/           L2 皮肤骨架：黑色页眉/头图 .ak-keyart/侧栏（含多层树 + 悬停飞出）/页面头/TOC/搜索面板/页脚/responsive（各块断点，最后）；demo-theme.css = 示例活动主题（只覆盖接口变量，不进 index.css）
  utilities.css     工具类（含 .ak-sr-only）
  forced-colors.css 强制色模式（Windows 高对比度；组件层最后）
  index.css         皮肤全套的汇总入口（按层 @import；chrome 最后）
  standalone.css    组件入口（npm 包的默认入口；别的皮肤 / 站外用）：tokens + scope + components + decor + arknights + utilities + forced-colors，是 index.css 的子序列
  charinfo.css      干员页「干员信息」舞台的皮肤化样式表草案（**预览页目前不接入**，见 preview/vendor/charinfo/ 与文档站 /patterns/operator#charinfov2-怎么接）
  sidebar-tree.js   侧栏多层导航增强（皮肤与预览共用）
  search-palette.js 悬浮搜索面板核心（数据源由调用方注入，皮肤与预览共用）
packages/vue/       @mooncellwiki/prts-design-vue Vue 3 实现（≈ primer/react；pnpm build 出 dist/：Vite 库模式 JS + vue-tsc 类型）：src/components/<Name>/{Ak<Name>.vue, Ak<Name>.stories.ts, demos/*.vue}（demos 由 Storybook 与文档站共用）· src/icons.ts（界面线稿图标，= 骨架 sprite）· src/index.ts。组件只输出 .ak-* 结构 + 状态 / 键盘 / ARIA，不带样式
.storybook/         Storybook 10（@storybook/vue3-vite）：pages/ 整页样例 stories；主题 / 活动主题 / 宿主（Arknights 皮肤 / Vector 2022 / 站外）工具栏，组件包在 .ak-scope（+ 宿主的正文容器类）里渲染；preview/ 挂到 /preview/
site/               文档站（≈ primer.style，VitePress）：.vitepress/registry.ts 组件注册表（侧栏 / 总览 / 页头都读它）· plugins/（`@demo X/Y` 示例、```html demo 代码块、vue-component-meta → Props 表）· theme/；public/ 链着 preview/ 与 src/
skin/               MediaWiki 皮肤骨架：skin.json（样式模块 skins.akds.base / components / fonts / shell 进皮肤的 styles——MW 按模块名字母序输出，字母序即层序；另有只给别的皮肤用的 skins.akds.tokens；逐文件列表由 scripts/css-order.ts 从 packages/css/src/index.css 同步）· templates/skin.mustache · resources/skin.js + search-providers.js（MW 搜索数据源）（base/ components/ decor/ arknights/ chrome/ fonts/ img/ 与 tokens.css、bridge-codex.css、scope.css、utilities.css、共用 JS 为 src 的符号链接）· i18n
preview/            预览站（home / operators / recruit / operator 四张整页样例 + gallery 跨宿主对照页（?host=akds|vector|bare，骨架是 _src/gallery-skeleton.html），scripts/build-preview.py 从 _src/ 生成：_src/skeleton.html 皮肤骨架只写一份 + _src/pages/*.html 各页 front matter + 正文；改源文件再重跑，别直接改生成物）+ preview.js + search-mock.js + assets/（torappu 解包的游戏图标 / 现网拼好的道具图 item/framed/ / 头图 keyart/ / 首页素材 mainpage/ / 页脚徽章 badge/ / 模组图 module/ …）+ vendor/（Swiper 11、现网 Widget:CharinfoV2 快照、现网干员一览数据快照 charlist/、现网公招计算数据快照 recruit/、prts-widgets 的 Spine 运行时 spine/、jQuery 3.7.1，各见其 NOTICE.md；vector/ 是 Vector 2022 样式夹具，脚本抓取，入库只作回归测试、不随站点发布）
scripts/            fetch-*.py（字体 / 道具图 / 底框 / Widget 快照）· fetch-vector-css.ts（Vector 2022 样式夹具）· fetch-charlist.ts（现网干员一览数据快照）· fetch-recruit.ts（现网公招计算数据快照）· fetch-spine.ts（Spine 运行时）· build-preview.py（_src → preview/*.html）· build-site.sh（组装 Pages 站点）· css-order.ts（skin.json ↔ index.css 同序，按 MW 的字母序加载核；scope.css 的裸控件副本 ↔ base/forms.css）· sprite-sync.ts（三处图标 sprite 一致）
e2e/                Playwright Test（playwright.config.ts）：hosts.spec.ts 跨宿主比对 · snapshots.spec.ts 整页计算样式快照 · stories.spec.ts Storybook 每个 story 自检（测 _build/storybook）· support/（静态服务、计算样式快照、控制台收集）
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

- 皮肤全套（本地 / 预览）：`<link rel="stylesheet" href="packages/css/src/index.css">`（按层 @import；`fonts.css` 在最前）。
- MediaWiki（生产）：prts.wiki 用的是 [mediawiki-skins-Arknights](https://github.com/MooncellWiki/mediawiki-skins-Arknights)（Skin:Arknights，`wfLoadSkin('Arknights')`）——它的 `scripts/sync-design-system.sh` 把 `packages/css/src/` 原样拷进自己的 `resources/design-system/`、按 `index.css` 的顺序写进 skin.json（模块 `skins.arknights.base / components / fonts / shell / tokens`，`chrome/` 整层进 `shell`），它自己的 LESS 只剩 MediaWiki 胶水。改 CSS 只在这里改，然后去那边重跑同步脚本。
- MediaWiki（仓库内骨架 `skin/`，参考实现）：把 `skin/` 复制到 `skins/AKDS/`，`wfLoadSkin('AKDS')`；`resources/` 下的样式目录 / 文件是指向 `packages/css/src/` 的符号链接。skin.json 里样式模块逐文件列出（ResourceLoader 不跟 @import），顺序由 `node scripts/css-order.ts --write` 从 `packages/css/src/index.css` 同步。字体是独立模块 `skins.akds.fonts`，可整体关掉。详见文档站「在 MediaWiki 中使用」（/guide/mediawiki 及其下各页）。
- 纯 HTML（静态页面 / 后端模板，不用打包器）：`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mooncellwiki/prts-design-css@0.1/dist/prts-design.min.css">`（单文件版，`pnpm build` 由 `packages/css/build.ts` 从 `standalone.css` 内联生成），根节点加 `class="ak-scope"`，结构照抄文档站「HTML」页签（文档站 /guide/html）。
- 模板/TemplateStyles：直接输出 `.ak-*` 结构（文档站每个示例的「HTML」页签就是要输出的结构），令牌可在 TemplateStyles 中 `var(--ak-accent)` 引用。
- Vue（prts-widgets 等）：`import { AkButton, AkScope, AkTabs } from "@mooncellwiki/prts-design-vue"`（`packages/vue/`）；组件不带样式，样式按宿主来，三种宿主上看起来一样（文档站 /guide/vue#样式从哪来）：
  - prts.wiki · Arknights 皮肤：皮肤已加载全套，什么都不用做；
  - prts.wiki · 其它皮肤（Vector 2022 …）：widget 挂载前 `await mw.loader.using(["skins.arknights.components"])`（Skin:Arknights 注册的模块，令牌 + 作用域 + 组件一个模块就齐；Arknights 皮肤上是空操作；仓库内 `skin/` 骨架里叫 `skins.akds.components`），根节点包 `<AkScope>`（= `class="ak-scope"`）；
  - 站外：`import "@mooncellwiki/prts-design-css"`（= `standalone.css`，不含字体与素材），根节点包 `<AkScope>`；`<AkScope theme="dark|light">` 可局部固定主题。

## 重新生成

```bash
pnpm install                                           # Node 24 + pnpm（版本见 package.json 的 packageManager）
pnpm tokens                                            # packages/tokens/src/**/*.json5 → packages/css/src/tokens.css + bridge-codex.css + packages/tokens/tokens.css + tokens.json（CI 会检查是否最新）
pnpm build                                             # 构建要发布的包：令牌 → CSS 单文件版 packages/css/dist/prts-design{,.min}.css → Vue packages/vue/dist/
pnpm dev:docs                                              # 文档站开发（site/）
pnpm storybook                                         # Storybook 开发（:6006）
pnpm typecheck                                         # vue-tsc
node scripts/css-order.ts [--write]                    # 检查 / 同步 skin/skin.json 的样式列表与 packages/css/src/index.css 同序
pnpm exec playwright install --only-shell chromium     # e2e 的浏览器：Playwright 的 headless shell（装一次）
node scripts/fetch-vector-css.ts                       # 现网 Vector 2022 的皮肤 + 扩展样式 → preview/vendor/vector/vector.css，站点自定义样式 → site.css（回归夹具，入库、不随站点发布；e2e 不出网、CI 不抓，现网 MW 升级或 Common.css 改了再本地重抓提交；prts.wiki 的 WAF 拦 curl / urllib 与 headless shell，所以用本机的 Google Chrome 取）
pnpm e2e --project=hosts                               # 跨宿主：对照页 preview/gallery.html 在 Arknights 皮肤 / Vector 2022 / 站外 × 暗 / 亮 下逐元素比对（静态 + :hover / :focus-visible / :visited），组件的计算样式必须一样（白名单写在 e2e/hosts.spec.ts 里）；e2e.yml 每次推送 / PR 跑，不挡部署
pnpm e2e --project=snapshots [-u]                      # 预览页每个元素（含伪元素）在 亮 / 暗 / 跟随系统 / 平板 / 手机 / 活动主题 下的计算样式快照：重构 CSS 前 -u 拍基准（_verify/snapshots/），改完再跑一遍比对，保证视觉零变化
pnpm e2e --project=stories                             # Storybook 每个 story 渲染成功、控制台干净（测构建好的 _build/storybook，先 pnpm build:storybook；-g 按 story id 挑）
pnpm exec playwright show-report                       # e2e 的 HTML 报告：失败的差异列表、截图、trace 都在附件里
python3 scripts/fetch-fonts.py                         # 官网静态资源（Novecento / Bender）+ npm 上的 Fontsource 包 → packages/css/src/fonts/ + fonts.css（URL / 版本钉死，官网 hash 变了会自动重新发现；--registry https://registry.npmmirror.com 走镜像）
python3 scripts/fetch-item-framed.py                   # 现网拼好的道具图 道具_带框_<名>.png → preview/assets/item/framed/<id>.png（扫各页用到的 id，manifest 查名，按文件名 md5 算 media 路径；已有的跳过，--force 重抓）
python3 scripts/fetch-item-bg.py                       # 游戏道具稀有度底框（prts.wiki 文件:道具_背景_1–6.png，钉 media 路径）→ packages/css/src/img/item/bg_1–6.png（.ak-item--bare 用）
python3 scripts/fetch-charinfo.py                      # 现网 Widget:CharinfoV2 的 CSS / JS / 字体 / HUD 图标 + jQuery → preview/vendor/{charinfo,jquery}/（版本号钉在脚本里；charVoice 只留 --chars 指定的干员）
node scripts/fetch-spine.ts                            # prts-widgets 的 Spine 运行时（spine-webgl 3.8 + 修补，提交号钉在脚本里）→ preview/vendor/spine/spine-webgl.js（干员页样例的「干员模型」用；模型本身运行时从 torappu.prts.wiki 取）
node scripts/fetch-charlist.ts                         # 现网「干员一览」正文里的筛选项定义 + 每位干员一条数据 → preview/vendor/charlist/data.js（干员一览样例的数据快照；同样用本机的 Google Chrome 取）
node scripts/fetch-recruit.ts                          # 现网「公招计算」Widget 运行时发的那条 cargoquery（可公开招募的干员）→ preview/vendor/recruit/data.js（公招计算样例的数据快照；同样用本机的 Google Chrome 取）
python3 scripts/build-preview.py                       # preview/_src/{skeleton.html, gallery-skeleton.html, pages/*.html} → preview/*.html（改了骨架或任一页都要跑；页面 front matter 的 skeleton: 选骨架）
pnpm build:site                                        # = bash scripts/build-site.sh _site：构建文档站 + Storybook 并组装 Pages 站点（本地自查：PRTS_DESIGN_BASE=/ pnpm build:site，python3 -m http.server -d _site）
```

## 发布

`packages/` 下的三个公开包（`@mooncellwiki/prts-design-tokens`、`@mooncellwiki/prts-design-css`、`@mooncellwiki/prts-design-vue`，MIT）用同一个版本号，推 `v*` tag 由 `.github/workflows/release.yml` 发布（同 MooncellWiki/sponsorkit：sxzz/workflows 的 release，changelogithub 生成 GitHub Release，`pnpm -r publish` + OIDC trusted publishing，不存 npm token）：改三个 `package.json` 的 `version` → 提交 → `git tag vX.Y.Z` → `git push --follow-tags`。新包第一次需要有 `@mooncellwiki` 组织权限的人手动发布一次（`pnpm build && pnpm -r publish`），之后才能在 npm 上给它配 trusted publisher（Publisher 选 GitHub Actions，仓库 `MooncellWiki/prts-design`，workflow 填调用方的 `release.yml`，environment 留空）。`prts-design-css` 的 tarball 带构建出的 `dist/`（单文件版，给 CDN / 纯 HTML 用），不含 `fonts/`、`fonts.css`、`img/`、`base/skin-assets.css`、`charinfo.css`、`chrome/demo-theme.css`（`npm pack --dry-run` 可核）；默认入口是 `standalone.css`，包里的 `index.css` 引了字体与素材，不在 `exports` 里。

## 说明

- 字体：预览与皮肤自托管全部 web 字体（`packages/css/src/fonts.css`），人人看到一致——展示字 **Novecento Sans Wide**、HUD 标签 / 数值 **Bender** 取自官网静态资源（PRTS 为官方赞助站点，与鹰角同一组织下共用授权；官网发布的是 ASCII 子集，非 ASCII 字符逐字落到后一段）；正文 Noto Sans SC（= 思源黑体，Google 的 101 片切分、页面只下用到的片）、压缩字 Oswald、Chakra Petch（接 Bender 缺字）、等宽 JetBrains Mono 为 OFL。
- **许可**：代码（令牌源与构建脚本、CSS、Vue 组件、文档站 / Storybook / 预览站的程序部分、scripts/）以 [MIT](LICENSE) 授权。其余内容不在 MIT 范围内、不对外授权：游戏素材（`preview/assets/`、`packages/css/src/img/` 等）版权归鹰角网络所有；字体按各自目录里的 NOTICE / LICENSE（Novecento Sans Wide、Bender 为官网同源文件，按与鹰角同一组织下的共用授权使用，不可转授）；现网 Widget 快照（`preview/vendor/charinfo/`）归 PRTS；现网干员一览 / 公招计算数据快照（`preview/vendor/charlist/`、`preview/vendor/recruit/`）文本按 CC BY-NC-SA 4.0、游戏数据归鹰角网络；Spine 运行时（`preview/vendor/spine/`）归 Esoteric Software、按 Spine Runtimes License；Vector 2022 样式夹具（`preview/vendor/vector/`，Vector 与 MW 核心样式 GPL-2.0-or-later，站点自定义样式版权归 prts.wiki 编者）入库只作回归测试，不随站点发布；本仓库仅作 PRTS 皮肤设计用途。npm 包 `@mooncellwiki/prts-design-css` 只含 MIT 的代码部分。
