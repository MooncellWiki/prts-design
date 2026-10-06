<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 侧栏

侧栏是本站**唯一的站点导航**（页眉不放主导航）。行 = 次要文字色，悬停浅底 + 灰色左条，当前页 = 青色左条 + 淡青底 + 加粗——与目录、搜索面板高亮行、菜单项同一套「左 2px 色条」语言。分组标题是 overline 小标签，左侧 2px 活动主色条（活动主题换色时跟着换）。

<SkinFrame :height="760" highlight=".ak-sidebar" />

## 两种内容来源

`chrome/sidebar.css` 对两种结构用同一套样式：

1. **`MediaWiki:Sidebar` 门户** → `.ak-portlet > h3.ak-portlet__title + ul`。首个门户可渲染成 `.ak-portlet--grid`（两列格子）；`.ak-portlet--collapsible` 整组可折叠（示例左上「PRTS Design 预览 · DEMO」那组；标题右侧同样是 + / −，它在两种形态下都是就地开合）。
2. **PRTS 现网的 `#MenuSidebar`**——现网侧栏不是门户，而是一段 wikitext 生成的 `div#MenuSidebar`，结构原样支持，不用改现网 wikitext：

```
div#MenuSidebar
  ul > li > a                       无标题的首组（首页 / 支持我们 / 反馈与建议）
  p                                 分组标题（热门页面 / 菜单 / 探索 / 管理与编辑）
  ul > li > b + ul > li > a         '''粗体''' = 有子级的分组项
  …任意深度
```

