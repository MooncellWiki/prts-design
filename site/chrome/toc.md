<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 目录

`aside.ak-toc`：**一份 DOM、三种形态**，不做第二份目录。皮肤设 `toc: false` 关掉 MW 的内联目录，自己用 `data-toc`（或脚本扫正文标题）渲染这一份。

- **≥1400 右侧导轨**：绝对定位进 `.ak-main` 右内边距让出来的那条导轨，`.ak-toc__inner` 粘性跟随滚动。标题是 overline 小标签 + 2px 活动主色条；下面一道 2px 的阅读进度条；当前小节（scrollspy）= 青色左条 + 青字加粗；层级只靠缩进（竖线只画在最外层）；长标题截断。导轨限高在底部让出 `--ak-toc-clear`（默认 = 右下角 `.ak-fab` 占的 76px），目录长到出内滚时末几项不会被回到顶部按钮盖住；页面没有那枚按钮可设回 `var(--ak-space-2)`。
- **640–1400 按钮 + 浮层**：目录收成一枚独立的按钮 `label.ak-toc-btn`——与右下角「回到顶部」同款的 44px 反色方块、同一列，图标是方点列表。它平时停在正文纸张的右上角、顶边与纸张的上框线平齐，往下滚就贴在页眉下沿跟着走（Vector 2022 的目录按钮：标题旁 → 滚过后钉在角上）；目录是从它下面拉出的浮层，右缘同按钮，宽 360px 定宽，高最多到视口底（`100dvh`），超出只在浮层里内滚。浮层没有遮罩，开着时页面照常滚（滚轮在浮层上滚到头也带动页面）。首项「回到顶部」；浮层开着时 `.ak-fab` 让位，<1120 起 `.ak-fab` 不再出现、只剩这一项（右侧已经有一枚目录按钮）。

- **≤639 手机**：入口留在页眉那一行——品牌右侧、搜索之前的方点列表图标（`label.ak-local-nav__toc`），不出浮动按钮。浮层固定在页眉下沿、拉满宽度（左右各留一个 gutter），开着时锁住页面滚动。

<SkinFrame :height="620" :scroll="700" highlight=".ak-toc" caption="1440：右侧导轨，滚到「技能」附近——当前小节高亮，进度条跟着走" />

<SkinFrame :width="1280" :height="620" highlight=".ak-toc-btn" caption="1280：目录按钮停在纸张右上角，状态指示器与动作簇都没被压住" />

<SkinFrame :width="1024" :height="620" :scroll="700" state="toc" caption="1024：滚过之后按钮贴着页眉，浮层从它下面拉出" />

<SkinFrame :width="390" :height="620" :scroll="700" state="toc" caption="390：手机上入口在页眉里（方点列表），浮层贴页眉下沿、拉满宽度" />

## 为什么是独立按钮，不放进页眉

以前 <1400 的入口都是页眉里的「本页目录 ⌄」，浮层贴着页眉下沿拉下。它和外观 / 通知 / 用户菜单挤在同一簇，读起来像站点级的控件，而目录属于**这一页**。现在 640–1400 的入口挪回页面里，页眉在 1120–1400 与 ≥1400 完全相同。

手机（≤639）不跟着改：44px 的方块在 390 宽的屏上压住正文第一行的行尾，滚动时一直挡着右上角；页眉那一行本来就全是图标，目录图标（方点列表）留在里面不占正文。

按钮不是 `position: fixed`，而是挂在一条零高度的粘性锚 `.ak-toc-dock` 上（`position: sticky`，粘在页眉下沿再往下 12px 处，紧跟页面标题）：

- 页面顶部它落在纸张右上角；`fixed` 的话会压住页眉正下方的状态指示器 / 动作簇（「更多」就在那一角）。
- 浮层绝对定位在 dock 里，跟着按钮走，不用另算位置。
- dock 的层级比下拉低一档（`--ak-z-dropdown − 1`）：「更多」卡片盖得住它，正文里的粘性表头在它之下。

