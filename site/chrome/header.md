<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 页眉

页眉在两套主题下都是**黑色「终端」顶栏**：官网导航栏（黑底 · 青色当前项 · 白线稿图标）、游戏主界面顶栏（深底 · 半调网点 · 青色选中块）、干员档案页顶部那道黑边——「黑框白纸 / 黑框黑纸」是方舟本体的框架语言。

它的配色**不读明暗主题**，只读 `--ak-chrome-*`：`chrome/header.css` 在 `.ak-header` 里把语义令牌重映射过去（`--ak-fg` → `--ak-chrome-fg`、`--ak-bg-surface` → `--ak-chrome-bg-solid`、`--ak-accent` → `--ak-theme-accent` …），所以页眉里的按钮、搜索触发器、头像、徽标、菜单卡片都自动是页眉配色，不必逐个写。切一下文档站的外观看看——页眉不变。

<SkinFrame :height="420" highlight=".ak-header" />

## 构件

- **黑玻璃** `rgba(8,9,10,.9)`，1px 亮线收边——均匀一层，横向 / 纵向都不做渐变。头图从页面顶端铺起、页眉压在它上面，可读性由玻璃保证、不赌画面；正文滚过来也一样透出（见[头图与主题接口](/chrome/theming)）。毛玻璃（`--ak-chrome-backdrop`）默认不开：玻璃 .9 不透明时模糊只透出一成、肉眼看不出，粘性页眉却要每帧把底下重糊一遍，是滚动时 GPU 上最重的一项（现网反馈过首页顶部滚动卡顿）。
- **半调网点场**从右缘向左渐隐，只铺到工具区背后（游戏顶栏 `img_back` / 官网左缘网点）；`--ak-chrome-texture` 调强弱或关掉。
- **标语**（ARKNIGHTS WIKI）与**悬停**用活动主色 `--ak-theme-accent`——官网导航当前项那一点青。
- **搜索触发器**：左端深色图标框（游戏 HUD `announce_title_on` 的图标位）+ 矩形浅条；打开时边框与图标框都变主色。试过右端斜切，Tab 焦点描边会被 `clip-path` 裁断，作罢。无 JS 时这里是真的搜索表单，见[搜索面板](/chrome/search)。
- **外观开关**选中项 = 主色实底（游戏 `selected_back` / `toggle_on`），亮暗主题下页眉配色完全一致、不反色。
- **通知徽标**黄底（次强调：未读数不是高危信息，红只留给危险与 NEW）；头像方形细框；页眉里的链接不分已访问色。

## 三列的列头

