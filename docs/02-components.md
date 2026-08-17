# AKDS · 组件清单与划分

> 按 **MediaWiki 皮肤** 的实际需要分层。每个组件给出：类名 · 用途 · 变体/状态 · 对应 MW DOM 或模板 · 状态（✅ 已实现 CSS / 🧩 需 JS/Gadget / 📝 规划）。

## 分层总览

```
L0  Tokens          令牌 / 主题 / Codex 桥接                         tokens.css
L1  MW Content      wikitext 产物样式（编辑者不需知道设计系统存在）  base.css
L2  Skin Chrome     皮肤骨架：黑色页眉/头图带/侧栏/页面头/TOC/页脚/移动端  skin.css
L3  Core            通用组件（纯 CSS，可写入模板/TemplateStyles）     components.css
L4  Arknights       方舟装饰 + 游戏数据组件                          arknights.css
L5  Patterns        页面模式：干员页/关卡页/首页/列表页              docs + preview
```

AKDS 是皮肤而不是 JS 组件库：组件 = **一段约定好的 HTML 结构 + 类名**。模板作者（Lua/wikitext）输出该结构即可，皮肤保证外观与主题。

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
| 表格 | `.wikitable` `.ak-striped .ak-compact .ak-dense .ak-borderless .ak-sticky-head` + `.ak-table-scroll` | th 底色 `--ak-bg-surface-2`、居中加粗；**加粗的 2px 底线只压「整行都是 th、且下一行是数据行」的真正表头行**（`tr:not(:has(td)):has(+ tr > td)` / `thead > tr:last-child`），PRTS 常见的竖排行头 th 只有普通 1px 线，与右侧 td 对齐；老浏览器退化为一律 1px | ✅ |
| 排序表头 | `.jquery-tablesorter th.headerSort*` | ⇅ ↑ ↓ 指示 | ✅ |
| 缩略图 / 图库 | `figure[typeof~=mw:File/Thumb]` `.thumb` `ul.gallery` | 1px 框 + 青色方块图注；弹性图库 | ✅ |
| 目录（内联） | `.toc` | 顶部 3px 青条卡片 | ✅ |
| 目录（皮肤） | `.ak-toc` | 宽屏右侧导轨 / 窄屏由二级吸顶栏拉下的浮层，见 L2 | ✅🧩 |
| 折叠 | `.mw-collapsible` + `.ak-collapse-box` | 盒式变体 | ✅ |
| 引用 | `sup.reference` `.references` `.reflist.ak-cols-2` | 目标高亮 | ✅ |
| 消息框 | `.mw-message-box-*` `.cdx-message` `.ambox` `.hatnote` | 左色条 + 浅底 | ✅ |
| 代码 | `pre` `code` `.mw-highlight` | inset 底 + 左青条 | ✅ |
| 引言 / 诗 | `blockquote` `.poem` | 左青条 surface-2 | ✅ |
| 分类 | `.catlinks` `.mw-normal-catlinks` `.mw-hidden-catlinks`（JS 加 `.ak-catlinks__label`） | 参考 fz.wiki：不再做芯片盒——树状线稿图标（CSS mask）+ overline 小标签「分类」+ 常显 1px 下划线的普通链接；`colon-separator` 的「：」由容器 `font-size:0` 吞掉（无 JS 亦可），`tidyCatlinks()` 再把「隐藏分类」文字包成标签；`a.mw-redirect` 斜体 | ✅ |
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