`.ak-sidebar p` 与 `.ak-portlet__title` 是同一套分组标题；`li > b` 与 `li > a` 是同一套行；`li > ul` 缩进 + 左侧导轨、默认折叠；`li.mw-empty-elt` 隐藏；`a.selflink` 高亮为当前页。现网末尾的「Languages」组（语言切换改在页眉用户菜单「界面设置」）与「工具」组（工具箱整组搬进标题行的「更多」）在新皮肤下退役，建议从 MenuSidebar 里删掉。现网 `<span style="…">NEW</span>` 角标建议换成 `.ak-tag.ak-tag--sm.ak-tag--new`（放进侧栏行里实测与文字中线差 0.4px）。MenuSidebar 是旧皮肤与新皮肤共用的一页，换成类名后旧皮肤下没有样式，所以旧皮肤退役前现网先留着内联样式，只补了一句 `vertical-align:.1em`：10px 的角标按基线对齐，比 14px 的中文字中线低约 1.7px，`vertical-align: middle` 对的是 x-height 的一半、不管用。现网把 `#MenuSidebar` 移进侧栏的内联脚本在新皮肤里照样工作（`#mw-panel`、`#p-tb` 的 id 都保留），皮肤侧的处理见[skin.mustache 结构 · 侧栏](/guide/skin-template#侧栏与-menusidebar)。

**只给 Vector 看的项**：MenuSidebar 里有些项在新皮肤下另有去处、在 Vector 下没有——「复制短链接」成了标题末尾的链条图标（见[页面头 · 标题](/chrome/page-header#标题)），「常用代码」「编辑指南」「探索」组等进了页脚的链接列。它们不靠皮肤隐藏，而是按皮肤读取：VectorMenuSidebar ≥ 0.1.0 优先读 `MediaWiki:MenuSidebar-vector`，那一页只有一行 <code v-pre>{{MediaWiki:MenuSidebar|vector=1}}</code>；共用的 `MediaWiki:MenuSidebar` 里把只给 Vector 的部分包进 <code v-pre>{{#if:{{{vector|}}}|…}}</code>，Skin:Arknights 直接解析这一页、<code v-pre>{{{vector|}}}</code> 为空，这些项根本不输出。列表里的条件行要接在上一行行尾（<code v-pre>*上一项{{#if:{{{vector|}}}|*只给 Vector 的项}}</code>）：单独占一行的话，条件不成立时留下的空行会把列表断成两个 `<ul>`。侧栏导轨的高度按吸顶位置算，头图露出段（`--ak-keyart-reveal`，默认 72px）会把它往下推——侧栏越短，首屏越容易整条落在视口里。

## 多层树

`sidebar-tree.js`（皮肤与预览共用，无依赖）把 `.ak-sidebar` 里任意深度的 `li > ul` 幂等增强成树：

```
li.ak-tree__branch[.is-open][.is-current-path]
  > (a | b | span).ak-tree__label          原有标签（不是链接时点整行也能切换）
  > button.ak-tree__toggle[aria-expanded][aria-controls][aria-labelledby]
  > ul.ak-tree__list
```

同一份 DOM 有两种形态，按环境二选一。切换钮的记号跟着形态走，两种开法不共用一个图标：飞出是朝右的箭头（子项从右边出来，开合都不变），就地展开是 + / −（同 Panel、Accordion 的开合记号）：

**飞出（桌面）**：能悬停的精确指针、≥1120 时，侧栏带 `.is-flyout`，分支**不就地展开**——侧栏的高度不随点开的分支变，矮窗口里也只需要滚这一小段。

- 悬停分支，右侧飞出 `.ak-flyout` 列出它的子项（`position: fixed` 挂在 body 下，不受侧栏滚动裁切；同 `.ak-menu` 的细框 + 大阴影，青条只给悬停 / 当前项；多层子级在飞出层里全部展开）；移开即收。长的飞出层从页眉下沿起、在自己里面滚；它同样不写 `overscroll-behavior: contain`，滚到头、或根本没有内滚时，滚轮照常带动页面。
- 点击分支（切换钮，或不是链接的标签）把飞出层钉住，移开不收；再点、Esc、点别处收起。
- 页面 / 侧栏滚动时，飞出层（悬停的、钉住的都一样）跟着它那一行走；行滚出侧栏的可见范围才收起。
- 键盘：切换钮上 Enter / Space / → 打开并把焦点移进飞出层，↑ ↓ Home End 在其中移动，Esc / ← 回到切换钮，Tab 收起后从切换钮接着往下走。切换钮的 `aria-expanded` 跟着飞出层开合。
- 当前页所在分支（`a.selflink` / `li.is-active` / `href` 等于当前地址）只高亮：加 `.is-current-path`（标签与切换钮变淡青），不展开。

**树（抽屉 / 触屏 / 关掉飞出时）**：<1120 的抽屉、没有悬停的设备，或 `<aside class="ak-sidebar" data-flyout="off">` / `<html data-akds-flyout="off">`：

- 点击 / 键盘 ← → 就地展开、收起，切换钮收着是 +、展开是 −；展开状态记在 `localStorage['akds-sidebar-tree']`（键 = 分组标题 / 标签路径；可折叠门户的整组开合也记在这里，键 `portlet:<id>`）；作者默认展开写 `li class="is-open"`，用户操作后以记忆为准。
- 当前页所在分支总是自动展开，并加 `.is-current-path`。

`.is-open` 两种形态下都留在 DOM 上，飞出形态只是不显示；窗口跨过 1120 时形态跟着换。晚注入的内容由 MutationObserver 接住。无 JS 时所有层级全部展开。

导轨吸在页眉之下、`max-height` 取视口剩下的高度，超出的在自己里面滚。还没吸住时（首屏被头图露出段 `--ak-keyart-reveal` 往下推了一截），`sidebar-tree.js` 把比吸顶位置低出的那一截写进 `--_y`（随滚动 / 缩放更新，吸住后为 0），限高减掉它——导轨底边始终落在视口底边，首屏也看得到整条滚动条、只滚侧栏就能到底（同 Docusaurus 有公告条时给侧栏菜单补的 `margin-bottom`）；无 JS 时首屏底下那一截要先滚一下页面。它不写 `overscroll-behavior: contain`（同目录导轨、`.ak-menu`）：滚到头，或根本没有内滚时，滚轮照常带动页面；抽屉态页面是锁住的，才写。

<SkinFrame :height="900" state="flyout" caption="悬停「档案」→ 右侧飞出它的子项" />

## 窄屏抽屉

<1120 侧栏变成从左滑出的抽屉（`min(86vw, 300px)`），由页眉最左的「菜单」◧ 打开；遮罩、Esc、点遮罩关闭，焦点回到「菜单」。收起时 `visibility: hidden`——不进 Tab 序和无障碍树，阴影也不会从屏幕左缘漏进来。开着时锁住页面滚动（`html.ak-scroll-lock`），抽屉自己内滚。

<SkinFrame :width="1024" :height="640" state="sidebar" />

## 侧栏脚

`.ak-sidebar__foot`：侧栏底部的一行小字（版本、说明），上面一道细线。

## CSS

<CssClasses :files="['chrome/sidebar.css', 'chrome/sidebar-tree.css']" />

<CssSelectors :files="['chrome/sidebar.css', 'chrome/sidebar-tree.css']" />
