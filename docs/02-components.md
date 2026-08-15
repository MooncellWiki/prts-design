# AKDS · 组件清单与划分

> 对照 ReEnd-Components 的组件划分（Core / Data display / Navigation / Feedback / Overlay / Signature），
> 按 **MediaWiki 皮肤** 的实际需要重新分层。每个组件给出：类名 · 用途 · 变体/状态 · 对应 MW DOM 或模板 · ReEnd 对照 · 状态（✅ 已实现 CSS / 🧩 需 JS/Gadget / 📝 规划）。

## 分层总览

```
L0  Tokens          令牌 / 主题 / Codex 桥接                         tokens.css
L1  MW Content      wikitext 产物样式（编辑者不需知道设计系统存在）  base.css
L2  Skin Chrome     皮肤骨架：页眉/侧栏/页面头/TOC/页脚/移动端       skin.css
L3  Core            通用组件（纯 CSS，可写入模板/TemplateStyles）     components.css
L4  Arknights       方舟装饰 + 游戏数据组件（Signature 层）           arknights.css
L5  Patterns        页面模式：干员页/关卡页/首页/列表页              docs + preview
```

ReEnd 是 React 库，组件 = 函数；AKDS 是皮肤，组件 = **一段约定好的 HTML 结构 + 类名**。模板作者（Lua/wikitext）输出该结构即可，皮肤保证外观与主题。

---

## L1 · MediaWiki 内容（base.css）

| 对象 | 选择器 | 设计 | 状态 |
|---|---|---|---|
| 正文 | `.mw-body-content` | 16px/1.7 思源；段距 16 | ✅ |
| 标题 h2 | `:where(.mw-body-content) h2` | 左 4px 青条 + 底线 + 96px 短横条（官网） | ✅ |
| 标题 h3-h6 | 同上 | h3 灰色左条；h6 overline 风格 | ✅ |
| 编辑节链接 | `.mw-editsection` | 悬停显现，青色 hover | ✅ |
| 链接 | `a` `.new` `.external` `.mw-selflink` `:visited` | 主题化色 + 外链 SVG 图标（mask） | ✅ |
| 列表 | `ul li::before` | 旋转方块项目符号（青）；`ol::marker` Bender | ✅ |
| 表格 | `.wikitable` + `.ak-striped .ak-compact .ak-dense .ak-borderless .ak-sticky-head` + `.ak-table-scroll` | 1px 边框、表头 surface-2、悬停行；移动端 display:block 横向滚动 | ✅ |
| 排序表头 | `.jquery-tablesorter th.headerSort*` | ⇅ ↑ ↓ 指示 | ✅ |
| 缩略图 / 图库 | `figure[typeof~=mw:File/Thumb]` `.thumb` `ul.gallery` | 1px 框 + 青色方块图注；弹性图库 | ✅ |
| 目录（内联） | `.toc` | 顶部 3px 青条卡片 | ✅ |
| 目录（侧栏） | `.ak-toc` | 见 L2 | ✅🧩 |
| 折叠 | `.mw-collapsible` + `.ak-collapse-box` | 盒式变体 | ✅ |
| 引用 | `sup.reference` `.references` `.reflist.ak-cols-2` | 目标高亮 | ✅ |
| 消息框 | `.mw-message-box-*` `.cdx-message` `.ambox` `.hatnote` | 左色条 + 浅底 | ✅ |
| 代码 | `pre` `code` `.mw-highlight` | inset 底 + 左青条 | ✅ |
| 引言 / 诗 | `blockquote` `.poem` | 左青条 surface-2 | ✅ |
| 分类 | `.catlinks` | 芯片式 | ✅ |
| 指示器 / 副标题 | `.mw-indicators` `#contentSub` | | ✅ |
| navbox / infobox 基线 | `.navbox` `.infobox` | 与卡片同语言（模板可覆盖） | ✅ |
| TabberNeue | `.tabber__*` + `.ak-tabber-boxed .ak-tabber-skew` | 下划线 + 选中角标；斜切变体 | ✅ |
| Cargo / DPL 表 | `.cargoTable` `table.mw-datatable` | 与 wikitable 一致 | ✅ |
| 表单 / OOUI / Codex | `input` `select` `.mw-ui-button` `.cdx-button` `.oo-ui-*` | 直角、青色焦点环 | ✅（Codex 主要靠桥接令牌） |
| Diff / 历史 / 最近更改 / 搜索 | `table.diff` `#pagehistory` `.mw-changeslist` `.mw-search-results` | 语义色 | ✅ |
| 通知 | `.mw-notification` | 左青条卡 | ✅ |
| 打印 | `@media print` | | ✅ |

