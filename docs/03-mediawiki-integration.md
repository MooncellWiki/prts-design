# AKDS · MediaWiki 皮肤落地指南

> 目标站点：prts.wiki · MediaWiki 1.43.5 · 现默认 Vector 2022，移动端 MobileFrontend + Minerva
> 已装扩展（与皮肤相关）：TemplateStyles · Gadgets · Widgets · TabberNeue · Cargo · SemanticMediaWiki · DPL3 · Echo · CodeMirror · WikiEditor · UniversalLanguageSelector · MsUpload · PageImages · TextExtracts
> 未装：DarkMode（皮肤自带明暗）· Popups · VisualEditor

## 1. 架构

```
skins/AKDS/
├── skin.json                    ← 注册皮肤 + ResourceLoader 模块 + clientPrefs
├── templates/
│   └── skin.mustache            ← 骨架（SkinMustache，无需 PHP）
├── resources/
│   ├── fonts.css                ← = src/fonts.css（@font-face，scripts/fetch-fonts.py 生成）
│   ├── fonts/                   ← = src/fonts/（官网同源 Novecento Sans Wide · Bender；OFL 的 Noto Sans SC 101 片 · Oswald · Chakra Petch · JetBrains Mono；≈4.9MB）
│   ├── tokens.css               ← = src/tokens.css
│   ├── base.css                 ← = src/base.css
│   ├── components.css           ← = src/components.css
│   ├── arknights.css            ← = src/arknights.css
│   ├── skin.css                 ← = src/skin.css
│   ├── utilities.css            ← = src/utilities.css
│   ├── skin.js                  ← 主题切换 / 抽屉 / TOC scrollspy / 标签页 / toast
│   └── images/                  ← 职业/精英/稀有度等白色线稿（或走 File: 命名空间）
└── i18n/{en,zh-hans}.json
```
`skin/` 目录已提供 `skin.json` 与 `skin.mustache` 骨架，`resources/` 用符号链接或构建脚本从 `src/` 同步。

## 2. ResourceLoader 模块划分

| 模块 | 内容 | 加载 |
|---|---|---|
| `skins.akds.fonts` | fonts.css（121 条 `@font-face`：Novecento Sans Wide + Bender（官网同源）+ Noto Sans SC 101 片 + Oswald + Chakra Petch + JetBrains Mono，`font-display: swap`）| **所有页面**，`styles` 首位。独立成模块是为了能整体关掉（用户偏好 / Gadget / 低带宽），关掉后 `tokens.css` 的字体链自然退到装机 / 系统字。RL 只重写 `url()` 路径不内联（没写 `@embed`），浏览器按 `unicode-range` 只取用到的片；MW 上要过一遍 CSSMin 后确认 `unicode-range` 未被改动 |
| `skins.akds.tokens` | tokens.css | **所有页面**，`<head>` 顶部（`skin.json` `SkinStyles`/`styles`） |
| `skins.akds.styles` | base.css + skin.css + components.css + arknights.css + utilities.css | 所有页面 |
| `skins.akds.js` | skin.js（`mw.user.clientPrefs`、抽屉、TOC、标签页、data-bind）+ sidebar-tree.js + search-palette.js（悬浮搜索面板核心）+ search-providers.js（MW 数据源）；依赖 `mediawiki.api` | 所有页面（defer）。面板核心 ≈ 35KB 未压缩（含注释；gzip ≈ 11KB），可拆成独立模块在触发器 hover/focus 时 `mw.loader.using` 预取（Citizen 做法） |
| `skins.akds.mobile` | 移动端追加（若同时供 Minerva 使用则改为 `skinStyles` 注入） | 按 target |

`skin.json` 关键项：
```json
"ValidSkinNames": { "akds": { "class": "SkinMustache", "args": [{
  "name": "akds", "template": "skin",
  "responsive": true,
  "bodyClasses": ["skin-akds"],
  "styles": ["skins.akds.fonts", "skins.akds.tokens", "skins.akds.styles"],
  "scripts": ["skins.akds.js"],
  "clientPrefEnabled": true,
  "wrapSiteNotice": true, "toc": false
}]}},
"ClientPreferences": { "skin-theme": { "options": ["os","day","night"], "default": "os" } }
```
`toc:false` + 自己渲染 `data-toc`（1.40+ 提供 `data-toc.array-sections`），实现右侧粘性目录。

**窄屏（<1400）参考 VitePress 的 LocalNav**：页眉长出第二行 `.ak-local-nav` 吸顶栏，左「菜单」拉出侧栏抽屉、右「本页目录」拉下同一个 `aside.ak-toc`（它此时 `position:fixed`，顶边贴着吸顶栏下沿）。向下滚动时 `skin.js` 给 `<html>` 加 `.ak-condensed`，页眉整体 `translateY(-56px)`，品牌 / 搜索 / 工具那一行滑出视口，只留 48px 的二级栏贴顶；向上滚或回到顶部再展开。

- 开合本身是纯 CSS（`.ak-toc-cb` + `label.ak-local-nav__toc`），**无 JS 也能开合**。两者非兄弟节点：`skin.js` 把 checkbox 状态镜像到 `html.ak-toc-open`（浮层显示的主路径，国产手机浏览器 / 旧 WebView 没有 `:has()` 也是真浮层），无 JS 时由 `body:has(...)` 桥接；既无 JS（`html.client-nojs`）又不支持 `:has()` 才 `@supports` 兜底为正文流内的静态卡片。JS 另补「锁页面滚动 / 点击浮层外 / Esc / 跳转后 / 回到 ≥1400 关闭」和页眉收起。
- 浮层宽高锁死（VitePress LocalNavOutlineDropdown 同）：360px 定宽（≤639 拉满），限高用 `100dvh` 算到视口底——`100vh` 在手机上是地址栏收起后的「最大视口」，浮层底会被地址栏 / 工具栏盖住又不出内滚。
- **滚动锁** `html.ak-scroll-lock`（抽屉与目录浮层共用，JS 按持有者计数；`window.akdsScrollLock(owner, on)`）：`overflow:hidden` 不改滚动位置；有实体滚动条时同时写 `scrollbar-gutter:stable` 占位免得页面左右抖；不认 `scrollbar-gutter` 的老桌面浏览器退回拦 wheel / touchmove / 翻页键；iOS 另拦 touchmove（`overflow:hidden` 拦不住触摸滚动）。参考 VitePress `useBodyScrollLock`。
- 点 `label` 浏览器会再向 checkbox 派发一次 click，写「点击外部关闭」时必须放行 `.ak-toc-cb`，否则一点就关。
- **不要**改成角落 FAB + 侧边抽屉：按钮与面板方位割裂、<1120 时与左侧侧栏抽屉语义打架，还要跟 `.ak-fab`（回到顶部）抢屏幕角落。

