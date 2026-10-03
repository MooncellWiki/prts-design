<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 目录

`aside.ak-toc`：**一份 DOM、两种形态**，不做第二份目录，也不用角落浮动按钮。皮肤设 `toc: false` 关掉 MW 的内联目录，自己用 `data-toc`（或脚本扫正文标题）渲染这一份。

- **≥1400 右侧导轨**：绝对定位进 `.ak-main` 右内边距让出来的那条导轨，`.ak-toc__inner` 粘性跟随滚动。标题是 overline 小标签 + 2px 活动主色条；下面一道 2px 的阅读进度条；当前小节（scrollspy）= 青色左条 + 青字加粗；层级只靠缩进（竖线只画在最外层）；长标题截断。导轨限高在底部让出 `--ak-toc-clear`（默认 = 右下角 `.ak-fab` 占的 76px），目录长到出内滚时末几项不会被回到顶部按钮盖住；页面没有那枚按钮可设回 `var(--ak-space-2)`。
- **<1400 浮层**：由页眉里的「本页目录」拉下来（它不另起一行，并在页眉那一行、排在工具 / ⋮ 之前），顶边始终贴着页眉下沿（页眉各宽度都只有一行、始终贴顶），右对齐；宽 360px 定宽（≤639 拉满），高最多到视口底（`100dvh`，手机地址栏收放时不被盖住），超出只在浮层里内滚；开着时锁住页面滚动。首项「回到顶部」；浮层开着时 `.ak-fab` 让位，<1120 起 `.ak-fab` 不再出现、只剩这一项（手机上浮动按钮太挡视野）。

<SkinFrame :height="620" :scroll="700" highlight=".ak-toc" caption="1440：右侧导轨，滚到「技能」附近——当前小节高亮，进度条跟着走" />

<SkinFrame :width="1024" :height="620" state="toc" caption="1024：「本页目录」拉下的浮层" />

## 没有 JS 也能开合

开合本身是纯 CSS：`input.ak-toc-cb`（在页眉的 `.ak-local-nav` 一组里）+ `label.ak-local-nav__toc`。浮层和按钮不是兄弟节点，桥接分三级：

1. 有 JS：脚本把 checkbox 状态镜像到 `html.ak-toc-open`——浮层显示的主路径，不依赖 `:has()`，旧内核的手机浏览器也是真浮层；
2. 无 JS、支持 `:has()`：`body:has(.ak-toc-cb:checked) .ak-toc` 纯 CSS 桥接（两条选择器必须分开写——选择器列表里混进不认识的 `:has()` 会让整条规则作废）；
3. 既无 JS（`html.client-nojs`）又不支持 `:has()`：目录退回正文流里的一张静态卡片，始终展开。

JS 只负责生成条目、scrollspy、阅读进度、收起页眉，以及点浮层外 / Esc / 跳转后 / 回到 ≥1400 时收起。点 `label` 时浏览器会再向 checkbox 派发一次 click，「点外部关闭」必须放行 `.ak-toc-cb`，否则一点就关。

scrollspy 取「基准线以上最后一个标题」（参考 VitePress / Docusaurus），基准线 = 每个标题自己的 `scroll-margin-top`：点目录跳到哪项就一定亮哪项；页顶不高亮，页底高亮最后一项；收起的折叠块 / 标签页里的标题跳过。

## 结构

```html
<aside class="ak-toc" id="ak-toc" aria-labelledby="ak-toc-label">
  <a class="ak-toc__top" href="#">…回到顶部</a>               <!-- 仅 <1400 -->
  <div class="ak-toc__inner">
    <div class="ak-toc__title" id="ak-toc-label">目录 · Contents</div>
    <div class="ak-toc__progress" aria-hidden="true"><i></i></div>   <!-- 宽度 = --_p -->
    <ul class="ak-toc__list" data-toc>…</ul>                   <!-- li.is-active 为当前小节 -->
  </div>
</aside>
```

## CSS

<CssClasses :files="['chrome/toc.css']" />

<CssSelectors :files="['chrome/toc.css']" />