---

## L2 · 皮肤骨架（skin.css）

| 组件 | 类 / MW 数据 | 说明 | ReEnd 对照 | 状态 |
|---|---|---|---|---|
| 页眉 | `.ak-header` `__logo __wordmark __nav __search __tools __menu` | 56px 粘性；毛玻璃底；左下 160px 青短条；`--dark` 变体（亮色主题下仍可黑页眉） | DocsHeader / StatusBar | ✅ |
| 主导航 | `.ak-header__nav a.is-active` | 3px 青色下划线 | Tabs underline | ✅ |
| 搜索 | `.ak-search` + `#searchform` | 左图标 + `/` 快捷键提示 | CommandPalette | ✅（建议 Gadget 做 ⌘K 面板） |
| 主题切换 | `.ak-theme-toggle` (os/day/night) | 写入 `mw.user.clientPrefs` | ThemeSwitcher | ✅🧩 |
| 通知 / 用户菜单 | `.ak-badge` `.ak-header__user` + `#p-personal` | Echo 徽标 | Badge / Avatar | ✅ |
| 侧栏 | `.ak-sidebar` `__panel(#mw-panel)` `.ak-portlet` `--grid --collapsible` + `#p-navigation` `#p-tb` | 粘性；<1120 抽屉；网格快捷入口；门户折叠状态记忆 | DocsSidebar | ✅🧩 |
| 侧栏多层导航 | `li.ak-tree__branch(.is-open .is-current-path .is-peek)` `> .ak-tree__label + button.ak-tree__toggle + ul.ak-tree__list`；`.ak-flyout` `__title` | 由 `sidebar-tree.js` 增强 `.ak-sidebar` 内任意 `li > ul`（含 PRTS `#MenuSidebar` 的 `p / ul / li > b` 原始输出）：任意深度树形展开、缩进导轨、当前页路径自动展开高亮、`localStorage` 记忆、← → 键盘；桌面(hover+fine, ≥1120)悬停折叠分支右侧飞出预览（`data-flyout="off"` 关闭） | Tree / NavMenu | ✅🧩 |
| 页面头 | `.ak-page-header` `__top __ns __title __bar` + `#firstHeading` | 面包屑 + 指示器；标题 8px 青条 + 英文副标 | SectionHeader | ✅ |
| 页面标签 | `.ak-page-tabs` + `#p-views` `#p-cactions` `#p-namespaces` | 下划线 + 选中角标；`--actions` 右对齐 | Tabs | ✅ |
| 内容区 | `.ak-body` `--flat` `.ak-body-foot` | 1px 卡片；最后编辑/版权 | Card | ✅ |
| 侧栏目录 | `.ak-toc` `__title __progress` + `data-auto-toc` | 粘性、scrollspy、阅读进度条 | ScrollProgress + SectionNav | ✅🧩 |
| 页脚 | `.ak-footer` `__inner __brand __col __bottom` | 反转底 + 顶部斜纹 + 水印 | Footer | ✅ |
| 回到顶部 | `.ak-fab` | | BackToTop | ✅🧩 |
| 抽屉 / 遮罩 | `.ak-drawer` `.ak-overlay` | 移动端侧栏 | BottomSheet | ✅🧩 |
| 跳转链接 | `.ak-skip` | a11y | | ✅ |
| 移动端 | ≤639 规则 | 页眉压缩、搜索折叠、表格横滚、浮动图取消 | | ✅ |