| 组件 | 类 / MW 数据 | 说明 | 状态 |
|---|---|---|---|
| 页眉 | `.ak-header` `__logo __wordmark __search __tools` `__screen __tool __tool-label __burger __burger-icon` + `.ak-nav-cb` | 56px 粘性；**两套主题下都是黑色「终端」顶栏**（官网导航栏 / 游戏主界面顶栏 / 档案页顶部黑边），配色只读 `--ak-chrome-*`（`.ak-header` 内把 `--ak-fg / --ak-bg-* / --ak-border* / --ak-accent` 重映射过去，子组件自动跟随；旧的 `--dark` 变体已并入默认）。构件：`rgba(8,9,10,.9)` 底 + 毛玻璃 + 1px 亮线——这是一块压在头图顶端之上的**均匀**黑玻璃（头图从 y=0 铺起，见下一行），可读性由玻璃 alpha 保证，横向 / 纵向都不做渐变；`::before` 右侧半调网点场（`--ak-chrome-texture`）；`--ak-chrome-image` 顶栏角饰层（画在玻璃之上，只放深色低对比素材）；`__wordmark small` 标语用活动主色；工具悬停变活动主色；搜索触发器 = 32px 深色图标框 + 矩形浅条（打开时边框与图标框都变主色）；外观开关选中项 = 主色实底（亮暗一致，不反色）；`.ak-header a:visited { color: inherit }`（黑底上不走紫色已访问色）。**主行是与 `.ak-layout` 对齐的三列网格** `var(--ak-sidebar-w) minmax(0,1fr) auto`：品牌盖着侧栏列（无右侧分隔线）、搜索从正文列左缘起（≤560px，与面包屑 / 标题左缘同线）、工具靠右盖着目录列——页眉是三列各自的「列头」；1680 容器与布局同为 `border-box`，超宽时左右缘对齐。**页眉不放站点级主导航**：那 8 项与侧栏「菜单 › 通用」1:1 重复、没有哪个宽度只靠它、两处 active 打架，导航只由侧栏承担（MW 的 `data-portlets-first` 只在侧栏渲染）。**<1120**：主行回到 flex，只留 品牌 / 搜索 / ≡，工具（外观 / 通知 / 用户）在 `.ak-header__screen`（桌面 `display:contents`，窄屏 = ≡ 拉下、贴主行右下沿的 320px 黑色卡片，`position:absolute` 于 `.ak-header__inner`；纯 CSS 开合 `.ak-nav-cb` + `label.ak-header__burger`，不锁页面滚动；JS 补 Esc / 选中锚点 / 点卡片外 / 回到桌面宽度收起）。DOM 只一份，Echo / `#p-personal` id 不重复 | ✅ |
| 头图 / 主题接口 | `.ak-keyart` `__inner` + `tokens.css §2d` 的 `--ak-theme-accent --ak-chrome-* --ak-keyart-* --ak-canvas-* --ak-logo-image` | `.ak-layout` 之上的通栏画（mustache 恒输出，`--ak-keyart-h: 0` 时不占位）：盒子上探一个页眉高（<1400 连二级栏）、`padding-top` 把内容压回页眉之下，于是画从页面顶端铺起、页眉玻璃压在它上面，黑框 + 画是一整块而不是两段裁切；`--ak-keyart-h` 是页眉之下可见的高度，`-position` / `-size` 相对整块算；底部按 `-fade` 渐隐进画布（`min(-fade, -h)` 兜住 0 高时不往页眉后画）；`-bg` 默认透明；`body.skin-akds` 背景叠 `--ak-canvas-image`。活动主题（Gadget / Common.css）只覆盖变量，示例 `preview/demo-theme.css`（侧栏 / 展示页「示例活动主题」按钮）。url() 须写绝对地址（Chromium 按使用处解析自定义属性里的相对 url） | ✅ |
| 搜索（悬浮面板） | 触发器 `button.ak-search-trigger`（有 JS 时替换页眉里的 `form.ak-header__search`；无 JS 保留真表单）· 面板 `.ak-palette-backdrop` + `.ak-palette[role=dialog]` `__head( __back __icon __chip form.__form>#searchInput __clear __close __loading )` `__body>__viewport>__list[role=listbox]>__group>__label+__item[role=option]>__link( __thumb __text( __title __desc ) __meta )[+__actions]` `__empty( __empty-title __empty-desc __shortcuts>__shortcut )` `__foot( __foot-left __hints )` · 状态 `.has-query .has-mode .is-loading .is-closing`；核心 `search-palette.js`（与预览共用），数据源 `skin/resources/search-providers.js` / `preview/search-mock.js` | 参考 Citizen 的 Command Palette（starcitizen.tools）：搜索不再是页眉里的一条输入框，而是居中悬浮的「终端窗口」——直角、顶部 3px 青条、56px 输入行、结果区高度过渡、`--ak-bg-surface-2` 键位页脚；高亮行 = 左 2px 青条 + 淡青底（与侧栏当前项 / 菜单项同一语言）；命令模式用斜切 chip；页眉真表单被**原样搬进面板**（`#searchform #searchInput` 保留 → Gadget / 无 JS 提交不受影响）。开：点触发器 / 手机图标 `.ak-header__search-toggle` / `/`、Ctrl(⌘)K、accesskey F；关：Esc（有字先清空 → 模式中返回 → 关闭）/ 遮罩 / 关闭按钮 / 选中。空态 = 最近访问（localStorage `akds-recent`）+ 提示 + 快捷入口（取侧栏首个门户 `#p-navigation`；预览取 `#MenuSidebar`「通用」组）；有字 = 分组结果 + 末尾固定「全文搜索」行，首项自动高亮、↵ 打开、⇧↵ 全文、⌘/Ctrl↵ 新标签；结果未到就回车 → MW 原生 Go。`/` 列命令，`>` 动作 `#` 分类 `@` 用户 `~` 文件 进入模式（退格空输入 / ← / 返回键退出）。行内动作只给最近访问一个「移除 ×」（始终占位、高亮时可见，不会让右侧元数据跳动）；**不放** Citizen 那种每行「编辑」——面板里唯一的主动作是「打开」。a11y：`role=dialog aria-modal`、输入框 `role=combobox aria-activedescendant`、`aria-live` 播报条数、Tab 在面板内循环、关闭后焦点回到触发器。≤639：8px 内边距的全宽卡片，右上 Esc 换成「取消」，触屏隐藏键位提示 | ✅🧩 |
| 主题切换 | `.ak-theme-toggle` (os/day/night)，外面包一层 `.ak-header__tool` + `.ak-header__tool-label`（「外观」，只在窄屏面板显示） | 写入 `mw.user.clientPrefs`；<1120 变成面板里的「外观」行，三个按钮加大到 40×32 | ✅🧩 |
| 通知 / 用户菜单 | `.ak-badge` `.ak-header__bell` `.ak-header__user` + `#p-personal` | Echo 徽标；<1120 变成面板里的「通知」行（徽标靠右）与用户行（`#p-personal` 的 `.ak-menu` 就地展开，不再浮出） | ✅ |
| 侧栏 | `.ak-sidebar` `__panel(#mw-panel)` `.ak-portlet` `--grid --collapsible` + `#p-navigation` `#p-tb` | 粘性；<1120 抽屉（由二级吸顶栏「菜单」打开；收起时 `visibility:hidden`，不进 Tab 序、阴影也不会从屏幕左缘漏进来）；网格快捷入口；门户折叠状态记忆 | ✅🧩 |
| 侧栏多层导航 | `li.ak-tree__branch(.is-open .is-current-path .is-peek)` `> .ak-tree__label + button.ak-tree__toggle + ul.ak-tree__list`；`.ak-flyout` `__title` | 由 `sidebar-tree.js` 增强 `.ak-sidebar` 内任意 `li > ul`（含 PRTS `#MenuSidebar` 的 `p / ul / li > b` 原始输出）：任意深度树形展开、缩进导轨、当前页路径自动展开高亮、`localStorage` 记忆、← → 键盘；桌面(hover+fine, ≥1120)悬停折叠分支右侧飞出预览（`data-flyout="off"` 关闭） | ✅🧩 |
| 页面头 | `.ak-page-header` `__top __ns __title __bar` + `#firstHeading` | 面包屑 + 指示器；标题 8px 青条 + 英文副标 | ✅ |
| 页面标签 | `.ak-page-tabs` + `#p-views` `#p-cactions` `#p-namespaces` | 下划线 + 选中角标；`--actions` 右对齐 | ✅ |
| 内容区 | `.ak-body` `--flat` `.ak-body-foot` | 1px 卡片；最后编辑/版权 | ✅ |
| 二级吸顶栏 | `.ak-local-nav` `__btn __menu __toc __chevron` | 仅 <1400 出现的页眉第二行（48px）：左「菜单」拉出侧栏抽屉（仅 <1120）、右「本页目录」拉下目录浮层。向下滚动时 `<html>` 加 `.ak-condensed`，页眉整体上移 `--ak-header-h`，主行滑出、这条贴顶；向上滚 / 回到顶部（<120px）再展开。参考 VitePress LocalNav | ✅🧩 |
| 目录 | `.ak-toc` `__inner __title __top __progress __list` + `.ak-toc-cb` | DOM 上紧跟 `.ak-page-header`，一份 DOM 两种形态：**≥1400** 绝对定位进 `.ak-main` 右侧导轨（`__inner` 粘性 + scrollspy + 阅读进度条）；**<1400** 变成二级吸顶栏拉下的浮层（顶边跟随吸顶栏下沿，首项 `__top`「回到顶部」，限高内滚，≤639 拉满可用宽度）。开合是纯 CSS：`.ak-toc-cb` checkbox 在二级栏里，浮层与它非兄弟节点故用 `:has()` 桥接，`@supports not selector(:has(*))` 时退回正文流内的静态卡片 | ✅🧩 |
| 页脚 | `.ak-footer` `__inner __brand __col __bottom __bottom-text __icons` + `#footer-places` `#footer-icons` | 与页眉同为「框」：两套主题下都黑，读 `--ak-chrome-bg-solid / --ak-chrome-fg`（不再读 `--ak-bg-inverse`——那是反白组件用的，暗色下是白，跟随系统时页脚曾因此变白）；顶部活动主色斜纹 + 水印；底栏左文字、右 `$wgFooterIcons` 徽章（结构同 Vector/Citizen：`ul#footer-icons > li#footer-*ico > a.cdx-button > img`）——徽章原样显示：26px 高、无底板、不灰度、不降透明、无悬停效果（只留键盘焦点描边）。通用徽章（MW / SMW / CC BY-NC-SA）建议用 `preview/assets/badge/mono/` 的**白描版**（白色单色、透明底，由官方矢量重着色——游戏白色线稿图标的语言，starcitizen.tools 的做法），站点自己的徽章（Mooncell / HoRain）就用原图；顺序 = `$wgFooterIcons` 键序（预览：Mooncell · HoRain · MW · SMW · CC）。仍是原彩色通用徽章的站点给 `ul` 加 `.ak-footer__icons--plate`（浅色底板）；右侧为 `.ak-fab` 让位 | ✅ |
| 回到顶部 | `.ak-fab` | 仅 ≥1400 显示（右下浮动）；<1400 隐藏，改由目录浮层首项 `.ak-toc__top` 承担——手机上浮动按钮太挡视野。**注意**：只要页面有元素横向溢出，移动端 Chrome 会把布局视口撑宽，fixed 元素就会被推到可见区外——见 §命名与约定 | ✅🧩 |
| 抽屉 / 遮罩 | `.ak-drawer` `.ak-overlay` | 移动端侧栏 | ✅🧩 |
| 跳转链接 | `.ak-skip` | a11y | ✅ |
| 移动端 | <1120 / ≤639 规则 | <1120：侧栏成抽屉、页眉回到 flex，外观 / 通知 / 用户收进 ≡ 拉下的卡片（见「页眉」）；≤639：页眉压缩、搜索收成图标按钮（打开同一个悬浮面板）、表格横滚、浮动图取消 | ✅ |

