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
│   ├── tokens.css               ← = src/tokens.css
│   ├── base.css                 ← = src/base.css
│   ├── components.css           ← = src/components.css
│   ├── arknights.css            ← = src/arknights.css
│   ├── skin.css                 ← = src/skin.css
│   ├── utilities.css            ← = src/utilities.css
│   ├── skin.js                  ← 主题切换 / 抽屉 / TOC scrollspy / 标签页 / toast
│   ├── images/                  ← 职业/精英/稀有度等白色线稿（或走 File: 命名空间）
│   └── fonts/                   ← Oswald + 思源黑体子集（OFL），可选
└── i18n/{en,zh-hans}.json
```
`skin/` 目录已提供 `skin.json` 与 `skin.mustache` 骨架，`resources/` 用符号链接或构建脚本从 `src/` 同步。

## 2. ResourceLoader 模块划分

| 模块 | 内容 | 加载 |
|---|---|---|
| `skins.akds.tokens` | tokens.css | **所有页面**，`<head>` 顶部（`skin.json` `SkinStyles`/`styles`） |
| `skins.akds.styles` | base.css + skin.css + components.css + arknights.css + utilities.css | 所有页面 |
| `skins.akds.js` | skin.js（`mw.user.clientPrefs`、抽屉、TOC、标签页、data-bind）+ sidebar-tree.js + search-palette.js（悬浮搜索面板核心）+ search-providers.js（MW 数据源）；依赖 `mediawiki.api` | 所有页面（defer）。面板核心 ≈ 35KB 未压缩（含注释；gzip ≈ 11KB），可拆成独立模块在触发器 hover/focus 时 `mw.loader.using` 预取（Citizen 做法） |
| `skins.akds.mobile` | 移动端追加（若同时供 Minerva 使用则改为 `skinStyles` 注入） | 按 target |
| `skins.akds.fonts` | @font-face（可选） | 可由用户偏好/Gadget 关闭 |

`skin.json` 关键项：
```json
"ValidSkinNames": { "akds": { "class": "SkinMustache", "args": [{
  "name": "akds", "template": "skin",
  "responsive": true,
  "bodyClasses": ["skin-akds"],
  "styles": ["skins.akds.tokens", "skins.akds.styles"],
  "scripts": ["skins.akds.js"],
  "clientPrefEnabled": true,
  "wrapSiteNotice": true, "toc": false
}]}},
"ClientPreferences": { "skin-theme": { "options": ["os","day","night"], "default": "os" } }
```
`toc:false` + 自己渲染 `data-toc`（1.40+ 提供 `data-toc.array-sections`），实现右侧粘性目录。

**窄屏（<1400）参考 VitePress 的 LocalNav**：页眉长出第二行 `.ak-local-nav` 吸顶栏，左「菜单」拉出侧栏抽屉、右「本页目录」拉下同一个 `aside.ak-toc`（它此时 `position:fixed`，顶边贴着吸顶栏下沿）。向下滚动时 `skin.js` 给 `<html>` 加 `.ak-condensed`，页眉整体 `translateY(-56px)`，品牌 / 搜索 / 工具那一行滑出视口，只留 48px 的二级栏贴顶；向上滚或回到顶部再展开。

- 开合本身是纯 CSS（`.ak-toc-cb` + `label.ak-local-nav__toc`，两者非兄弟节点故用 `body:has(...)` 桥接），**无 JS 也能开合**；JS 只补「点击浮层外 / Esc / 跳转后关闭」和页眉收起。不支持 `:has()` 时 `@supports` 兜底为正文流内的静态卡片。
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
      .ak-header__tools [.ak-header__tool > .ak-header__tool-label + .ak-theme-toggle][{{data-portlets.data-notifications}}][{{data-portlets.data-user-menu}} = .ak-dropdown#p-personal]
   label.ak-header__burger[for=ak-nav-toggle]   ← 三条线 → ×，仅 <1120 显示；主行不放侧栏抽屉的入口（那个在二级栏）
   .ak-local-nav   ← 页眉第二行「二级吸顶栏」，仅 <1400 显示（CSS 控制，服务端恒输出）
div.ak-keyart > .ak-keyart__inner   ← 头图带：恒输出，--ak-keyart-h 为 0 时不占位；活动主题设 --ak-keyart-image / -h 即出现（§3.5）
      button.ak-local-nav__menu（开侧栏抽屉）| input.ak-toc-cb + label.ak-local-nav__toc[for]（开目录浮层，纯 CSS）
      （aside.ak-toc 首项 a.ak-toc__top「回到顶部」仅 <1400 显示，届时 .ak-fab 隐藏）
<div class="ak-layout">
   aside.ak-sidebar {{#data-portlets-sidebar}} .ak-portlet(.ak-portlet--grid for first) …
   main.ak-main#content        ← position:relative + 右内边距预留目录导轨（.ak-layout 只有侧栏/主列两列）
      header.ak-page-header  [breadcrumb from {{html-subtitle}}] {{html-indicators}} h1#firstHeading {{{html-title}}}
         .ak-page-header__bar  ul.ak-page-tabs{{data-portlets.data-views}} ul.ak-page-tabs--actions{{data-portlets.data-actions}}
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
Portlet 渲染用 `Skin::getPortletsTemplateData()` 输出的 `html-items`（只含 `<li>`，mustache 负责包 `<ul>`），外层类由 mustache 加；`li.selected` 与 CSS `.ak-page-tabs li.selected` 对应（MW 原生类名）。

**注意 `data-footer.*` 与门户不同**：核心 `SkinComponentFooter::formatFooterDataForCurrentSpec()` 会剥掉 `html-items` / `label` / `class`，只留下 `id`、`className`、`array-items[{id, html}]`（见 [Manual:SkinMustache.php#DataFooter](https://www.mediawiki.org/wiki/Manual:SkinMustache.php)），所以页脚三处必须像 Vector `Footer__row.mustache` 一样写成 `{{#array-items}}<li id="{{id}}">{{{html}}}</li>{{/array-items}}`，用 `{{{html-items}}}` 会渲染成空。

### 3.1 侧栏与 PRTS 现网的多层菜单（#MenuSidebar）

现网 prts.wiki（Vector legacy）的侧栏**不是** `MediaWiki:Sidebar` 门户，而是一段由 wikitext 生成、放在页面末尾的 `div#MenuSidebar`，再由内联脚本在 `DOMContentLoaded` 时移入 `#mw-panel`（并把 `#p-tb ul` 的内容复制进 `#MSToolbox`、删掉其余门户）。其结构为：

```
div#MenuSidebar
  ul > li > a                       ← 无标题的首组（首页 / 复制短链接 / 支持我们 …）
  p  分组标题（热门页面 / 菜单 / 探索 / 管理与编辑 / Languages / 工具#vmsTB）
  ul > li > b 分组项 + ul > li > a  ← '''粗体''' 表示有子级；子级 CSS 悬停飞出（left:100%）
  …任意深度（现网 CSS 对 li ul 递归飞出）
```

AKDS 的适配方式（无需改动现网 wikitext / 站点脚本即可工作）：

| 层 | 处理 |
|---|---|
| mustache | `.ak-sidebar > .ak-sidebar__panel#mw-panel` 保留 `#mw-panel` id 与 `#p-tb > ul`，现网内联脚本可原样运行 |
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

## 3.5 活动主题（Gadget / MediaWiki:Common.css）——头图 · 顶栏底图 · 站标 · 主色

现网大活换皮的做法（`ext.gadget.seventhStyle`）是改 `body` 背景大图、`#mw-head` 左右底图、`.mw-wiki-logo`、`#MenuSidebar > p` 渐变。新皮肤把这几个位置抽成 `tokens.css §2d` 的接口变量，活动 Gadget 只写变量、不碰选择器（完整列表见 `01-design-system.md §2.10`，可运行示例见 `preview/demo-theme.css`）：

```css
/* MediaWiki:Gadget-eventStyle.css（或直接写进 MediaWiki:Common.css）*/
:root {
  --ak-theme-accent: #72a330;                                          /* 页眉标语 / 悬停 / 开关选中项 / 搜索图标框、侧栏 / 目录分组条、页脚斜纹一起换 */
  --ak-keyart-image: url(//media.prts.wiki/…/kv.jpg);   --ak-keyart-h: 220px;   /* 头图：.ak-keyart 通栏（mustache 恒输出，默认 0 高不占位） */
  --ak-chrome-image: url(//media.prts.wiki/…/headleft.png), url(//media.prts.wiki/…/headright.png);
  --ak-chrome-image-position: left top, right top;   --ak-chrome-texture: 0;      /* 顶栏底图：现网 PRTSheadleft / Garanheadright 的位置；有底图就关网点 */
  --ak-logo-image: url(//media.prts.wiki/…/logo.png);                              /* 站标（Chromium / WebKit 生效；Firefox 请改 $wgLogos） */
  --ak-canvas-image: url(//media.prts.wiki/…/bkg.png);  --ak-canvas-size: 100% auto;  --ak-canvas-repeat: no-repeat;   /* 画布底纹 / 大图 */
}
html.skin-theme-clientpref-night { --ak-keyart-image: url(//media.prts.wiki/…/kv-night.jpg); }   /* 终端模式换夜景（可选；跟随系统时另加 @media (prefers-color-scheme: dark) 分支） */
```

- **页眉本身在两套主题下都是黑的**（`--ak-chrome-*` 不随明暗变），所以顶栏底图 / 站标只需准备一套；头图与画布图若要分昼夜，按 `html.skin-theme-clientpref-day|night` 分写。
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
- 交互增强（等级切换、阶段切换）：`data-bind-*` 约定已在 preview.js 演示（`data-scope` + `data-bind="phase"` + `data-bind-phase='{"e0":…}'`），可作为 Gadget 或皮肤 JS 的一部分。

## 6. 与现有扩展的配合

| 扩展 | 处理 |
|---|---|
| TabberNeue | base.css 覆盖 `.tabber__*`；提供 `.ak-tabber-boxed / .ak-tabber-skew` 变体（`<tabber class="…">` 或包裹 div） |
| Cargo / SMW / DPL3 | 表格继承 wikitable 规则；结果格式 `template` 时输出 AKDS 组件结构 |
| Echo | 徽标用 `.ak-badge`；弹窗走 Codex 桥接 |
| WikiEditor / CodeMirror | 编辑器底色用 `--ak-bg-inset`，已在 base.css 基线覆盖 |
| MobileFrontend + Minerva | 两条路：(a) 皮肤 `responsive:true` 后可直接作为移动端皮肤（≤639 规则已写）；(b) 保留 Minerva 时，把 `skins.akds.tokens` 通过 `skinStyles` 注入 Minerva，仅换色。推荐 (a) 分阶段替换 |
| UniversalLanguageSelector | 触发器放 `.ak-header__tools` |
| Gadgets | 现有小工具若依赖 Vector 类名（`#mw-panel`、`.vector-*`），需迁移；`skin.mustache` 保留 MW 标准 id（`#p-personal #p-views #p-cactions #p-navigation #p-tb #searchform #firstHeading #bodyContent #catlinks`） |
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
- 字体：思源黑体子集（常用 3500 字 + 页面动态子集）；标题拉丁字用系统回退时视觉退化可接受（预览即为回退效果）。
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