---

## L3 · 通用组件（components.css）

| 组件 | 类 | 变体 | 状态 | ReEnd 对照 |
|---|---|---|---|---|
| Button | `.ak-btn` | `--primary --contrast --outline --ghost --danger --link`；`--xs --sm --lg --xl --icon --block --skew --pill`；`.is-loading` `disabled`；`.ak-btn-group` | ✅ | Button |
| Tag / Badge | `.ak-tag` | `--sm --lg --outline --accent --accent-soft --yellow --info --success --warning --danger --danger-solid --new --inverse --skew --label`；`__dot __remove`；`.ak-badge --dot --accent` | ✅ | Badge / TacticalBadge |
| Chip（筛选） | `.ak-chip.is-active` | 选中角标 | ✅🧩 | FilterBar |
| Card | `.ak-card` | `--hover --selected --flat --inset --accent-top --accent-left --horizontal`；`__header __eyebrow __title __body __footer __media`；`.ak-card-grid` | ✅ | Card / HoloCard |
| Panel | `.ak-panel` | `__head --inverse __title __body`；`--collapsible` | ✅🧩 | TacticalPanel |
| Section heading | `.ak-heading` | `--stack --lg --underline`；`__title __en __aside` | ✅ | SectionHeader |
| Tabs | `.ak-tabs` `.ak-tab` `.ak-tabpanel` | `--pill --skew --vertical` | ✅🧩 | Tabs |
| Message | `.ak-message` | `--success --warning --danger --neutral --accent --banner --stripes` | ✅ | Alert / WarningBanner |
| Tooltip | `[data-ak-tip]` `.ak-tooltip` `.ak-term` | CSS-only + JS 增强 | ✅ | Tooltip |
| Popover | `.ak-popover` | | ✅🧩 | Popover |
| Dropdown / Menu | `.ak-dropdown` `.ak-menu` | `details/summary` 原生 | ✅ | Dropdown |
| Dialog | `.ak-dialog` `<dialog>` | `--sm --lg --full`；`__head __body __foot` | ✅🧩 | Dialog |
| Drawer / Overlay | `.ak-drawer --left/--right` `.ak-overlay` | | ✅🧩 | BottomSheet |
| Toast | `.ak-toasts` `.ak-toast` | `--success --warning --danger` + 进度条 | ✅🧩 | Toast |
| Progress | `.ak-progress` | `--sm --lg --yellow --success --danger --stripes --indeterminate --segmented`；`.ak-ring` | ✅ | Progress |
| Stat | `.ak-stat` `.ak-stat-row` | `--inline`；`__delta--up/--down` | ✅ | Stat |
| Skeleton / Spinner / Loader | `.ak-skeleton --text --rect --square --circle` `.ak-spinner` `.ak-loader` | | ✅ | Skeleton / DiamondLoader |
| Empty | `.ak-empty` `__icon __title __code` | | ✅ | EmptyState |
| Avatar | `.ak-avatar` | `--xs --sm --lg --xl --round --cut`；`__status`；`.ak-avatar-group` | ✅ | Avatar |
| Breadcrumb | `.ak-breadcrumb` | | ✅ | Breadcrumb |
| Pagination | `.ak-pagination` | | ✅ | Pagination |
| Timeline | `.ak-timeline` | `.is-done .is-active` | ✅ | Timeline |
| Stepper | `.ak-stepper .ak-step` | | ✅ | Stepper |
| Form | `.ak-field .ak-label .ak-help .ak-input .ak-select .ak-textarea .ak-input-group .ak-check .ak-switch .ak-slider .ak-number .ak-search` | `.is-invalid .is-valid --sm --lg` | ✅ | Input/Select/Checkbox/Switch/NumberInput |
| Table | `.ak-table` | `--striped --compact`；`th[aria-sort]` | ✅ | Table / TacticalTable |
| Accordion | `.ak-details` (`<details>`) | | ✅ | Accordion |
| Divider | `.ak-divider` | `--accent --stripes --text --vertical` | ✅ | Separator / ScanDivider |
| FAB | `.ak-fab` | | ✅🧩 | BackToTop |