---

## L3 · 通用组件（components.css）

| 组件 | 类 | 变体 | 状态 |
|---|---|---|---|
| Button | `.ak-btn` | `--primary --contrast --outline --ghost --danger --link`；`--xs --sm --lg --xl --icon --block --skew --pill`；`.is-loading` `disabled`；`.ak-btn-group` | ✅ |
| Tag / Badge | `.ak-tag` | `--sm --lg --outline --accent --accent-soft --yellow --info --success --warning --danger --danger-solid --new --inverse --skew --label`；`__dot __remove`；`.ak-badge --dot --accent` | ✅ |
| Chip（筛选） | `.ak-chip.is-active` | 选中角标 | ✅🧩 |
| Card | `.ak-card` | `--hover --selected --flat --inset --accent-top --accent-left --horizontal`；`__header __eyebrow __title __body __footer __media`；`.ak-card-grid` | ✅ |
| Panel | `.ak-panel` | `__head --inverse __title __body`；`--collapsible` | ✅🧩 |
| Section heading | `.ak-heading` | `--stack --lg --underline`；`__title __en __aside` | ✅ |
| Tabs | `.ak-tabs` `.ak-tab` `.ak-tabpanel` | `--pill --skew --vertical` | ✅🧩 |
| Message | `.ak-message` | `--success --warning --danger --neutral --accent --banner --stripes` | ✅ |
| Tooltip | `[data-ak-tip]` `.ak-tooltip` `.ak-term` | CSS-only + JS 增强 | ✅ |
| Popover | `.ak-popover` | | ✅🧩 |
| Dropdown / Menu | `.ak-dropdown` `.ak-menu` | `details/summary` 原生 | ✅ |
| Dialog | `.ak-dialog` `<dialog>` | `--sm --lg --full`；`__head __body __foot` | ✅🧩 |
| Drawer / Overlay | `.ak-drawer --left/--right` `.ak-overlay` | | ✅🧩 |
| Toast | `.ak-toasts` `.ak-toast` | `--success --warning --danger` + 进度条 | ✅🧩 |
| Progress | `.ak-progress` | `--sm --lg --yellow --success --danger --stripes --indeterminate --segmented`；`.ak-ring` | ✅ |
| Stat | `.ak-stat` `.ak-stat-row` | `--inline`；`__delta--up/--down` | ✅ |
| Skeleton / Spinner / Loader | `.ak-skeleton --text --rect --square --circle` `.ak-spinner` `.ak-loader` | | ✅ |
| Empty | `.ak-empty` `__icon __title __code` | | ✅ |
| Avatar | `.ak-avatar` | `--xs --sm --lg --xl --round --cut`；`__status`；`.ak-avatar-group` | ✅ |
| Breadcrumb | `.ak-breadcrumb` | | ✅ |
| Pagination | `.ak-pagination` | | ✅ |
| Timeline | `.ak-timeline` | `.is-done .is-active` | ✅ |
| Stepper | `.ak-stepper .ak-step` | | ✅ |
| Form | `.ak-field .ak-label .ak-help .ak-input .ak-select .ak-textarea .ak-input-group .ak-check .ak-switch .ak-slider .ak-number .ak-search` | `.is-invalid .is-valid --sm --lg` | ✅ |
| Kbd | `.ak-kbd`（`.ak-search__kbd` 为其绝对定位变体） | 键帽：直角 1px 边、底边略重、mono 10px；用于快捷键提示 / 触发器右侧 / 面板页脚 | ✅ |
| Table | `.ak-table` | `--striped --compact`；`th[aria-sort]` | ✅ |
| Accordion | `.ak-details` (`<details>`) | | ✅ |
| Divider | `.ak-divider` | `--accent --stripes --text --vertical` | ✅ |
| FAB | `.ak-fab` | | ✅🧩 |

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