**页眉主行（≥1120）是与 `.ak-layout` 对齐的三列网格** `var(--ak-sidebar-w) minmax(0,1fr) auto`（`gap` 同为 `--ak-gutter`）：品牌盖着侧栏列，搜索从正文列左缘起（≤560px，与面包屑 / 标题左缘同一条线），工具靠右盖着目录列。**页眉不放站点级主导航**——`MediaWiki:Sidebar` 首个门户（`data-portlets-first`）只在侧栏渲染一次：那 8 项与侧栏「通用」组 1:1 重复、没有哪个宽度上「顶栏可见而侧栏不可见」、顶栏下划线与侧栏青条两处 active 还会打架，导航只由侧栏承担。

- 页眉 / 二级栏 / 页脚这几个 1680 容器与 `.ak-layout` 同为 `box-sizing:border-box`——否则超过 1680+2·gutter 后页眉比布局宽 48px，品牌与侧栏左缘差一个 gutter。≥1680 的 `--ak-sidebar-w / --ak-toc-w: 268px` 覆盖写在 `:root` 上，页眉网格与布局共用。
- `.ak-layout--reading`（居中版式）下页眉列与正文列不再对齐；目前没有页面用它，若启用需另给页眉一套列宽。

**窄屏（<1120）页眉主行**回到 flex，只留 品牌 / 搜索（≤639 收成图标）/ ≡。工具（外观切换 / 通知 / 用户菜单）都包在 `.ak-header__screen` 里 —— 桌面它 `display:contents`，子项直接参与主行网格；窄屏它变成 ≡ 拉下、贴主行右下沿的 320px 卡片（`position:absolute` 于 `.ak-header__inner`，`top:100%`，盖住二级栏；不再是全屏面板——里面只有「外观 / 通知 / 用户」三行）。

- 开合纯 CSS：`input.ak-nav-cb` + `label.ak-header__burger`（三条线 → ×），checkbox 在 DOM 上必须排在卡片与汉堡之前才能用 `~` 联动；不锁页面滚动，卡片自己可滚（`max-height: 100dvh − 页眉高`）。**无 JS 也能开合**；JS 只补 Esc / 选中页内锚点 / 点卡片外（放行 `.ak-nav-cb`，同目录浮层）/ 回到 ≥1120 时收起，以及页眉收起逻辑在卡片开着时不动。
- DOM 只有一份：Echo 徽标（`#pt-notifications-*`）、`#p-personal`、`.ak-theme-toggle` 都不用复制 —— 桌面和卡片是同一批节点换了布局。主行 DOM 顺序固定为 `logo · search · search-toggle · nav-cb · screen[tools] · burger`，Tab 顺序与视觉一致（品牌 → 搜索 → 工具）。
- 二级栏「菜单」（侧栏抽屉 = 本站唯一的导航）与主行 ≡（外观 / 账户）分工明确，两个入口互不重复。

## 3. skin.mustache 结构 ↔ CSS 类

```
<div class="ak-skip">…
<header class="ak-header"> .ak-header__inner
   a.ak-header__logo{{data-logos}}
   form.ak-header__search{{data-search-box}}   ← 无 JS 的真表单；有 JS 时被 search-palette.js 换成 button.ak-search-trigger，表单本身搬进悬浮面板（见 §3.3）
   button.ak-header__search-toggle（≤639 图标）
   input.ak-nav-cb#ak-nav-toggle                ← <1120 工具卡片开关（纯 CSS）；必须排在下面两个之前
   .ak-header__screen#ak-nav-screen             ← 桌面 display:contents；<1120 = ≡ 拉下、贴主行右下沿的卡片（页眉不放主导航：MediaWiki:Sidebar 首个 portlet 只在侧栏渲染成 .ak-portlet--grid）
      .ak-header__tools [.ak-header__tool > .ak-header__tool-label + .ak-theme-toggle][{{data-portlets.data-notifications}}]
         .ak-dropdown.ak-header__user-menu > details > summary.ak-header__user + .ak-menu.ak-header__user-card( .ak-menu__head{{username}} nav.ak-menu__group#p-user-interface-preferences{{data-user-interface-preferences}}「界面设置」 nav.ak-menu__group#p-personal{{data-user-menu}}「个人工具」 )
            ← 语言切换（ULS）在「界面设置」组里，侧栏不再渲染 Languages
   label.ak-header__burger[for=ak-nav-toggle]   ← 三条线 → ×，仅 <1120 显示；主行不放侧栏抽屉的入口（那个在二级栏）
   .ak-local-nav   ← 页眉第二行「二级吸顶栏」，仅 <1400 显示（CSS 控制，服务端恒输出）
div.ak-keyart > .ak-keyart__inner   ← 头图带：恒输出，--ak-keyart-h 为 0 时不占位；活动主题设 --ak-keyart-image / -h 即出现（§3.5）；画从页面顶端铺起、页眉玻璃压在它上面（CSS 负外边距，DOM 顺序不变）
      button.ak-local-nav__menu（开侧栏抽屉）| input.ak-toc-cb + label.ak-local-nav__toc[for]（开目录浮层，纯 CSS）
      （aside.ak-toc 首项 a.ak-toc__top「回到顶部」仅 <1400 显示，届时 .ak-fab 隐藏）
<div class="ak-layout">
   aside.ak-sidebar {{#data-portlets-sidebar}} .ak-portlet(.ak-portlet--grid for first) …
   main.ak-main#content        ← position:relative + 右内边距预留目录导轨（.ak-layout 只有侧栏/主列两列）
      header.ak-page-header  .ak-page-header__top( [breadcrumb from {{html-subtitle}}] {{html-indicators}} )
         .ak-page-header__row  h1#firstHeading {{{html-title}}} + .ak-page-tools   ← 标题行：h1 + 页面动作簇（Citizen 式，见 02 §L2「页面动作簇」）
            ul.ak-page-tabs#p-associated-pages{{data-portlets.data-associated-pages}}  ul.ak-page-tabs#p-views{{data-portlets.data-views}}（watch / unwatch 从 actions 搬进 views）  [.ak-page-tools__variants{{data-variants}}]
            .ak-page-tools__more > details > summary.ak-page-tools__btn「⋯ 更多」+ .ak-menu.ak-page-tools__card(
               nav.ak-menu__group#p-cactions{{data-actions}}  nav.ak-menu__group#p-tb{{data-toolbox}} )
               ← 工具箱不再进侧栏：像 Citizen `SkinCitizen::extractPageToolsFromSidebar()` 那样从 data-portlets-sidebar.array-portlets-rest 里按 id `p-tb` 拆出交给 PageTools。
                 其中 specialpages / upload 两项是站点级的，不进「更多」——同 Citizen（SkinHooks::moveUploadToSiteTools() + addSiteTools()）进侧栏站点导航：
                 在 SidebarBeforeOutput 里从 $sidebar['TOOLBOX'] 取出（upload 由 MW 按权限决定是否存在，取不到就不渲染），MenuSidebar 模式渲染成 #MenuSidebar 之后的无标题门户 nav#p-site-tools
                 （紧贴上一组，视觉上是「管理与编辑」的延续），MediaWiki:Sidebar 模式追加到首个门户。
                 `$wgArknightsShowPageTools` 只控制 views / actions 的可见性，「更多」里的工具箱不受它影响（同 Citizen has-overflow 独立于 is-visible）
      aside.ak-toc#ak-toc      ← 目录：DOM 上属于页面、紧跟标题（≥1400 抬进右侧导轨，<1400 变成二级栏拉下的浮层）
         a.ak-toc__top「回到顶部」（仅 <1400）
         .ak-toc__inner  .ak-toc__title#ak-toc-label + .ak-toc__progress > i + ul.ak-toc__list[data-toc] ← 由 data-toc 或 skin.js 生成
      div.ak-body#bodyContent  {{{html-site-notice}}} {{{html-user-message}}} .mw-body-content{{{html-body-content}}}
         ul.ak-body-foot#footer-info {{#data-footer.data-info}}{{#array-items}} li#footer-info-lastmod / -copyright
      {{{html-categories}}}   ← div#catlinks（样式见 base.css「Category links」；skin.js tidyCatlinks() 去冒号）
<footer class="ak-footer">
   .ak-footer__inner   .ak-footer__brand | .ak-footer__col > h4{{msg-akds-footer-about}} + ul#footer-places {{#data-footer.data-places}}{{#array-items}}
   .ak-footer__bottom  .ak-footer__bottom-text | ul.ak-footer__icons#footer-icons {{#data-footer.data-icons}}{{#array-items}} li#footer-copyrightico / -poweredbyico / …
```
Portlet 渲染用 `Skin::getPortletsTemplateData()` 输出的 `html-items`（只含 `<li>`，mustache 负责包 `<ul>`），外层类由 mustache 加；`li.selected`（MW 原生类名）在动作簇里只留给读屏器（sr-only，不是 `display:none`——accesskey 仍可用）：当前命名空间页签「页面」与「阅读」只在不是当前态时才是动作（讨论页上的「页面」、历史页上的「阅读」）；diff / oldid 页 body 仍是 `action-view`，要像 Citizen 那样用 `.action-view:has(.diff, .mw-revision) #ca-view` 把「阅读」放回来。views / associated-pages 核心不给 `icon` 键，图标要皮肤自己映射（talk → speechBubbles、history → history、edit / ve-edit → edit、viewsource → wikiText 或 editLock、view → eye；讨论页上的命名空间页签换 arrowPrevious 表示返回）。

