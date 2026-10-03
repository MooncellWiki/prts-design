<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 侧栏

侧栏是本站**唯一的站点导航**（页眉不放主导航）。行 = 次要文字色，悬停浅底 + 灰色左条，当前页 = 青色左条 + 淡青底 + 加粗——与目录、搜索面板高亮行、菜单项同一套「左 2px 色条」语言。分组标题是 overline 小标签，左侧 2px 活动主色条（活动主题换色时跟着换）。

<SkinFrame :height="760" highlight=".ak-sidebar" />

## 两种内容来源

`chrome/sidebar.css` 对两种结构用同一套样式：

1. **`MediaWiki:Sidebar` 门户** → `.ak-portlet > h3.ak-portlet__title + ul`。首个门户可渲染成 `.ak-portlet--grid`（两列格子）；`.ak-portlet--collapsible` 整组可折叠（示例左上「PRTS Design 预览 · DEMO」那组）。
2. **PRTS 现网的 `#MenuSidebar`**——现网侧栏不是门户，而是一段 wikitext 生成的 `div#MenuSidebar`，结构原样支持，不用改现网 wikitext：

```
div#MenuSidebar
  ul > li > a                       无标题的首组（首页 / 复制短链接 / 支持我们 …）
  p                                 分组标题（热门页面 / 菜单 / 探索 / 管理与编辑）
  ul > li > b + ul > li > a         '''粗体''' = 有子级的分组项
  …任意深度
```

`.ak-sidebar p` 与 `.ak-portlet__title` 是同一套分组标题；`li > b` 与 `li > a` 是同一套行；`li > ul` 缩进 + 左侧导轨、默认折叠；`li.mw-empty-elt` 隐藏；`a.selflink` 高亮为当前页。现网末尾的「Languages」组（语言切换改在页眉用户菜单「界面设置」）与「工具」组（工具箱整组搬进标题行的「更多」）在新皮肤下退役，建议从 MenuSidebar 里删掉。现网 `<span style="…">NEW</span>` 角标建议换成 `.ak-tag.ak-tag--sm.ak-tag--new`。现网把 `#MenuSidebar` 移进侧栏的内联脚本在新皮肤里照样工作（`#mw-panel`、`#p-tb` 的 id 都保留），皮肤侧的处理见[skin.mustache 结构 · 侧栏](/guide/skin-template#侧栏与-menusidebar)。

## 多层树

`sidebar-tree.js`（皮肤与预览共用，无依赖）把 `.ak-sidebar` 里任意深度的 `li > ul` 幂等增强成树：

```
li.ak-tree__branch[.is-open][.is-current-path]
  > (a | b | span).ak-tree__label          原有标签（不是链接时点整行也能切换）
  > button.ak-tree__toggle[aria-expanded][aria-controls][aria-labelledby]
  > ul.ak-tree__list
```

- 展开状态记在 `localStorage['akds-sidebar-tree']`（键 = 分组标题 / 标签路径；可折叠门户的整组开合也记在这里，键 `portlet:<id>`）；作者默认展开写 `li class="is-open"`，用户操作后以记忆为准。
- 当前页所在分支（`a.selflink` / `li.is-active` / `href` 等于当前地址）总是自动展开，并加 `.is-current-path`（标签与导轨变淡青）。
- 键盘 ← → 收起 / 展开。晚注入的内容由 MutationObserver 接住。

**悬停飞出**：桌面（能悬停的精确指针、≥1120）悬停一个**收起着的**分支，右侧飞出 `.ak-flyout` 预览它的子项（`position: fixed` 挂在 body 下，不受侧栏滚动裁切；同 `.ak-menu` 的细框 + 大阴影，青条只给悬停 / 当前项）；点击即就地展开并记忆。关闭飞出：`<aside class="ak-sidebar" data-flyout="off">` 或 `<html data-akds-flyout="off">`；触屏自动不启用。

<SkinFrame :height="900" state="flyout" caption="悬停「档案」（收起着）→ 右侧飞出子项预览" />

## 窄屏抽屉

<1120 侧栏变成从左滑出的抽屉（`min(86vw, 300px)`），由页眉最左的「菜单」◧ 打开；遮罩、Esc、点遮罩关闭，焦点回到「菜单」。收起时 `visibility: hidden`——不进 Tab 序和无障碍树，阴影也不会从屏幕左缘漏进来。开着时锁住页面滚动（`html.ak-scroll-lock`），抽屉自己内滚。

<SkinFrame :width="1024" :height="640" state="sidebar" />

## 侧栏脚

`.ak-sidebar__foot`：侧栏底部的一行小字（版本、说明），上面一道细线。

## CSS

<CssClasses :files="['chrome/sidebar.css', 'chrome/sidebar-tree.css']" />

<CssSelectors :files="['chrome/sidebar.css', 'chrome/sidebar-tree.css']" />
