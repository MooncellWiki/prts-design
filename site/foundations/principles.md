# 设计理念

**黑白为体、青为用；直角、斜纹、网点；拉丁大写字作装饰层，中文思源做正文；终端 / 档案双主题。**

以明日方舟官网与游戏内 UI 为视觉母体。方舟本体的关键词：纯黑与纯白的对撞、青蓝强调、直角、拉丁大写字、白色线稿图标、半调网点与斜纹——UI 是「档案 / 终端」，不是「驾驶舱」。

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

## 六条原则

1. **Monochrome first** — 大面积黑/白/灰承载信息；青只用于选中、链接、主动作、强调条、文字高亮（`<mark>` / `:target` / 表格当前行都是同一块淡青底）；黄为次强调（稀有度/提示/通知徽标），不做荧光笔；红只表示危险与"NEW/BREAKING"（未读计数不算）。
2. **Square, not rounded** — `border-radius: 0`，也不做切角 / 斜切 / 斜带；层级与状态用色条、黑白反转、角标三角表达。输入框允许 2px。默认的圆只有两处：单选钮（圆是单选的通用语义）与道具图标 `.ak-item` 的圆框——后者是游戏道具底图（sprite_item_r*）本身，属素材不属 UI 盒子，照游戏 / 现网原样叠图。其余的圆都是有语义、要显式选用的形状：计数徽标（单个数字是正圆、多位是胶囊）、环形进度 `.ak-ring`、按钮加载态的圆弧、敌人头像底、骨架屏 `--circle`，以及确需时才用的 `.ak-avatar--round` / `.ak-btn--pill`。色条 + 细框的盒子（pre / 消息 / 面板头 / 模组卡 / 弹层顶条 …）用 `border-image` 把色条与 1px 框直角拼接——不同宽度的 border 会被浏览器在角上斜接（miter）出一道小斜边，那也是斜边（[令牌 · 形状](/foundations/size#形状) 有写法）。
3. **Latin as ornament** — 大写拉丁展示字（Novecento/Bender/Oswald）只做标题旁英文、编号、数值、水印；中文永远用思源黑体，行高 1.7。
4. **Two canonical themes** — 游戏本身是双色世界（主界面/作战为黑，档案/商店为白灰）。两套主题等价，用 MW 1.43 `skin-theme-clientpref-*` 切换。
5. **Wiki-native** — 先把 wikitext 产物（标题、表格、TOC、引用、图库、TabberNeue、Cargo）做好，再谈组件（见 [MediaWiki 内容样式](/content/)）；组件是纯 CSS 类，可写进模板/TemplateStyles。
6. **Traceable tokens** — 每个颜色标明出处（官网 CSS / 解包精灵采样 / gamedata），不用"看起来像"（见[色彩 · 原始色板](/foundations/color#原始色板)）。

## DO / DON'T

DO：标题左侧粗色条 + 短横条；色条/黑白反转/角标表示选中；HUD 级数值 / 编号 / 大写小标签用 Bender（粗体或大字号、独立出现），表格与正文里的连续数字用正文字体 + 等宽数字（见[字体排印 · Bender 的使用边界](/foundations/typography#bender-的使用边界)）；青色只给选中 / 主动作 / 链接；白色线稿图标亮色下 `filter: invert(1)`；斜纹表示危险/施工/禁用；黑白反转做主动作。

DON'T：圆角卡片、阴影堆叠、玻璃拟态；切角、平行四边形、斜带、border 斜接出来的小斜边；辉光文字；金黄 `#FFD429` 做主色；大写英文替代中文标题；正文用 Orbitron/等宽；非官方稀有度色；**青色给不可点的装饰文字**——青 = 链接 / 选中 / 焦点 / 主动作，卡片 eyebrow、标题英文副标、页眉命名空间这类 overline 小标签用 `--ak-fg-muted`（同 `.ak-overline` / `.ak-stat__label` / `.ak-attr__label`；亮色下 `#0098DC` 压白底只有 3.2:1，11px 小字也过不了 AA）。例外：活动卡 `.ak-event__type` 带「进行中」状态、Hero 黑底海报上的 eyebrow 留青。

## 菱形：源石

菱形是**有意的**，致敬源石——泰拉世界的核心物件。它不是「斜边」：斜边说的是盒子的轮廓（切角、平行四边形、斜带），菱形是一枚独立的小图形。同一个母题用在这几处：

- 正文无序列表的项目符号：5px 的正方形转 45°（`base/typography.css`，嵌套一层变灰），见[排版 · 列表](/content/typography#列表)；
- 加载指示 `.ak-spinner` 的**菱形涟漪**：中央一枚空心菱形，另一枚从它身上冒出来扩散淡出（游戏内 loading），见[加载 Spinner](/components/spinner)；
- 时间线 `.ak-timeline` 的节点：空心 = 未到，主色实心 = 已发生 / 当前，见[时间线 Timeline](/components/timeline)；
- 敌人卡的威胁度：一排菱形，点亮几枚 = 威胁几级，见[敌人 Enemy](/arknights/enemy)。

不再往别处扩散（按钮、卡片、角标都不做菱形）；单选钮也不做菱形——圆是单选的通用语义。

## prose / not-prose

同 Tailwind Typography 的 `prose` / `not-prose`：**wikitext 解析产物（`.mw-parser-output`）天然是「正文」**，`base/typography.css` 的正文排版规则（见 [MediaWiki 内容样式 · 排版](/content/typography)）——标题色条与短横条、段距、列表菱形符 / `ol::marker`、dl / blockquote / poem、链接色（含 `:visited` 褪色、`a.new`、外链图标）——默认作用于整篇；每条都带 `:not(:where(.ak-not-prose, .ak-not-prose *))`（特指度 0，不改原规则的权重）。模板 / 组件把 **`ak-not-prose` 标在输出的最外层**，子树内就完全不受正文排版影响：链接退回 `color: inherit`、无下划线，颜色 / 悬停由组件自己定。

为什么需要它：`a.ak-op-card` / `a.ak-stage` / 首页入口格这类「整块是链接」的组件写 `color`（0,1,0）永远打不过全局 `a:visited`（0,1,1）——预览里所有 `href="#"` 都算已访问，卡片名字会整体变成褪色的链接色；页眉 / 搜索面板 / 分页过去各自补过 `a:visited { color: inherit }`。规则：**标在最外层、不要只标在 `<a>` 上**；not-prose 子树里的链接基线只写 `:where(.ak-not-prose) a { color: inherit }`（特指度 0,0,1），**不要再列 `a:hover` / `a:visited`**——那是 (0,1,1)，反过来压住组件类 (0,1,0)：首页「中坚甄选」格的白字一旦已访问就变成继承来的黑字，就是这么来的；不-prose 区域里需要「看起来像正文链接」的地方，组件自己引用 `--ak-link` / `--ak-link-hover`（首页 `.mp-link` 就是这么做的）。不做「not-prose 里再开一层 prose」（Tailwind 也不支持），那是内容结构该拆开的信号。