**注意 `data-footer.*` 与门户不同**：核心 `SkinComponentFooter::formatFooterDataForCurrentSpec()` 会剥掉 `html-items` / `label` / `class`，只留下 `id`、`className`、`array-items[{id, html}]`（见 [Manual:SkinMustache.php#DataFooter](https://www.mediawiki.org/wiki/Manual:SkinMustache.php)），所以页脚三处必须像 Vector `Footer__row.mustache` 一样写成 `{{#array-items}}<li id="{{id}}">{{{html}}}</li>{{/array-items}}`，用 `{{{html-items}}}` 会渲染成空。

### 3.1 侧栏与 PRTS 现网的多层菜单（#MenuSidebar）

现网 prts.wiki（Vector legacy）的侧栏**不是** `MediaWiki:Sidebar` 门户，而是一段由 wikitext 生成、放在页面末尾的 `div#MenuSidebar`，再由内联脚本在 `DOMContentLoaded` 时移入 `#mw-panel`（并把 `#p-tb ul` 的内容复制进 `#MSToolbox`、删掉其余门户）。其结构为：

```
div#MenuSidebar
  ul > li > a                       ← 无标题的首组（首页 / 复制短链接 / 支持我们 …）
  p  分组标题（热门页面 / 菜单 / 探索 / 管理与编辑 / Languages / 工具#vmsTB）
     ← 末尾两组在新皮肤下退役：Languages（三个 onclick 内联脚本链接）→ 语言切换统一在页眉用户菜单「界面设置」（ULS，#p-user-interface-preferences）；
       工具#vmsTB / #MSToolbox → 工具箱整组在标题行动作簇的「更多」里（#p-tb）。建议从 MenuSidebar wikitext 里删掉这两组
  ul > li > b 分组项 + ul > li > a  ← '''粗体''' 表示有子级；子级 CSS 悬停飞出（left:100%）
  …任意深度（现网 CSS 对 li ul 递归飞出）
```

AKDS 的适配方式（无需改动现网 wikitext / 站点脚本即可工作）：

| 层 | 处理 |
|---|---|
| mustache | `.ak-sidebar > .ak-sidebar__panel#mw-panel` 保留 `#mw-panel` id；`#p-tb > ul` 仍在文档里但**不在侧栏**（在页面动作簇的「更多」卡片里，见 §3 结构图），现网内联脚本按 `#p-tb ul` 找照样找得到；wikitext 里的「工具#vmsTB」组 / `#MSToolbox` 可以从 MenuSidebar 删掉 |
| skin.css | `.ak-sidebar p` 与 `.ak-portlet__title` 同一套分组标题样式；`.ak-sidebar li > b` 与 `li > a` 同一套行样式；`li > ul` 缩进 + 导轨、默认折叠；`li.mw-empty-elt` 隐藏；`a.selflink` 高亮为当前页 |
| sidebar-tree.js | 对 `.ak-sidebar` 内所有 `li > ul` 幂等增强（MutationObserver 兼容晚注入）：`li.ak-tree__branch` + `button.ak-tree__toggle[aria-expanded][aria-controls][aria-labelledby]`；点击非链接标签整行可切换；`localStorage['akds-sidebar-tree']` 记忆（键 = 分组标题/标签路径，门户为 `portlet:<id>`）；含 `a.selflink / li.is-active / href==location` 的分支自动展开并加 `.is-current-path`；← → 键盘展开/收起；桌面 hover+fine ≥1120px 悬停折叠分支 → 右侧 `.ak-flyout` 预览（`position:fixed`，不受侧栏 `overflow` 裁切；点击即行内展开并记忆） |

- 关闭悬停飞出：`<aside class="ak-sidebar" data-flyout="off">` 或 `<html data-akds-flyout="off">`（移动端 / 触屏自动不启用）。
- 作者默认展开：给 `li` 加 `class="is-open"`（用户操作后以记忆为准）。
- 建议后续把 `#MenuSidebar` 的注入改成皮肤钩子（`SidebarBeforeOutput` / `SkinAfterPortlet` 解析 `MediaWiki:MenuSidebar`）以去掉内联脚本，结构与类名不变。
- 现网 `<span style="…">NEW</span>` 角标建议改用 `.ak-tag.ak-tag--sm.ak-tag--new`。

### 3.2 页脚徽章（`$wgFooterIcons` → `#footer-icons`）

prts.wiki 现网页脚有 5 个 88×31 徽章：CC BY-NC-SA（`copyright`）、Powered by MediaWiki + HoRain + a Mooncell project（`poweredby`，后两个由 LocalSettings 追加）、Powered by Semantic MediaWiki（SMW 扩展加的 `poweredbysmw`）。核心把每个徽章输出为 `<a class="cdx-button cdx-button--fake-button cdx-button--size-large …"><img width=88 height=31 loading=lazy></a>`，同一组（如 poweredby）的多个徽章在同一个 `<li>` 内。

- 这些徽章都按浅底设计——1.43 的 `poweredby_mediawiki.svg` 和 SMW 的 `logo_footer.svg` 是**透明底黑字**，直接放在黑色页脚上会隐形。Vector（T256190，`#f8f9fa`）与 Citizen（`--background-color-base-fixed`）的做法都是给 `a` 一块**不随暗色翻转的固定浅色底板**；AKDS 同样（`.ak-footer__icons a { background:#f5f5f5 }`），并默认 `grayscale(1)` + 62% 透明，悬停 / 聚焦恢复彩色，让徽章退成页脚的一行「印章」而不是五块彩色广告。
- 站点配置里的内联 `style="margin-left:5px"`（HoRain）用 `img { margin:0 !important }` 覆盖；`cdx-button` 假按钮的圆角 / 最小高度 / 内边距一并归零。
- 若想像 starcitizen.tools 那样做成一套单色徽章：那是站点层的事——它用 `$wgFooterIcons` 把 `src` 换成了自绘的 `badge-*.svg`（统一 32px 高、白色线稿），皮肤不需要改。PRTS 若愿意，可同样在 LocalSettings 覆盖 `$wgFooterIcons['poweredby']['mediawiki']['src']` 等为自托管的单色版；届时把 `.ak-footer__icons a` 的底板与 grayscale 去掉即可（保留结构）。

### 3.3 搜索面板（Command Palette）

参考 Citizen 的 `skins.citizen.commandPalette`（starcitizen.tools），但不引 Vue/Codex：核心 `resources/search-palette.js`（≈35KB 未压缩 / gzip ≈ 11KB，与 `preview/` 共用，纯 DOM）+ MW 数据源 `resources/search-providers.js`。

**渐进增强**：mustache 里先渲染真表单 `form.ak-header__search#searchform > {{{html-input}}}(#searchInput) + {{{html-button-search-fallback}}}`。JS 到位后：① 把表单换成 `button.ak-search-trigger`（长得像输入框，`aria-haspopup=dialog aria-keyshortcuts`）；② 把**同一个** `<form>` 搬进面板 `.ak-palette__head`（`id/action/hidden title/#searchInput` 全保留 → 依赖 `#searchform #searchInput` 的 Gadget 不受影响，回车在无高亮项时仍可原生提交 = MW 的 Go）；③ 接管 `/`、Ctrl/⌘K、accesskey F。无 JS：表单直接提交到 Special:Search。

**数据源（providers）**——`search(q, signal)` 返回 `Group[]`（`{ id, label, en, items }`）：

| 层 | 来源 | 说明 |
|---|---|---|
| 标题搜索 | `GET /rest.php/v1/search/title?q=&limit=10` | 与 Vector 2022 / Citizen 相同；`thumbnail` 需 PageImages、`description` 需 ShortDescription / Description2（PRTS 可用 `{{SHORTDESC:…}}` 补短描述）；`matched_title` 只在「别名式重定向」时显示；不加每行「编辑」动作（Citizen 有，我们认为面板里不该有第二个点击目标） |
| 本地即时索引（可选，PRTS 特色） | `mw.hook('akds.search.local').fire(fn)` 注入 `fn(q) → Group[]` | 干员 / 道具 / 关卡 JSON（Cargo 定时导出到 `MediaWiki:*.json` 或 API 缓存到 IndexedDB），支持拼音首字母 / 别名，0 网络等待，且能给结构化元数据（职业图标 `.ak-prof`、稀有度 `.ak-rarity`）——预览页 `search-mock.js` 演示的就是这一层（`yh` → 银灰、`nts` → 能天使） |
| `>` 动作 | 本页菜单 `#p-views #p-cactions #p-tb #p-personal .ak-page-tabs` + 常用特殊页面 | 同 Citizen「从页面菜单拉动作」 |
| `#` 分类 | 空查询：本页所属分类（`prop=categories`）；有字：`list=prefixsearch&psnamespace=14` | 可再加「进入分类浏览成员」 |
| `@` 用户 / `~` 文件 | `list=allusers&auprefix=` / `generator=prefixsearch&gpsnamespace=6&prop=pageimages` | |
| 兜底 | `urls.go(q)` = `Special:Search?search=q&go=Go`；`urls.fulltext(q)` = `…&fulltext=1` | 结果未到就回车 → Go（精确标题直达，否则全文结果页）；⇧↵ / 末尾固定行 → 全文 |

**必须处理**：核心 `Skin::getDefaultModules()` 会给所有皮肤加载 `mediawiki.searchSuggest`（它会在 `#searchInput` 上挂旧式建议下拉，与面板打架）。和 Vector 2022 / Citizen 一样，需要一个极小的 `SkinAKDS extends SkinMustache` 覆盖 `getDefaultModules()`，把 `$modules['search'] = []`（`skin.json` 的 `class` 改指向它）；退而求其次可在 `search-providers.js` 里 `mw.loader.getState('mediawiki.searchSuggest')` 时把 `#searchInput` 的 `id` 换掉，但那样 Gadget 兼容就丢了。

**配置 / 文案**：`$wgAKDSSearchPalette=false` 关闭面板保留原表单（要暴露给 JS 需在 `ResourceLoaderGetConfigVars` 钩子里输出 `wgAKDSSearchPalette`）；文案全部走 `akds-search-*` 消息（i18n 已含 zh-hans / en）。最近访问存 `localStorage['akds-recent']`（≤8 条，只存 label/url/desc/thumb）。

**待办**：`/ns:` 命名空间模式（REST 标题搜索本身支持 `模板:xx` 前缀，所以优先级低）；Related（RelatedArticles）；`Cargo` 查询模式；把面板拆成独立 RL 模块做 intent prefetch。

### 3.4 首页（皮肤 ↔ 页面的分工）

设计稿 `preview/home.html`。首页要的东西分两半，**站点侧不需要往 `MediaWiki:Common.css` 里粘任何皮肤类名**：

**皮肤这半**（Skin:Arknights `resources/skins.arknights.styles/common/mainpage.less`，`action=view` 的首页拿到 `.ak-layout--mainpage` / `.ak-body--mainpage`）——都是「在首页少做点什么」，动的全是皮肤自己的 DOM，TemplateStyles 够不到（它给所有选择器加 `.mw-parser-output` 前缀，只能管到正文里面）：

| 少做什么 | 怎么做 |
|---|---|
| 标题不显示 | `.ak-layout--mainpage .ak-page-heading` 只留给读屏器（sr-only）——h1 仍是大纲的根，不是 `display: none`（核心的 `MediaWiki:Mainpage-title` 置空是另一条路：那样 h1 本身就是空的） |
| 动作簇保留、靠右 | `.ak-page-header__row { justify-content: flex-end; margin-bottom: 0 }`——标题出流后它是行里唯一的项，默认会滑到左边 |
| 正文不包白纸 | `.ak-body--mainpage`：无底色、无边框、无内边距 |
| 不让出目录导轨 | `.ak-layout--mainpage .ak-main` 保留 `--ak-content-max + --ak-toc-w + --ak-gutter` 的总宽（其它无目录页收窄到阅读列），右缘与有目录的页面对齐 |
| 不出目录 | 首页恒 `toc-enabled = false`：右侧粘性目录与二级栏「本页目录」都不渲染；1120–1400 档二级栏因此整条收起，头图跟着少探一行 |
| 命名空间小标 / 指示器 | `.ak-page-header__top:empty` 自动收起；编者真放了 `<indicator>` 会照常显示（要不要藏是站点的决定） |

**页面这半**：结构 = `MediaWiki:首页` / `Template:首页` 输出的 `.mp-*`，**最外层标 `ak-not-prose`**（见 `01 §1.3`）；区块样式 = `Template:首页/styles.css`（TemplateStyles）；Hero 轮播（Swiper）与时钟 / 周常倒计时 / 资源开放状态由 Gadget 按页加载——皮肤不依赖它们，`.ak-countdown` `.ak-panel` `.ak-op-card` 等组件样式已在设计系统层。

预览页里的「0. 页面级」那段 CSS 是**静态骨架的补丁**（预览没有「当前是首页」这个状态），选择器按预览骨架写（`.ak-main__inner` / `.ak-page-header__title`），与真皮肤的 DOM 不一致，不要照抄。

## 3.5 活动主题（Gadget / MediaWiki:Common.css）——头图 · 顶栏角饰 · 站标 · 主色

现网大活换皮的做法（`ext.gadget.seventhStyle`）是改 `body` 背景大图、`#mw-head` 左右底图、`.mw-wiki-logo`、`#MenuSidebar > p` 渐变。新皮肤把这几个位置抽成 `tokens.css §2d` 的接口变量，活动 Gadget 只写变量、不碰选择器（完整列表见 `01-design-system.md §2.10`，可运行示例见 `preview/demo-theme.css`）：

```css
/* MediaWiki:Gadget-eventStyle.css（或直接写进 MediaWiki:Common.css）*/
:root {
  --ak-theme-accent: #72a330;                                          /* 页眉标语 / 悬停 / 开关选中项 / 搜索图标框、侧栏 / 目录分组条、页脚斜纹一起换 */
  --ak-keyart-image: url(//media.prts.wiki/…/kv.jpg);   --ak-keyart-h: 220px;   /* 头图：从页面顶端铺起，页眉玻璃压在它上面，页眉之下露 220px（mustache 恒输出，默认 0 高不占位） */
  --ak-chrome-bg: rgba(8, 9, 10, .8);                                  /* 可选：页眉玻璃调淡一点让头图多透一些（默认 .9；别低于 .72） */
  --ak-chrome-image: url(//media.prts.wiki/…/headleft.png);  --ak-chrome-image-position: left top;   /* 可选：顶栏角饰（现网 PRTSheadleft 那种活动徽章 / 深色底纹）——画在玻璃之上、不被压暗，别放照片 */
  --ak-logo-image: url(//media.prts.wiki/…/logo.png);                              /* 站标（Chromium / WebKit 生效；Firefox 请改 $wgLogos） */
  --ak-canvas-image: url(//media.prts.wiki/…/bkg.png);  --ak-canvas-size: 100% auto;  --ak-canvas-repeat: no-repeat;   /* 画布底纹 / 大图 */
}
html.skin-theme-clientpref-night { --ak-keyart-image: url(//media.prts.wiki/…/kv-night.jpg); }   /* 终端模式换夜景（可选；跟随系统时另加 @media (prefers-color-scheme: dark) 分支） */
```

- **页眉本身在两套主题下都是黑的**（`--ak-chrome-*` 不随明暗变），所以角饰 / 站标只需准备一套；头图与画布图若要分昼夜，按 `html.skin-theme-clientpref-day|night` 分写。
- **页眉是压在头图上的一块均匀黑玻璃**：可读性由 `--ak-chrome-bg` 的 alpha 保证，与头图是什么无关——所以头图不必自己压暗顶部、也不要再裁一条「顶栏底图」从左缘渐入（现网 Garanheadright 的做法在新皮肤里既压不住白色图标又像贴上去的）。`--ak-keyart-position` / `-size` 相对「页眉 + 可见段」整块取景（桌面 56 + `-h`，<1400 再加 48 二级栏）。
- **`url()` 必须是绝对地址**（`//media.prts.wiki/…`）：Chromium 把自定义属性里的相对 `url()` 按「使用处」（`skin.css` 所在的 `load.php`）解析，Firefox / WebKit 按声明处解析，相对地址两边会指向不同目录。
- 想连正文的链接 / 选中色一起换，再覆盖 `--ak-accent`（亮 / 暗两套各写一次）；只换 `--ak-theme-accent` 时正文不动，只有「框」在换——这是有意的：活动皮不该把内容页读起来的对比度也一起赌上。
- 头图上要放活动标题 / 倒计时，可用 Gadget 往 `.ak-keyart__inner` 里塞内容（它与页眉三列同宽）；`.ak-keyart` 带 `aria-hidden`，放可读内容时记得去掉。
- 卸载 Gadget 即恢复默认；无需 purge 页面缓存（都是变量）。

页脚徽章（`$wgFooterIcons`）原样显示（26px 高、无底板、不灰度、无悬停效果），顺序 = 数组键序。通用徽章建议换成**白描版**（白色单色、透明底，见 `preview/assets/badge/mono/`：MediaWiki / SMW / CC BY-NC-SA 由官方矢量重着色——透明底黑字的 `poweredby_mediawiki.svg` 在黑页脚上看不见），站点自己的徽章（Mooncell / HoRain）用原图即可：

```php
$wgFooterIcons = [
  'sponsors'  => [ 'mooncell' => [ 'src' => '//static.prts.wiki/…/mooncell.png', 'url' => 'https://project.mooncell.wiki', 'alt' => 'a Mooncell project' ],
                   'horain'   => [ 'src' => '//static.prts.wiki/…/horain.png',   'url' => 'https://www.horain.net/',        'alt' => 'HoRain' ] ],
  'poweredby' => [ 'mediawiki' => [ 'src' => '/skins/AKDS/resources/badge/mediawiki.svg', 'url' => 'https://www.mediawiki.org/', 'alt' => 'Powered by MediaWiki' ] ],
  // SMW 会自己追加 poweredbysmw；换 src 用 $smwgFooterIcon 或 SkinTemplateNavigation::Universal 钩子
  'copyright' => [ 'copyright' => [ 'src' => '/skins/AKDS/resources/badge/cc-by-nc-sa.svg', 'url' => 'https://creativecommons.org/licenses/by-nc-sa/4.0/', 'alt' => 'CC BY-NC-SA 4.0' ] ],
];
```
若某枚通用徽章仍是原彩色，给 `#footer-icons` 加 `.ak-footer__icons--plate` 恢复浅色底板。

## 3.6 干员页（现网模板 → 组件；`{{CharinfoV2}}` 直接复用）

设计稿 `preview/operator.html`（陈）。现网「陈」页面的 wikitext 是 19 节模板调用——`{{异格干员}}` `{{CharinfoV2}}` `{{干员获得方式}}` `{{属性}}` `{{干员攻击范围}}` `{{天赋列表3}}` `{{潜能提升}}` `{{技能}}` `{{后勤技能}}` `{{精英化材料}}` `{{技能升级材料}}` `{{模组}}` `{{相关道具}}` `{{人员档案}}` `{{:陈/语音记录}}` `{{干员密录}}` `{{悖论模拟}}` `{{干员异格任务}}` `{{spineId}}` `{{干员导航}}`。新皮肤下**干员页的 wikitext 一字不改，章节一节不少**：改的是各模板输出的 HTML（换成设计系统组件）；`{{CharinfoV2}}` 这块连样式表都先不动——原样跑现网 Widget，皮肤只补接缝。

| 现网（wikitext → 输出） | 新结构 | 说明 |
|---|---|---|
| `{{异格干员}}` → `.alter-operator-list` wikitable | `.op-alter`：黑标「异格一览」+ 原型 / 异格 `.ak-op-card--sm`（当前页 `.is-current`）+ `<details>` 说明 | 现网的 popup 说明改成就地展开 |
| `{{CharinfoV2}}` → `{{#widget:charinfoV2}}` | **原样**：DOM、`charinfo_*.min.css` ×2（600px 切桌面 / 手机）、`charinfo_*.min.js` + `charId*.js` + `charVoice*.js`、模板参数生成的内联数据全部照旧——预览页 = 现网「陈」页面渲染出来的这一段，静态文件快照 `preview/vendor/charinfo/`；皮肤只补几条接缝规则 | 见下「CharinfoV2 怎么接」 |
| （新增）身份栏 | `.op-ident > dl.ak-kv--boxed`：代号（中 / 英 / 日）· 情报编号 · 序号 · 稀有度 / 职业 / 分支 / 位置 · 标签 · 所属（国家 / 组织 / 团队）· 画师 · 全语种配音 · 时装 | 舞台 HUD 之外的 `{{CharinfoV2}}` 参数（情报编号 / 日文名 / 序号 / 各语种 CV / 时装系列）现网并不显示，这里补齐；手机上 HUD 收起后它是主要信息 |
| `{{干员获得方式}}` → wikitable + cbox 提示 | `dl.ak-kv--boxed` + `.ak-tag--yellow` + 一行 `.ak-chevrons` 链接 | |
| `{{属性}}` → `Widget:CharEquipSelector` 模组下拉 + 附加属性表 + 四档属性表 + `Widget:PropertyCalc` 计算器 | `.op-calc`（`.ak-phase-tabs` + 裸 `<input>` `<select>`：等级 / 信赖 / 潜能 / 模组 + `.ak-attrs` HUD 读数）+ `wikitable.ak-compact`（精英0 1级 / 精英0 满级 / 精英1 满级 / 精英2 满级 / 信赖加成上限）+ `dl.ak-kv--boxed`（再部署 / 费用 / 阻挡 / 攻击间隔 / 所属势力 / 隐藏势力） | 计算器与模组选择合成一块：选了潜能，「潜能提升」节里对应格点亮 |
| `{{干员攻击范围}}` → 三格 wikitable | `.op-ranges > .ak-range` ×3（精英零 / 一 / 二） | |
| `{{天赋列表3}}` → wikitable + `Widget:Passages switch` | `table.ak-talent-table`：潜能开关 `.is-pot`（描述换成潜能版）+ **算法开关 `.is-calc`**（描述里每个加成项前露出 `.ak-calc--add/--mul/--fadd/--fmul` 四枚标记 + `tfoot` 图例行） | 同现网「潜能 / 算法」两个复选框 |
| `{{潜能提升}}` → 五格 wikitable | `.ak-pot-list > .ak-pot`（图标 + 小标 + 效果；`.is-on` 由属性面板点亮） | |
| `{{技能}}` ×3 → 表头 + 全等级 wikitable + 备注 | `.ak-skill-sheet`：表头（图标 / 名称 + 日 / 英名 / SP 芯片（tooltip 解释回复与触发方式）/ 开放阶段 / 范围 `.ak-range--sm`）+ `.ak-skill-table`（1–7 + 专精 Ⅰ–Ⅲ；列头芯片带 tooltip：初始 / 消耗 / 持续的定义）+ `__note`；术语与异常效果 = `.ak-rt-term.ak-tip--wide` | 现网的 `{{术语}}` / `{{异常效果}}` 弹窗 → 宽版 tooltip |
| `{{后勤技能}}` → wikitable（条件 / 图标 / 技能 / 房间 / 描述） | `wikitable.ak-compact` + `.ak-elite`；图标位 `.ak-glyph-box` | 现网技能图标由 Cargo 查出，预览用线稿占位 |
| `{{精英化材料}}` `{{技能升级材料}}` → wikitable | `.ak-materials`（1→2 … 6→7，`__divider` 写「达到精英阶段 1 后解锁」）+ 专精 `wikitable`（三技能 × 专精 Ⅰ–Ⅲ，同现网一张表对比） | 材料 `.ak-item--sm[data-rarity]` + tooltip 名称 |
| `{{模组}}` ×N → `.equiptemplate` | `.ak-module[data-color]`：型号块（类型图标 + SWO-X）+ 名称 + 说明 tooltip + 基础信息（故事，默认 3 行，「全文阅读」checkbox 展开）+ 三阶段表（属性 / 特性追加 · 天赋更新）+ 解锁任务 + 解锁需求与材料（信赖 / 等级 / 任务 + `.ak-item-list`）；原型证章 = 同一张卡不带 `data-color` | `类型颜色` → `data-color`；`{{修正}}` → `.template-fix-mark` + `<references group=注>` |
| `{{相关道具}}` → wikitable | `wikitable.ak-compact` + `.ak-item` | |
| `{{人员档案}}` → 折叠 wikitable（9 段）+ 未获得时档案 | `.op-files`：左 `.ak-tabs--vertical`（9 项 + 英文小标；<768 横排）+ 右 `.ak-tabpanel > .ak-dossier`（基础档案 `.ak-kv`、综合体检 `.ak-attrs--compact`、其余段落；`__unlock` 写解锁条件）；未获得时档案 → `.ak-archive`（解锁条件 `.ak-stage-code`） | 游戏档案页的「左列表右正文」；全部 9 段都在 DOM 里 |
| `{{:xx/语音记录}}`（`#voice-table-root` VoiceTable + `#voice-data-root` 多语种数据） | `.op-voice-langs`（语种 `.ak-chip`：普通话 / 方言 / 日 / 英 / 韩，带 CV 名）+ `.ak-voice-list > .ak-voice`（标题 / 语种徽标 / `__cond` 解锁条件 / 文件名 `.ak-code-id` / 文本 `data-cn data-jp data-en data-kr data-yue`） | 38 条全部列出；切语种只换文本 |
| `{{干员密录}}` `{{悖论模拟}}` → 折叠 wikitable | `.ak-archive`：头（kicker + 标题 + 解锁条件 `.ak-elite` / `.ak-trust`）+ 体（文案）+ 脚（阅读密录 / 关卡 `.ak-stage` / 首通奖励 `.ak-item`） | |
| `{{干员异格任务}}` → cbox + wikitable | `.ak-message--warning`（已删除、仅存档）+ `wikitable.ak-compact` + `.ak-item-list` + `.ak-chevrons` | |
| `{{spineId}}`（SpineViewer） | `.op-spine`：黑色 16:9 网格舞台 + `.ak-btn--primary` 载入 | |
| `{{干员导航}}` | `.navbox`（L1 基线） | |

**CharinfoV2 怎么接**（预览页 `operator.html` 就是这么接的，生产环境同理）：

- **Widget 原样**：`{{#widget:charinfoV2}}` 输出的 DOM、模板参数生成的内联数据（`char_info` / `charimg_params` / `charskin_params` / `back_list`…）、`charinfo_*.min.css`（桌面 / 手机两份，600px 切）、`charinfo_*.min.js` + `charId*.js` + `charVoice*.js`、crypto-js、`charname` 字体全部照旧。预览页把这些静态文件钉版本抓成快照 `preview/vendor/charinfo/`（`scripts/fetch-charinfo.py`；NOTICE.md 记着来源与仅有的改动——CSS 里几处 `url()` 改相对路径、charVoice 只留陈），立绘 / 场景图 / 职业 · 星级 · 分支图标 / BGM / 语音仍由脚本运行时从 media / static / torappu.prts.wiki 拉。
- **依赖**：脚本用 `RLQ.push(['jquery', fn])` 等 jQuery——MW 里 ResourceLoader 照常处理；预览页自带 jQuery 3.7.1（= MW 1.43）和两行 RLQ 替身。
- **接缝规则**（预览页 `<style>` 的「舞台接缝」段；生产放 Widget 自己的 `<style>` 或皮肤的 site 样式）：① 桌面版舞台 1024×576 定宽、Widget 自己不缩（现网 Vector 正文 975 宽也就那么溢出着），正文列比它窄时整块 `zoom: var(--op-stage-zoom)`（页面脚本按列宽算）。用 zoom 不用 transform：Widget 的「全屏查看」是把 wrapper 设成 `position: fixed` 铺满视口，transform 会改它的包含块、zoom 不会，再加 `:has(> .charinfo-wrapper[style*="fixed"]) { zoom: 1 }` 全屏时不缩；② 全屏层与手机「查看立绘」层的 z-index 抬到 `--ak-z-modal` 之上（Widget 内联的 999 只够压 Vector——它顺手压下去的 `#mw-panel` `#mw-head` 皮肤里没有）；③ **皮肤 `base.css` 的 `img { max-width: 100%; height: auto }` 不进舞台**——HUD 图标靠 `height="30px"` 这类属性定尺寸，`height: auto` 会把它们放回原图的 32px。这条皮肤落地时要正面处理：站上其它 Widget / 模板同样大量依赖 `height=` 属性，要么皮肤把这条改成不碰带 `height` 属性的图，要么各 Widget 自己补 CSS；④ `line-height: 1.6`（Vector 正文行高；Widget 的文字全靠继承，皮肤正文的 1.7 会把画师面板 / 语音气泡撑高一点）。
- **已知的接缝之外**：Widget 的手机版由脚本按父级宽度 <600 在加载时一次性决定（自己 transform 缩放，不响应 resize），皮肤不插手；看图模式的滚轮缩放 / 拖拽用 `getBoundingClientRect` 对 `offsetWidth`，zoom 之下拖动手感会差一个系数（全屏时 zoom 归 1，不受影响）。
- **换皮（暂不接入）**：`src/charinfo.css` 是对同一套 DOM 的皮肤化草案——黑玻璃 HUD（同页眉）、直角、选中 = 青条 + 青字、名字牌 = 思源 900 + 6px 青条（不再要 `charname` 字体）、时装 / 场景抽屉从右缘滑入、整块按容器宽度 `transform: scale(var(--charinfo-scale))`、≤639 藏 HUD 只留页签与名字牌。真要接入得连 JS 一起改三处：resize 只设 `--charinfo-scale`；选中态从换蓝图标 + 内联 color 改成加类 `.is-active`；面板 / 抽屉开合从内联 height / right / opacity 改成加类 `.is-open .is-show .is-watch`。先把现网的动效 / 文本排布 / 试听语音 / BGM 原样看全，再定换皮范围。

**皮肤这半**：无——干员页不需要皮肤层的特殊处理，标题 / 目录 / 动作簇照常（目录自动收 19 个 h2 + 技能 / 模组的 h3）。

**页面这半**：`.op-*` 的几条排布规则归各模板的 TemplateStyles（`Template:异格干员/styles.css`、`Template:属性/styles.css`、`Template:人员档案/styles.css`、语音记录 / SpineViewer 各自的），预览页把它们合在页面的一个 `<style>` 里；属性计算器 / 语音语种切换与播放的脚本，生产环境分别是 `Widget:PropertyCalc`、VoiceTable——预览页脚本只是演示这些交互在新结构上怎么接（语音记录的播放钮走的是与现网同一套 torappu.prts.wiki 音频地址）；舞台的交互就是现网 charinfo JS 本身，预览页只算一个 zoom 系数。

## 4. 明暗主题（clientPrefs）

- HTML 类：`skin-theme-clientpref-os | -day | -night`（与 Vector 2022 一致；MW 核心 `mediawiki.page.ready` 在 `<html>` 上读写 cookie/localStorage `mwclientpreferences`）。
- 切换：`mw.user.clientPrefs.set('skin-theme', 'night')`；tokens.css 已按这三个类定义。
- 未登录用户也可用（clientPrefs 走 localStorage）。
- **Codex 桥接**：tokens.css 第 3 段把 `--background-color-base`、`--color-progressive`、`--border-color-base` 等 Codex 令牌映射到 AKDS 语义令牌，因此 `mw-message-box`、Codex 表单、Echo 弹窗、搜索建议等核心 UI 自动跟随。OOUI 少量硬编码色在 base.css 里覆盖。
- 图片：白色线稿类图标统一走 `filter: var(--ak-glyph-filter)`（亮色反相）。模板里放游戏图标时给 `<img>` 加 `.ak-glyph`。

## 5. 模板 / TemplateStyles / Lua 如何使用组件

- 组件类全部是纯 CSS，无需 JS：模板直接输出 `<div class="ak-skill">…</div>` 等结构（见 `docs/02-components.md` 与 `preview/*.html` 源码）。
- **TemplateStyles**：组件 CSS 已随皮肤加载，模板样式表只写模板特有布局；需要令牌时直接 `var(--ak-accent)`（css-sanitizer 5.x 支持自定义属性）。
- Lua（Scribunto）把 gamedata 富文本 `<@ba.vup>x</>` 转 `<span class="ak-rt-vup">x</span>`；`<$ba.stun>` 转 `<span class="ak-rt-term" data-ak-tip="…">`。
- 稀有度：容器 `data-rarity="6"`；子元素用 `.ak-r-*`。职业：`data-prof="warrior"`。
- 图标资源：建议把 `preview/assets/{profession,elite,potential,specialized,rarity,subprofession,camp}` 上传为 `File:AKDS_*.png` 或放皮肤 `resources/images/`，模板通过 `{{filepath:}}` 或 `--ak-asset-base` 引用。
- 表单：Widget / 模板里直接写裸 `<input>` `<select>` `<button>` 即可，皮肤按 `01-design-system.md §4` 兜底（表格里自动紧凑 + 跟随单元格对齐）；要标签 / 帮助 / 错误文案、前后缀拼接、常显 − / + 步进、方舟风勾选开关，再用 `.ak-field / .ak-input-group / .ak-number / .ak-check / .ak-switch`。
- 交互增强（等级切换、阶段切换）：`data-bind-*` 约定已在 preview.js 演示（`data-scope` + `data-bind="phase"` + `data-bind-phase='{"e0":…}'`），可作为 Gadget 或皮肤 JS 的一部分。

## 6. 与现有扩展的配合

| 扩展 | 处理 |
|---|---|
| TabberNeue | base.css 覆盖 `.tabber__*`；提供 `.ak-tabber-boxed / .ak-tabber-block` 变体（`<tabber class="…">` 或包裹 div） |
| Cargo / SMW / DPL3 | 表格继承 wikitable 规则；结果格式 `template` 时输出 AKDS 组件结构 |
| Echo | 徽标用 `.ak-badge`（notices 默认黄；alerts 加 `--danger` 红）；弹窗走 Codex 桥接 |
| WikiEditor / CodeMirror | 编辑器底色用 `--ak-bg-inset`，已在 base.css 基线覆盖 |
| MobileFrontend + Minerva | 两条路：(a) 皮肤 `responsive:true` 后可直接作为移动端皮肤（≤639 规则已写）；(b) 保留 Minerva 时，把 `skins.akds.tokens` 通过 `skinStyles` 注入 Minerva，仅换色。推荐 (a) 分阶段替换 |
| UniversalLanguageSelector | 触发器放 `.ak-header__tools` |
| Gadgets | 现有小工具若依赖 Vector 类名（`#mw-panel`、`.vector-*`），需迁移；`skin.mustache` 保留 MW 标准 id（`#p-personal #p-views #p-cactions #p-navigation #p-tb #searchform #firstHeading #bodyContent #catlinks`） |
| Widgets / Gadgets 吐出的裸表单控件（`Widget:PropertyCalc` 的属性计算器、各计算器 / 筛选栏的 `<input>` `<select>` `<button>`） | 皮肤 base.css 兜底（规范 `01 §4`）：36px 定高、表格单元格里 30px 且对齐跟随单元格、主题化颜色与状态；Widget 里那些针对旧皮肤的样式补丁（`.skin-minerva #calc input { border… }`、`width: calc(100% - .8em)`）可以删掉——只保留 `width:100%` 这类布局意图 |
| 搜索（core `mediawiki.searchSuggest`） | 与面板冲突，需 `SkinAKDS::getDefaultModules()` 清空 `search` 组（见 §3.3） |

## 7. 迁移路线

1. **Phase 0 · 令牌落地**：以 Gadget 形式加载 `tokens.css + arknights.css`，在 Vector 2022 上先让模板可用 `.ak-*` 组件（`data-rarity`、`.ak-rt-*`、`.ak-item`…），并逐步替换现有模板中的硬编码颜色。
2. **Phase 1 · 皮肤上线（可选皮肤）**：`skins/AKDS` 安装，`$wgDefaultSkin` 不变，用户可在 Special:Preferences 选择；收集 Gadget 兼容问题。
3. **Phase 2 · 干员/关卡/道具等核心模板改造**：按 `preview/operator.html` 结构调整 Template/Module，Cargo 查询输出组件结构。
4. **Phase 3 · 设为默认**：`$wgDefaultSkin = 'akds'`；移动端评估是否替代 Minerva。
5. **持续**：令牌与组件版本化（CHANGELOG），预览页作为回归基准（截图对比）。

## 8. 性能与工程

- CSS 合计 ~90KB 未压缩（tokens 15 / base 25 / components 30 / arknights 30 / skin 12 / utilities 6），gzip 后 < 20KB。可按需拆 `arknights.css` 为独立模块，仅内容页加载。
- 无 JS 依赖的组件为主；skin.js < 6KB，sidebar-tree.js ≈ 7KB，search-palette.js ≈ 35KB 未压缩（gzip ≈ 11KB）+ search-providers.js ≈ 9KB（前者与 preview 共用）。
- 字体：`skins.akds.fonts` ≈ 4.9MB 落盘但按需下载——Noto Sans SC 沿用 Google 的 101 片 `unicode-range` 切分，一页典型下 5–15 片（每片 2–77KB）；Novecento（4 × 11KB）+ Bender（2 × 12KB）+ 拉丁 OFL 三族（≈ 240KB）按用到的字重一次性。预览显示的即上线效果。
- 图片：白色线稿 PNG 已在 100–200px；建议转 SVG/WebP。
- 缓存：ResourceLoader 版本化；主题类在 `<html>` 上，无 FOUC（clientPrefs 内联脚本早于样式）。

## 9. 检查清单（上线前）

- [ ] 亮/暗/跟随系统三态切换无闪烁；未登录持久化
- [ ] 干员页 / 关卡页 / 首页 / 特殊页（搜索、历史、差异、偏好设置）截图对比
- [ ] 键盘可达：页眉、侧栏（树形展开 Enter/Space/←/→）、页面标签、Tabber、Dialog、Dropdown
- [ ] 侧栏：现网 #MenuSidebar 注入后各层级可展开/记忆；`a.selflink` 路径自动展开；飞出不被裁切
- [ ] 对比度：`.ak-rt-*` 亮色值、`--ak-link`、`--ak-fg-muted` 全部 ≥ 4.5:1
- [x] 移动端 ≤ 390：无横向滚动（表格走 `.ak-table-scroll` / display:block；`width:100%` 组件一律 `box-sizing:border-box`）。预览页已在 360 / 414 用脚本核过 `scrollWidth === clientWidth`。**这条一旦破，移动端 Chrome 会把布局视口撑宽、整页缩小，`.ak-fab` 会被推到可见区外**——上线前用真机 / DevTools 移动模式再核一遍
- [ ] Gadget 兼容：列出依赖 Vector 选择器的小工具并迁移
- [ ] 打印样式
