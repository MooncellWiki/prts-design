# skin.mustache 结构

皮肤骨架由 SkinMustache 渲染（不写 PHP）。下面是 CSS（`packages/css/src/chrome/`）期望的 DOM 与 MW 模板数据的对应——它就是预览骨架 `preview/_src/skeleton.html` 的结构，生产皮肤（Skin:Arknights）照它输出。

::: warning 仓库里的 skin.mustache 还没跟上
`skin/templates/skin.mustache` 是早期骨架：页眉、头图、侧栏、目录、页脚已按下图写好，但**页面头**还是旧写法（`.ak-page-header__bar` 里平铺四组 `ul.ak-page-tabs`，没有 `.ak-page-header__row` / `.ak-page-tools` 动作簇），**用户菜单**还是一张平铺的 `ul.ak-menu`（没有抬头与「界面设置 / 个人工具」两组），侧栏里仍渲染 Languages 门户，也没有 `#p-site-tools`。以下面的结构图为准。生产皮肤 Skin:Arknights 的 `templates/*.mustache`（PHP 组件喂数据，Citizen 式拆成 Header / Sidebar / PageHeader / PageTools / UserMenu / TableOfContents / Footer 等 partial）已按这张图输出：标题行动作簇、用户菜单的抬头 + 两组、工具箱进「更多」、`#p-site-tools`；侧栏只在有跨语言链接（`p-lang`）时才渲染语言门户。它加载的就是本仓库的 `chrome/`（`skins.arknights.shell`），模板按这里的类名输出。MediaWiki 皮肤比预览骨架多出来的几样已经写进 `chrome/`：h1 外面可以包一层 `.ak-page-heading`（下面挂 tagline）、`.mw-indicators`、diff 页放回「阅读」、目录的折叠钮与一级项加粗、Echo 徽标 `.ak-header__notifications`、页脚链接列数由内容定（`grid-auto-flow: column`）；无 JS 的真搜索表单那几条只属于 MW，留在它自己的 `shell-glue.less` 里。

:::

各块的样子见[皮肤骨架](/chrome/)各页。