主行（≥1120）是三列网格 `var(--ak-sidebar-w) minmax(0,1fr) auto`（1120–1400 在工具前多一列「本页目录」，见下面[窄屏](#窄屏)），与下面 `.ak-layout` 同列同 gutter：品牌盖着侧栏列，搜索从正文列左缘起（最宽 560px，与面包屑 / 标题左缘同一条线），工具靠右盖着目录列——页眉是三列各自的「列头」，不是游离的一条。

**页眉不放站点级主导航**：那 8 项与侧栏「通用」组 1:1 重复，没有哪个宽度上「顶栏可见而侧栏不可见」，两处 active 还会打架；导航只由侧栏承担（MW 的 `data-portlets-first` 也只在侧栏渲染一次）。

## 用户菜单

`#p-personal` = `.ak-dropdown > details > summary.ak-header__user + .ak-menu.ak-header__user-card`：身份抬头 + 两组门户——「界面设置」`#p-user-interface-preferences`（ULS 的语言切换在这里，侧栏不再有 Languages 组）与「个人工具」。颜色不用另写，卡片在页眉子树里，自动是页眉配色。

抬头 `a.ak-menu__head#pt-userpage` 整块就是去用户页的链接：`.ak-avatar`（没有头像时里面放 `#i-user` 图标）+ `.ak-menu__head-name`（用户名），右端箭头由 CSS 画——箭头已经说明点它过去，不另写「用户页」。用户页这一项从「个人工具」里提出来当抬头，下面不再有一条同名的项——用户名在卡片里只出现一次。<1120 这张卡片在 ⋮ 面板里平铺、恒展开——不折叠（面板高度不紧张，放不下时面板自己滚），用户行（`summary`）隐藏，身份抬头直接当这一段的开头。展开靠 JS 在这一档把 `<details>` 置 `open`（回到桌面宽度再合上）；无 JS 时由 `::details-content` 纯 CSS 桥接，两样都没有的旧内核退回「点用户行展开」。

<SkinFrame :height="420" state="user" />

## 窄屏

页眉在**所有宽度都只有一行**、始终贴顶，不随滚动收起。<1400 多出来的两个入口——「菜单」（拉出侧栏抽屉）与「本页目录」（拉下目录浮层）——在 DOM 上是 `.ak-local-nav` 一组，但不单独成行：`.ak-header__inner` 与 `.ak-local-nav` 都 `display: contents`，两组子项直接排进 `.ak-header` 这一行，DOM 与模板不变。

- **1120–1400**：侧栏还在左列，网格挂到 `.ak-header` 上、多出一列——品牌 | 搜索 | 本页目录 ⌄ | 工具。品牌、搜索照旧是侧栏列与正文列的列头；「本页目录」排在工具之前、与工具组隔 12px，目录浮层右对齐、正好从这一角拉下来。页面没有目录时这一列是空的（宽 0），页眉看起来与 ≥1400 一样。
- **<1120**：侧栏成了抽屉，没有列可对齐，这一行回到 flex——◧ 菜单 · 品牌 · 搜索 · 本页目录 ⌄ · ⋮。「菜单」只留图标（侧栏面板 ◧：外框 + 实心左栏，画的就是拉出来的那一栏；不用 ☰ 三条线——☰ 与手机上目录的方点列表都是三行横排，同在一行扫一眼分不清哪个是导航），`font-size: 0` 藏起「菜单」两字，文字仍是按钮的无障碍名。外观、通知、用户菜单收进 ⋮ 拉下、贴页眉右下沿的卡片（宽度随内容：最窄 240px，内容长就撑开，最宽到视口两侧各留一个 gutter）（`position: absolute` 于 `.ak-header`、`top: 100%`；不是全屏面板——里面只有一行图标控件加用户菜单，卡片自己可滚、不锁页面滚动）：第一行左边是通知图标（徽标照旧压在铃铛右上角）、右边是外观开关（三个按钮加大到 40×32 方便点按），两样并排不各占一行，用户菜单平铺在下面（不折叠、不浮出）。DOM 只有一份：桌面上 `.ak-header__screen` 是 `display: contents`，子项直接参与主行网格；窄屏它变成卡片——Echo 徽标、`#p-personal`、外观开关都不复制，id 不重复。
- **≤639**：全是图标，52px——◧ 菜单 · 品牌 ……… 本页目录 · 搜索 · ⋮。「本页目录」也只留图标：CSS 画的方点列表（`::before` + `mask`，模板不用加图标），三个 4px 方点与 ⋮ 同一种方点——不用三条线的 `i-list`（一眼读成汉堡菜单），也不用缩进的大纲图形（20px 下像「右对齐」）；开着时同其它宽度变活动主色，不再有下拉箭头；强制色模式下改用系统文字色 / Highlight。搜索收成图标按钮（同样打开悬浮面板），标语隐藏。320px 宽也排得下。

以前 640–1399 是两行：主行下面还有一条 48px 的「二级吸顶栏」放「菜单」「本页目录」，向下滚动时主行收起、只留它贴顶（`.ak-condensed`）。1120–1400 那条栏里只有一个「本页目录」；而且两行时顶部占 105px，粘性表头（`.wikitable.ak-sticky-head`、干员一览的表头）、粘性侧栏这些只按 `--ak-header-h` 让位的地方，主行没收起时都被第二行压住一截。合成一行后头图只探这一行、目录浮层贴这一行下沿、标题锚点只让这一行，都是 `--ak-header-h`，不必再另算；页眉也不再收起，四个入口在任何滚动位置都够得着。

开合是**纯 CSS**：`input.ak-nav-cb` + `label.ak-header__burger`（⋮ 三个方点 → ×；不画三条线——三条线一眼读成汉堡菜单，而这里只是外观 / 账户，不是导航），checkbox 在 DOM 上必须排在卡片与汉堡之前才能用 `~` 联动，所以主行 DOM 顺序固定为 logo · search · search-toggle · nav-cb · screen · burger。<1120「菜单」用 `order` 排到最左、⋮ 排到最右，Tab / 读屏顺序仍是 DOM 的 品牌 → 搜索 → ⋮ → 菜单 → 目录，与视觉不一致——换来模板不用动。JS 只补 Esc / 点卡片外（放行 `.ak-nav-cb`，同[目录浮层](/chrome/toc#没有-js-也能开合)）/ 选了页内链接 / 回到桌面宽度时收起。「菜单」◧（侧栏抽屉 = 本站唯一的导航）与 ⋮（外观 / 账户）分工明确，互不重复。

<SkinFrame :width="1280" :height="560" state="toc" caption="1280：侧栏还在，「本页目录」排在工具之前，浮层从这一角拉下" />

<SkinFrame :width="1024" :height="560" state="nav" caption="1024：◧ 菜单 · 品牌 · 搜索 · 本页目录 · ⋮——⋮ 拉下的工具卡片（外观 / 通知 / 用户）" />

<SkinFrame :width="390" :height="560" state="toc" caption="390：手机上全是图标，目录（方点列表）拉下的浮层贴在这一行下沿" />

## 外观开关

三态：跟随系统 / 档案（亮）/ 终端（暗），对应 MW 1.43 的 `skin-theme-clientpref-os | day | night`（`mw.user.clientPrefs`，未登录也可用）。`button[data-theme]`，选中项 `.is-active`。

```html demo bare
<div class="ak-header" style="position:relative;padding:14px 16px">
  <div class="ak-theme-toggle" role="group" aria-label="外观">
    <button data-theme="os" title="跟随系统"><svg><use href="#i-monitor"/></svg></button>
    <button data-theme="light" title="档案模式（亮）"><svg><use href="#i-sun"/></svg></button>
    <button data-theme="dark" title="终端模式（暗）"><svg><use href="#i-moon"/></svg></button>
  </div>
</div>
```

示例外面包了一层 `.ak-header`，开关才拿到页眉配色；点一下会切换示例自己的主题。

## 结构

```html
<header class="ak-header">
  <div class="ak-header__inner">
    <a class="ak-header__logo" href="…"><img src="…" alt=""><span class="ak-header__wordmark">PRTS<small>ARKNIGHTS WIKI</small></span></a>
    <form class="ak-header__search ak-search" id="searchform" role="search">…</form>   <!-- 有 JS 时换成 button.ak-search-trigger -->
    <button class="ak-btn ak-btn--icon ak-header__search-toggle ak-only-mobile" aria-label="搜索">…</button>
    <input type="checkbox" id="ak-nav-toggle" class="ak-nav-cb">
    <div class="ak-header__screen" id="ak-nav-screen">
      <div class="ak-header__tools">
        <div class="ak-header__tool"><span class="ak-header__tool-label">外观</span><div class="ak-theme-toggle">…</div></div>
        <button class="ak-btn ak-btn--icon ak-header__bell" aria-label="通知">…<span class="ak-badge">3</span></button>
        <div class="ak-dropdown ak-header__user-menu"><details><summary class="ak-btn ak-btn--ghost ak-header__user">…</summary><div class="ak-menu ak-menu--right ak-header__user-card">…</div></details></div>
      </div>
    </div>
    <label class="ak-header__burger" for="ak-nav-toggle">…</label>
  </div>
  <div class="ak-local-nav">   <!-- <1400 才显示，且不另起一行：display:contents，两个入口并进上面那一行 -->
    <button type="button" class="ak-local-nav__btn ak-local-nav__menu" aria-controls="ak-sidebar" aria-expanded="false">…菜单</button>
    <input type="checkbox" id="ak-toc-toggle" class="ak-toc-cb">
    <label class="ak-local-nav__btn ak-local-nav__toc" for="ak-toc-toggle">本页目录<span class="ak-local-nav__chevron"></span></label>
  </div>
</header>
```

## CSS

<CssClasses :files="['chrome/header.css', 'chrome/local-nav.css', 'chrome/theme-toggle.css']" />

<CssSelectors :files="['chrome/header.css', 'chrome/local-nav.css', 'chrome/theme-toggle.css']" />