---

## L5 · 页面模式（Patterns）

| 页面 | 结构 | 样例 |
|---|---|---|
| 干员页 | 顶部：立绘 + 身份栏（稀有度/职业/分支/标签/kv）+ 阶段选择 + 属性 + 范围 → 天赋 → 潜能 → 技能（等级选择 + 卡片 + 材料 Tabber）→ 模组 → 精英化 → 后勤 → 档案（Tabber + 锁）→ 语音 → 相关 → navbox | `preview/operator.html` |
| 设计系统 / 长文 | 卡片内容区 + 右侧粘性 TOC（<1400 收为标题下折叠条）+ 左侧栏 | `preview/index.html` |
| 首页 | Hero + Breaking news + 今日信息面板 + 亮点干员 op-grid + 活动 event 卡 + 近期新增 | 📝 |
| 列表 / 筛选页（干员一览） | Chip 筛选栏 + `.ak-op-grid` / `.wikitable.ak-sticky-head` | 📝 |
| 关卡页 | `.ak-stage` 头 + 地图 + 敌人 `.ak-enemy` 列表 + 掉落 `.ak-item-list` | 📝 |
| 剧情页 | `.ak-dialogue` + 分段 + 剧透 `.ak-redacted` | 📝 |
| 特殊页 / 编辑页 | OOUI/Codex 桥接令牌 + `.ak-body--flat` | 📝 |

