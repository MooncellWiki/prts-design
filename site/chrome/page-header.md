<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 页面头

`header.ak-page-header`：正文白纸上方的两行——上行是面包屑（或命名空间小标）与页面状态指示器，下行是页面标题 `h1#firstHeading` 与**页面动作簇**（Citizen 式）。上行没有内容时整行收起、不占高度：主名字空间的页面没有命名空间小标，没有指示器、或只有扩展先放着的空指示器（SMW 的实体检查查到问题前是空的）都算没有内容；脚本事后把指示器填上，这一行会自己出来（`:has()`）。

<SkinFrame :height="360" highlight=".ak-page-header" />

## 标题

h1 思源 32px 800，左侧 8px 青色粗条（比正文 h2 的 4px 粗一档）；英文 / 日文副名放在 `<span class="ak-en">` 里，另起一行、半号、灰色大写。命名空间前缀 `.mw-page-title-namespace` 变灰。手机上随 `--ak-fs-h1` 的窄屏值降到 26px（见[字号 · 窄屏](/foundations/typography#窄屏)）。

标题末尾可以跟一枚**复制短链接**的链条图标 `a.ak-page-heading__shortlink`（现网侧栏首组的「复制短链接」搬到这里，侧栏少一行）：`href` 就是短链接，脚本把点击变成复制，复制后挂 `.is-copied` 一小会儿——图标换成对勾、变绿，不弹通知。字号取 h1 的 70%、与标题隔 .4em。它写在 h1 里、紧跟标题文字：页面脚本往 `#firstHeading` 末尾追加的东西（PRTS 的英文副标题块 `.prts-subname`）排在它后面，图标留在标题自己那一行；它自己不带文字（名字走 `aria-label`），h1 的 `textContent` 仍只是标题。Skin:Arknights 把它插在核心输出的 h1 的末尾。配了 `$wgArknightsShortUrl`（如 `/id/$1`，`$1` 是页面 ID）才输出。

命名空间小标 `.ak-page-header__ns` 与卡片 eyebrow 同一种 overline：不可点的装饰文字，用 `--ak-fg-muted`，不上青（见[设计理念 · DO / DON'T](/foundations/principles#do-don-t)）。

## 动作簇

标题 `flex: 1`，动作簇靠右、底边与标题青条底对齐；标题很长时整簇换到标题下方。不再有 Vector 那样整条下划线的页签——簇里没有「当前」要标。

- DOM 按 MW 菜单顺序输出：`#p-associated-pages`（页面 / 讨论）→ `#p-views`（阅读 / 历史 / 编辑 / ★）→ 变体 → 「更多」；显示顺序由 `order` 定：讨论 → 查看历史 → 编辑 → ★ → 更多。
- **当前态只留给读屏器**：`li.selected`（当前命名空间页签「页面」、「阅读」）是 sr-only（不是 `display: none`，accesskey 还在）——它们只在不是当前态时才是一个动作：讨论页上显示「页面」当返回、历史 / 差异页上显示「阅读」当返回。
- **「编辑」是簇里唯一的主色实底**（`#ca-edit` / `#ca-ve-edit`）；不可编辑时这一格是「查看源代码」`#ca-viewsource`，跟讨论 / 查看历史同一种幽灵按钮——不加框也不提亮，它不是一个鼓励你做的动作。
- **★ 监视**纯图标，已监视（`#ca-unwatch`）黄色。
- **「更多」**= `.ak-menu` 卡片里两组门户：操作 `#p-cactions` · 工具 `#p-tb`。整个工具箱从侧栏搬来，id 不变，`mw.util.addPortletLink('p-tb', …)` 照常；其中「特殊页面 / 上传文件」是站点级的，不进这里，进侧栏站点导航（同 Citizen）。
- **窄簇**：簇里没有一枚看得见的页签时（`$wgArknightsShowPageTools` 关掉、特殊页面——只剩 变体 / 更多），簇比卡片还窄，标题很长、簇换到下一行靠左时贴按钮右对齐的卡片会伸出版心左侧。这时卡片改挂在整簇上、定宽 240px：簇与标题同行（靠右）时卡片右缘贴簇右缘，簇换行（靠左）时卡片左缘贴簇左缘；放不下的长文案折行。有页签的簇比卡片宽，照旧贴按钮右对齐。
- ≤639 只留图标：文字进 sr-only（`title` / accesskey 不变），「更多」只剩 ⋯。整簇只剩图标，有页签也比卡片窄，一律按窄簇走。

<SkinFrame :height="520" state="more" caption="「更多」卡片：操作 + 工具两组门户" />

```html demo bare
<header class="ak-page-header">
  <div class="ak-page-header__top">
    <ul class="ak-breadcrumb ak-m-0"><li><a href="#">首页</a></li><li><a href="#">干员一览</a></li><li aria-current="page">陈</li></ul>
    <div class="mw-indicators"><span class="ak-tag ak-tag--sm ak-tag--outline ak-tag--label">gamedata 2.7.61</span></div>
  </div>
  <div class="ak-page-header__row">
    <h1 id="firstHeading" class="ak-page-header__title">陈<a class="ak-page-heading__shortlink" href="#" title="复制本页面的短链接" aria-label="复制短链接"><svg class="ak-icon" aria-hidden="true"><use href="#i-link"/></svg></a><span class="ak-en">Ch'en · LM04</span></h1>
    <div class="ak-page-tools" id="ak-page-tools">
      <ul class="ak-page-tabs" id="p-associated-pages">
        <li class="selected" id="ca-nstab-main"><a href="#" title="查看内容页面"><svg class="ak-icon"><use href="#i-book"/></svg><span>页面</span></a></li>
        <li id="ca-talk"><a href="#" title="有关内容页面的讨论"><svg class="ak-icon"><use href="#i-talk"/></svg><span>讨论</span></a></li>
      </ul>
      <ul class="ak-page-tabs" id="p-views">
        <li class="selected" id="ca-view"><a href="#"><svg class="ak-icon"><use href="#i-book"/></svg><span>阅读</span></a></li>
        <li id="ca-history"><a href="#" title="该页面过去的修订"><svg class="ak-icon"><use href="#i-history"/></svg><span>查看历史</span></a></li>
        <li id="ca-edit"><a href="#" title="编辑本页面"><svg class="ak-icon"><use href="#i-edit"/></svg><span>编辑</span></a></li>
        <li id="ca-watch"><a href="#" title="将本页面加入监视列表"><svg class="ak-icon"><use href="#i-star"/></svg><span>监视</span></a></li>
      </ul>
      <div class="ak-dropdown ak-page-tools__more">
        <details>
          <summary class="ak-page-tools__btn" title="更多"><svg class="ak-icon"><use href="#i-more"/></svg><span>更多</span></summary>
          <div class="ak-menu ak-menu--right ak-page-tools__card">
            <nav class="ak-menu__group" id="p-cactions" aria-label="操作">
              <div class="ak-menu__label">操作</div>
              <ul>
                <li id="ca-move"><a href="#"><svg class="ak-icon"><use href="#i-move"/></svg><span>移动</span></a></li>
                <li id="ca-protect"><a href="#"><svg class="ak-icon"><use href="#i-lock"/></svg><span>保护</span></a></li>
                <li id="ca-purge"><a href="#"><svg class="ak-icon"><use href="#i-refresh"/></svg><span>刷新</span></a></li>
              </ul>
            </nav>
            <nav class="ak-menu__group" id="p-tb" aria-label="工具">
              <div class="ak-menu__label">工具</div>
              <ul>
                <li id="t-whatlinkshere"><a href="#"><svg class="ak-icon"><use href="#i-linkin"/></svg><span>链入页面</span></a></li>
                <li id="t-permalink"><a href="#"><svg class="ak-icon"><use href="#i-link"/></svg><span>固定链接</span></a></li>
                <li id="t-print"><a href="#"><svg class="ak-icon"><use href="#i-print"/></svg><span>打印版本</span></a></li>
              </ul>
            </nav>
          </div>
        </details>
      </div>
    </div>
  </div>
</header>
```

动作簇的图标由皮肤映射（核心不给 views / associated-pages 的 `icon` 键）：talk → speechBubbles、history → history、edit → edit、viewsource → wikiText、view → eye，讨论页上的命名空间页签换 arrowPrevious 表示返回。

## CSS

<CssClasses :files="['chrome/page-header.css']" />

<CssSelectors :files="['chrome/page-header.css']" />
