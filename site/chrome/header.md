<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 页眉

页眉在两套主题下都是**黑色「终端」顶栏**：官网导航栏（黑底 · 青色当前项 · 白线稿图标）、游戏主界面顶栏（深底 · 半调网点 · 青色选中块）、干员档案页顶部那道黑边——「黑框白纸 / 黑框黑纸」是方舟本体的框架语言。

它的配色**不读明暗主题**，只读 `--ak-chrome-*`：`chrome/header.css` 在 `.ak-header` 里把语义令牌重映射过去（`--ak-fg` → `--ak-chrome-fg`、`--ak-bg-surface` → `--ak-chrome-bg-solid`、`--ak-accent` → `--ak-theme-accent` …），所以页眉里的按钮、搜索触发器、头像、徽标、菜单卡片都自动是页眉配色，不必逐个写。切一下文档站的外观看看——页眉不变。

<SkinFrame :height="420" highlight=".ak-header" />

## 构件

- **黑玻璃** `rgba(8,9,10,.9)` + 毛玻璃，1px 亮线收边——均匀一层，横向 / 纵向都不做渐变。头图从页面顶端铺起、页眉压在它上面，可读性由玻璃保证、不赌画面；正文滚过来也一样透出（见[头图与主题接口](/chrome/theming)）。
- **半调网点场**从右缘向左渐隐，只铺到工具区背后（游戏顶栏 `img_back` / 官网左缘网点）；`--ak-chrome-texture` 调强弱或关掉。
- **标语**（ARKNIGHTS WIKI）与**悬停**用活动主色 `--ak-theme-accent`——官网导航当前项那一点青。
- **搜索触发器**：左端深色图标框（游戏 HUD `announce_title_on` 的图标位）+ 矩形浅条；打开时边框与图标框都变主色。试过右端斜切，Tab 焦点描边会被 `clip-path` 裁断，作罢。无 JS 时这里是真的搜索表单，见[搜索面板](/chrome/search)。
- **外观开关**选中项 = 主色实底（游戏 `selected_back` / `toggle_on`），亮暗主题下页眉配色完全一致、不反色。
- **通知徽标**黄底（次强调：未读数不是高危信息，红只留给危险与 NEW）；头像方形细框；页眉里的链接不分已访问色。

## 三列的列头

主行（≥1120）是三列网格 `var(--ak-sidebar-w) minmax(0,1fr) auto`，与下面 `.ak-layout` 同列同 gutter：品牌盖着侧栏列，搜索从正文列左缘起（最宽 560px，与面包屑 / 标题左缘同一条线），工具靠右盖着目录列——页眉是三列各自的「列头」，不是游离的一条。

**页眉不放站点级主导航**：那 8 项与侧栏「通用」组 1:1 重复，没有哪个宽度上「顶栏可见而侧栏不可见」，两处 active 还会打架；导航只由侧栏承担（MW 的 `data-portlets-first` 也只在侧栏渲染一次）。

## 用户菜单

`#p-personal` = `.ak-dropdown > details > summary.ak-header__user + .ak-menu.ak-header__user-card`：用户名抬头 + 两组门户——「界面设置」`#p-user-interface-preferences`（ULS 的语言切换在这里，侧栏不再有 Languages 组）与「个人工具」。颜色不用另写，卡片在页眉子树里，自动是页眉配色。

<SkinFrame :height="420" state="user" />

## 窄屏

- **<1400**：页眉长出第二行 `.ak-local-nav`「二级吸顶栏」——左「菜单」拉出侧栏抽屉（<1120 才出现）、右「本页目录」拉下目录浮层。向下滚动时页眉主行上移收起、只留这条 48px 的二级栏贴顶，向上滚或回到顶部再展开（JS 在 `<html>` 上切 `.ak-condensed`；无 JS 则始终两行，同样可用）。
- **<1120**：主行回到 flex，只留 品牌 / 搜索 / ≡；外观、通知、用户菜单收进 ≡ 拉下、贴主行右下沿的 320px 卡片（不是全屏面板——里面只有三行）。DOM 只有一份：桌面上 `.ak-header__screen` 是 `display: contents`，子项直接参与主行网格；窄屏它变成卡片。
- **≤639**：搜索收成图标按钮（同样打开悬浮面板），标语隐藏，页眉 52px。

开合是**纯 CSS**：`input.ak-nav-cb` + `label.ak-header__burger`（三条线 → ×），checkbox 在 DOM 上必须排在卡片与汉堡之前才能用 `~` 联动，所以主行 DOM 顺序固定为 logo · search · search-toggle · nav-cb · screen · burger（Tab 顺序与视觉一致）。JS 只补 Esc / 点卡片外 / 选了链接 / 回到桌面宽度时收起。二级栏的「菜单」（侧栏抽屉 = 本站唯一的导航）与主行 ≡（外观 / 账户）分工明确，互不重复。

<SkinFrame :width="1024" :height="560" state="nav" caption="1024：≡ 拉下的工具卡片（外观 / 通知 / 用户）" />

<SkinFrame :width="1024" :height="560" state="condensed" caption="1024：向下滚过之后，主行收起，只留二级吸顶栏" />

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
  <div class="ak-local-nav">
    <button type="button" class="ak-local-nav__btn ak-local-nav__menu" aria-controls="ak-sidebar" aria-expanded="false">…菜单</button>
    <input type="checkbox" id="ak-toc-toggle" class="ak-toc-cb">
    <label class="ak-local-nav__btn ak-local-nav__toc" for="ak-toc-toggle">本页目录<span class="ak-local-nav__chevron"></span></label>
  </div>
</header>
```

## CSS

<CssClasses :files="['chrome/header.css', 'chrome/local-nav.css', 'chrome/theme-toggle.css']" />

<CssSelectors :files="['chrome/header.css', 'chrome/local-nav.css', 'chrome/theme-toggle.css']" />