未纳入（wiki 场景低优先）：OTP、日期选择、富文本编辑器、评分、文件上传（MW 自带 Special:Upload）、Cookie 同意、会话超时、Kanban、Pricing。需要时按同一令牌补充。

---

## L4 · 方舟组件（arknights.css）

### A. 装饰语言 → 见 01 §3

### B. 游戏数据组件

| 组件 | 类 | 数据来源 / 说明 | 状态 |
|---|---|---|---|
| 稀有度星 | `.ak-rarity > i` `--r1..r6 --white --sm --lg`；`.ak-rarity-img`（游戏原图） | CSS 星形；`data-rarity` 色轨 | ✅ |
| 稀有度色轨 | `[data-rarity=N]` → `--ak-r/--ak-r-text`；`.ak-r-text .ak-r-bg .ak-r-border .ak-r-bar .ak-r-chip .ak-r-swatch` | 官方色阶 | ✅ |
| 职业 / 分支 | `.ak-prof --sm --lg --xl --box --outline`；`.ak-subprof`；`.ak-prof-label`；`[data-prof]` 8 色 | `arts/profession_large_hub` `ui_sub_profession_icon_hub` | ✅ |
| 精英化 | `.ak-elite --lg`；`.ak-phase-tabs`（E0/E1/E2 选择器） | `arts/elite_hub` | ✅🧩 |
| 潜能 / 专精 | `.ak-potential` `.ak-spec` `--bare` | `arts/potential_hub` `arts/specialized_hub` | ✅ |
| 等级 / 信赖 | `.ak-level --badge` `.ak-trust` | | ✅ |
| 干员卡 | `.ak-op-card --sm --lg --rail` `__portrait __rarity __prof __elite __name __sub`；`.ak-op-grid`；`.ak-op-row` | 游戏干员列表卡：头像 + 左上星 + 左下职业 + 右下精英 + 稀有度色顶线 | ✅ |
| 道具 | `.ak-item --sm --lg --round --cut .is-disabled` `__count.is-short`；`.ak-item-list` `.ak-item-inline` | 稀有度色边框 + 黑底数量角标 | ✅ |
| 材料表 | `.ak-materials` `__label` | 阶段/等级 → 材料行 | ✅ |
| 技能 | `.ak-skill.is-selected` `__icon --auto --attack --hit --passive .is-locked` `__head __name __meta __desc __stats` | SP 类型 = 图标描边 + 底条色；选中 = 蓝框 + 角标（游戏 `selected_back`） | ✅ |
| SP 标签 | `.ak-sp --attack --hit --passive` `.ak-sp-trigger --auto` `.ak-sp-cost` `.ak-sp-init` | 游戏 `skill_sp_cost_bkg` 荧光绿 | ✅ |
| 技能等级选择 | `.ak-skill-levels`（1-7 + M1-3） | | ✅🧩 |
| 天赋 | `.ak-talent __name __req __desc` | | ✅ |
| 富文本 | `.ak-rt-*` / `.ba-*` | 见 01 §2.4 | ✅ |
| 属性面板 | `.ak-attrs --compact` `.ak-attr --accent __label __value` | Bender 数值 + overline 标签（EN + 中文） | ✅ |
| 键值表 | `.ak-kv --boxed` | 信息栏 | ✅ |
| 攻击范围 | `.ak-range --sm --lg` `style="--cols:N"` `i.on/.self/.off` | | ✅ |
| 模组 | `.ak-module __img __type __name __stage __mission` | SWO-X 等型号用展示字 | ✅ |
| 语音 | `.ak-voice __play.is-playing __title __lang __text __wave` | | ✅🧩 |
| 档案 | `.ak-dossier.is-locked[data-unlock]` `__title __unlock`；`.ak-redacted` | 未解锁：模糊 + 斜纹 + 条件 | ✅ |
| 剧情对话 | `.ak-dialogue` `dt/dd .narrator` | | ✅ |
| 关卡 | `.ak-stage --hard --ex --story` `__code __name __meta`；`.ak-stage-code --hard`；`.ak-sanity` | 关卡号用展示字 | ✅ |
| 敌人 | `.ak-enemy --boss --elite` `__img __code __name __level` | | ✅ |
| 势力 | `.ak-camp --lg --box` | `spritepack/ui_camp_logo` | ✅ |
| 活动 / 倒计时 | `.ak-event.is-live` `__banner __type __title __time`；`.ak-countdown` | | ✅🧩 |
| Breaking news | `.ak-news __label __text` | 游戏主界面横幅 | ✅ |
| Hero | `.ak-hero __eyebrow __title __bar __desc __side` | 官网风黑底 + 青斜块 + 网点 | ✅ |