```
<div class="ak-skip">…
<header class="ak-header"> .ak-header__inner
   a.ak-header__logo{{data-logos}}
   form.ak-header__search{{data-search-box}}   ← 无 JS 的真表单；有 JS 时被 search-palette.js 换成 button.ak-search-trigger，表单本身搬进悬浮面板
   button.ak-header__search-toggle（≤639 图标）
   input.ak-nav-cb#ak-nav-toggle                ← <1120 工具卡片开关（纯 CSS）；必须排在下面两个之前
   .ak-header__screen#ak-nav-screen             ← 桌面 display:contents；<1120 = ⋮ 拉下、贴主行右下沿的卡片
      .ak-header__tools [.ak-header__tool > .ak-header__tool-label + .ak-theme-toggle][{{data-portlets.data-notifications}}]
         .ak-dropdown.ak-header__user-menu > details > summary.ak-header__user + .ak-menu.ak-header__user-card(
            a.ak-menu__head#pt-userpage[href=用户页]( .ak-avatar + .ak-menu__head-name{{username}} )   ← 从 data-user-menu 里把 userpage 提出来当抬头
            nav.ak-menu__group#p-user-interface-preferences{{data-user-interface-preferences}}「界面设置」← 语言切换（ULS）在这里
            nav.ak-menu__group#p-personal{{data-user-menu}}「个人工具」（不含 userpage） )
   label.ak-header__burger[for=ak-nav-toggle]   ← ⋮ → ×，仅 <1120；主行不放侧栏抽屉的入口（那个在二级栏）
   .ak-local-nav                                ← 页眉第二行「二级吸顶栏」，仅 <1400 显示（CSS 控制，服务端恒输出）；≤639 由 CSS 并进主行，同一份 DOM
      button.ak-local-nav__menu（开侧栏抽屉）| input.ak-toc-cb + label.ak-local-nav__toc[for]（开目录浮层，纯 CSS）
div.ak-keyart > .ak-keyart__inner               ← 头图：恒输出，默认只露 72px 一小条（--ak-keyart-reveal；≤639 为 0）；画从页面顶端铺起，垫在页眉玻璃与版面背后（CSS 负外边距，DOM 顺序不变）
<div class="ak-layout">
   aside.ak-sidebar {{#data-portlets-sidebar}} .ak-portlet(.ak-portlet--grid for first) …
   main.ak-main#content                         ← position:relative + 右内边距预留目录导轨（.ak-layout 只有侧栏 / 主列两列）
      header.ak-page-header
         .ak-page-header__top( [面包屑 from {{html-subtitle}}] {{html-indicators}} )
         .ak-page-header__row  h1#firstHeading{{{html-title}}} + .ak-page-tools   ← 标题行：h1 + 页面动作簇（Citizen 式）
            ul.ak-page-tabs#p-associated-pages{{data-portlets.data-associated-pages}}
            ul.ak-page-tabs#p-views{{data-portlets.data-views}}（watch / unwatch 从 actions 搬进 views）
            [.ak-page-tools__variants{{data-variants}}]
            .ak-page-tools__more > details > summary.ak-page-tools__btn「⋯ 更多」+ .ak-menu.ak-page-tools__card(
               nav.ak-menu__group#p-cactions{{data-actions}}  nav.ak-menu__group#p-tb{{data-toolbox}} )
      aside.ak-toc#ak-toc                       ← 目录：DOM 上属于页面、紧跟标题（≥1400 抬进右侧导轨，<1400 变成二级栏拉下的浮层）
         a.ak-toc__top「回到顶部」（仅 <1400；<1120 时 .ak-fab 隐藏）
         .ak-toc__inner  .ak-toc__title#ak-toc-label + .ak-toc__progress > i + ul.ak-toc__list[data-toc]   ← 由 data-toc 或 skin.js 生成
      div.ak-body#bodyContent  {{{html-site-notice}}} {{{html-user-message}}} .mw-body-content{{{html-body-content}}}
         ul.ak-body-foot#footer-info {{#data-footer.data-info}}{{#array-items}} li#footer-info-lastmod / -copyright
      {{{html-categories}}}                     ← div#catlinks（样式见 base/catlinks.css；skin.js tidyCatlinks() 去冒号）
<footer class="ak-footer">
   .ak-footer__inner   .ak-footer__brand | .ak-footer__col > h4{{msg-akds-footer-about}} + ul#footer-places {{#data-footer.data-places}}{{#array-items}}
   .ak-footer__bottom  .ak-footer__bottom-text | ul.ak-footer__icons#footer-icons {{#data-footer.data-icons}}{{#array-items}} li#footer-copyrightico / -poweredbyico / …
button.ak-fab                                   ← 回到顶部（≥1120）
```

## 门户与动作簇