## 没有 JS 也能开合

`.ak-toc-dock > input.ak-toc-cb + label.ak-toc-btn + aside.ak-toc` 三者是兄弟，开合就是 `.ak-toc-cb:checked ~ .ak-toc`——纯 CSS，不需要 `:has()`，旧内核的手机浏览器、无 JS 都是真浮层。手机上页眉里的 `label.ak-local-nav__toc[for=ak-toc-toggle]` 开合的是同一个 checkbox（一个控件可以有多个 label），浮层照样靠 `:checked ~` 显示；只有它自己的「开着」变色与焦点框够不着 checkbox，走 `html.ak-toc-open` / `body:has()`。checkbox 视觉隐藏但可 Tab 聚焦、空格切换，焦点框画在按钮上；按钮只有图标，`label` 里不放字——无障碍名写在 checkbox 的 `aria-label` 上，悬停提示是 `label` 的 `title`。

JS 只负责生成条目、scrollspy、阅读进度，以及这些收尾：

- 点 dock 外 / Esc / 跳转后 / 回到 ≥1400 时收起（「dock 外」要放行页眉里那个 label：否则这里先收起，label 随后派发给 checkbox 的那次 click 又把它点开）；
- 把状态镜像到 `html.ak-toc-open`，让右下角的 `.ak-fab` 让位、让手机上页眉里的目录图标变色（它们与 checkbox 不是兄弟；无 JS 时 `body:has(.ak-toc-cb:checked)` 桥接，两条选择器必须分开写——选择器列表里混进不认识的 `:has()` 会让整条规则作废）；
- 浮层限高：dock 还没贴住页眉时比页眉低一截，JS 把这一截写进 dock 的 `--_y`（开着时随滚动更新），浮层底才不探出视口。无 JS 时它是 0，页面顶部打开长目录会探出去一截——页面没锁，往下滚一点就全在视口里了；
- ≤639 开着时锁页面滚动。

scrollspy 取「基准线以上最后一个标题」（参考 VitePress / Docusaurus），基准线 = 每个标题自己的 `scroll-margin-top`：点目录跳到哪项就一定亮哪项；页顶不高亮，页底高亮最后一项；收起的折叠块 / 标签页里的标题跳过。

## 结构

```html
<div class="ak-toc-dock">                                       <!-- ≥1400 不占高度；<1400 粘性锚 -->
  <input type="checkbox" id="ak-toc-toggle" class="ak-toc-cb" aria-label="本页目录" aria-controls="ak-toc">
  <label class="ak-toc-btn" for="ak-toc-toggle" title="本页目录"></label>   <!-- 仅 640–1400；只有图标 -->
  <aside class="ak-toc" id="ak-toc" aria-labelledby="ak-toc-label">
    <a class="ak-toc__top" href="#">…回到顶部</a>               <!-- 仅 <1400 -->
    <div class="ak-toc__inner">
      <div class="ak-toc__title" id="ak-toc-label">目录 · Contents</div>
      <div class="ak-toc__progress" aria-hidden="true"><i></i></div>   <!-- 宽度 = --_p -->
      <ul class="ak-toc__list" data-toc>…</ul>                   <!-- li.is-active 为当前小节 -->
    </div>
  </aside>
</div>
```

手机上的入口在页眉的 `.ak-local-nav` 里（见[页眉](/chrome/header#窄屏)）：

```html
<label class="ak-local-nav__btn ak-local-nav__toc" for="ak-toc-toggle" title="本页目录"></label>   <!-- 仅 ≤639 -->
```

页面没有目录时 `.ak-toc-dock` 与页眉里的这个 label 都不输出（`.ak-layout--no-toc` 只藏得掉前者）。

## CSS

<CssClasses :files="['chrome/toc.css']" />

<CssSelectors :files="['chrome/toc.css']" />