### C. 与 ReEnd Signature 的对应关系

| ReEnd Signature | AKDS 对应 | 说明 |
|---|---|---|
| GlitchText | — （不采用） | 方舟无故障字美学 |
| DiamondLoader | `.ak-loader`（三竖条） | |
| TacticalPanel | `.ak-panel` + `.ak-panel__head--inverse` | |
| HoloCard | `.ak-card--hover` | 无辉光倾斜 |
| DataStream / CommandOutput | 📝 `.ak-terminal`（PRTS 终端日志块） | 规划 |
| TacticalBadge | `.ak-tag--label` / `.ak-tag--new` | |
| WarningBanner | `.ak-message--stripes` / `.ak-news` | |
| ScanDivider | `.ak-divider--stripes` | |
| CoordinateTag | `.ak-code-id` | |
| RadarChart | 📝 干员六维/属性雷达（Gadget） | |
| HUDOverlay | `.ak-brackets` + `.ak-watermark` | 只用于图片/立绘 |
| MissionCard | `.ak-stage` / `.ak-event` | |
| OperatorCard | `.ak-op-card` | 忠于游戏内卡片 |
| StatusBar | `.ak-header` | |
| MatrixGrid / FrequencyBars | `.ak-bg-grid` / `.ak-voice__wave` | |
| TacticalTable | `.ak-table` + `.wikitable` | |

---

## L5 · 页面模式（Patterns）

| 页面 | 结构 | 样例 |
|---|---|---|
| 干员页 | 顶部：立绘 + 身份栏（稀有度/职业/分支/标签/kv）+ 阶段选择 + 属性 + 范围 → 天赋 → 潜能 → 技能（等级选择 + 卡片 + 材料 Tabber）→ 模组 → 精英化 → 后勤 → 档案（Tabber + 锁）→ 语音 → 相关 → navbox | `preview/operator.html` |
| 设计系统 / 长文 | 卡片内容区 + 右侧粘性 TOC + 左侧栏 | `preview/index.html` |
| 首页 | Hero + Breaking news + 今日信息面板 + 亮点干员 op-grid + 活动 event 卡 + 近期新增 | 📝 |
| 列表 / 筛选页（干员一览） | Chip 筛选栏 + `.ak-op-grid` / `.wikitable.ak-sticky-head` | 📝 |
| 关卡页 | `.ak-stage` 头 + 地图 + 敌人 `.ak-enemy` 列表 + 掉落 `.ak-item-list` | 📝 |
| 剧情页 | `.ak-dialogue` + 分段 + 剧透 `.ak-redacted` | 📝 |
| 特殊页 / 编辑页 | OOUI/Codex 桥接令牌 + `.ak-body--flat` | 📝 |

## 命名与约定

- 前缀 `ak-`；BEM-lite：`.ak-block__elem--mod`；状态 `.is-*` 或 ARIA 属性。
- 数据属性驱动主题色：`data-rarity`、`data-prof`、`data-theme`。
- 组件不依赖 JS 也应可读（渐进增强）；JS 只做：主题、抽屉、TOC scrollspy、标签页、阶段/等级切换、Toast、Dialog。
- 所有尺寸用 rem/px 令牌，不写魔法数；颜色只引用令牌。