- 门户用 `Skin::getPortletsTemplateData()` 输出的 `html-items`（只含 `<li>`，外层 `<ul>` 与类名由 mustache 加）。
- **页眉不放站点级主导航**：`MediaWiki:Sidebar` 首个门户（`data-portlets-first`）只在侧栏渲染一次，成 `.ak-portlet--grid`（见[页眉 · 三列的列头](/chrome/header#三列的列头)）。
- `li.selected`（MW 原生类名）在动作簇里只留给读屏器（sr-only，不是 `display: none`——accesskey 仍可用）：当前命名空间页签「页面」与「阅读」只在不是当前态时才是动作（讨论页上的「页面」、历史页上的「阅读」）。diff / oldid 页 `<body>` 仍是 `action-view`，要像 Citizen 那样用 `.action-view:has(.diff, .mw-revision) #ca-view` 把「阅读」放回来。
- views / associated-pages 核心不给 `icon` 键，图标由皮肤映射：talk → speechBubbles、history → history、edit / ve-edit → edit、viewsource → wikiText 或 editLock、view → eye；讨论页上的命名空间页签换 arrowPrevious 表示返回（见[页面头 · 动作簇](/chrome/page-header#动作簇)）。
- **工具箱不进侧栏**：像 Citizen `SkinCitizen::extractPageToolsFromSidebar()` 那样从 `data-portlets-sidebar.array-portlets-rest` 里按 id `p-tb` 拆出来，放进「更多」卡片（id 不变，`mw.util.addPortletLink('p-tb', …)` 照常）。其中「特殊页面 / 上传文件」是站点级的，不进「更多」——同 Citizen（`SkinHooks::moveUploadToSiteTools()` + `addSiteTools()`）进侧栏站点导航：在 `SidebarBeforeOutput` 里从 `$sidebar['TOOLBOX']` 取出（upload 由 MW 按权限决定是否存在，取不到就不渲染），`#MenuSidebar` 模式下渲染成 `#MenuSidebar` 之后的无标题门户 `nav#p-site-tools`（紧贴上一组，视觉上是「管理与编辑」的延续），`MediaWiki:Sidebar` 模式下追加到首个门户。
- `$wgArknightsShowPageTools`（Skin:Arknights 的配置）只控制 views / actions 的可见性，「更多」里的工具箱不受它影响（同 Citizen 的 has-overflow 独立于 is-visible）。

## 页脚数据

**`data-footer.*` 与门户不同**：核心 `SkinComponentFooter::formatFooterDataForCurrentSpec()` 会剥掉 `html-items` / `label` / `class`，只留下 `id`、`className`、`array-items[{id, html}]`（见 [Manual:SkinMustache.php](https://www.mediawiki.org/wiki/Manual:SkinMustache.php)），所以页脚三处必须像 Vector 的 `Footer__row.mustache` 那样逐项写 `li`：

```
{{#array-items}}<li id="{{id}}">{{{html}}}</li>{{/array-items}}
```

写成 <code v-pre>{{{html-items}}}</code> 会渲染成空。徽章（`$wgFooterIcons`）怎么显示、怎么换白描版见[页脚 · 徽章](/chrome/footer#徽章)。

## 侧栏与 #MenuSidebar

现网 prts.wiki（Vector legacy）的侧栏**不是** `MediaWiki:Sidebar` 门户，而是一段 wikitext 生成、放在页面末尾的 `div#MenuSidebar`，由内联脚本在 `DOMContentLoaded` 时移进 `#mw-panel`（并把 `#p-tb ul` 的内容复制进 `#MSToolbox`、删掉其余门户）。Arknights 皮肤不用改现网 wikitext / 站点脚本就能工作：

| 层 | 处理 |
|---|---|
| mustache | `.ak-sidebar > .ak-sidebar__panel#mw-panel` 保留 `#mw-panel` id；`#p-tb > ul` 仍在文档里但**不在侧栏**（在动作簇的「更多」卡片里），现网内联脚本按 `#p-tb ul` 找照样找得到 |
| `chrome/sidebar.css` · `sidebar-tree.css` | `.ak-sidebar p` 与 `.ak-portlet__title` 同一套分组标题；`li > b` 与 `li > a` 同一套行；`li > ul` 缩进 + 导轨、默认折叠；`li.mw-empty-elt` 隐藏；`a.selflink` 高亮为当前页 |
| `sidebar-tree.js` | 对 `.ak-sidebar` 里所有 `li > ul` 幂等增强成树（MutationObserver 兼容晚注入），见[侧栏 · 多层树](/chrome/sidebar#多层树) |

- 现网末尾的两组在新皮肤下退役，建议从 MenuSidebar 的 wikitext 里删掉：「Languages」（三个 `onclick` 内联脚本链接）→ 语言切换统一在页眉用户菜单「界面设置」（ULS，`#p-user-interface-preferences`）；「工具」`#vmsTB` / `#MSToolbox` → 工具箱整组在标题行动作簇的「更多」里（`#p-tb`）。
- 建议后续把 `#MenuSidebar` 的注入改成皮肤钩子（`SidebarBeforeOutput` / `SkinAfterPortlet` 解析 `MediaWiki:MenuSidebar`），去掉内联脚本，结构与类名不变。