## 命名与约定

- 前缀 `ak-`；BEM-lite：`.ak-block__elem--mod`；状态 `.is-*` 或 ARIA 属性。
- 数据属性驱动主题色：`data-rarity`、`data-prof`、`data-theme`。
- 组件不依赖 JS 也应可读（渐进增强）；JS 只做：主题、抽屉、TOC scrollspy、页眉收起、标签页、阶段/等级切换、Toast、Dialog、搜索面板。目录开合是纯 CSS，JS 只补「点击浮层外 / Esc / 跳转后关闭」这类收尾；搜索面板是纯 JS 组件，但**页眉里先渲染的是真表单**，JS 到了才换成触发器并把表单搬进面板——无 JS 照常提交到 Special:Search。
- 所有尺寸用 rem/px 令牌，不写魔法数；颜色只引用令牌。
- **`width:100%` / `min-width` 的组件必须自带 `box-sizing: border-box`**（MediaWiki 没有全局 box-sizing 重置）。否则 padding 会在窄屏撑破容器；而只要有任何元素横向溢出，移动端 Chrome 就会把布局视口撑宽、整页缩小，`.ak-fab` 这类 fixed 元素被推到可见区之外——`.ak-input / .ak-select / .ak-textarea / .ak-stat / .ak-blue-band` 已处理，新组件照做。
