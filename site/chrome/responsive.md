<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 响应式

各块的断点规则集中在 `chrome/responsive.css`，放在骨架最后加载——同选择器同特指度的规则靠先后顺序生效（例如 `prefers-reduced-motion` 的 `animation: none` 必须排在对应的 `animation` 之后），所以暂不拆开。断点与 Codex 一致（640 / 1120 / 1680），另加 1400 作为目录导轨的断点。

| 视口 | 骨架的形态 |
|---|---|
| ≥ 1680 | 侧栏、目录导轨加宽到 228px（写在 `:root`，页眉网格与布局共用） |
| 1400 – 1679 | 完整三栏：侧栏 · 正文 · 右侧目录导轨；右下角「回到顶部」 |
| 1120 – 1400 | 目录变浮层，入口「本页目录」并进页眉那一行、排在工具之前（首项也是「回到顶部」，开着时右下角那枚让位）；右下角「回到顶部」仍在 |
| 640 – 1119 | 侧栏变抽屉，页眉最左多出「菜单」◧；页眉回到 flex（◧ · 品牌 · 搜索 · 本页目录 · ⋮），工具收进 ⋮ 卡片；右下角「回到顶部」收起，只留目录浮层首项；正文白纸内边距收到 20px |
| ≤ 639 | 手机：gutter 16；页眉 52px、全是图标（◧ 菜单 · 品牌 · 目录 · 搜索 · ⋮）；搜索收成图标、标语隐藏；标题档整档收一级（页面标题 26 · h2 22 · h3 18，见[字号 · 窄屏](/foundations/typography#窄屏)）；正文白纸左右贴边；目录浮层拉满；动作簇只留图标；页脚两列；wikitable 横向滚动；缩略图不浮动 |

页眉在所有宽度都只有一行、始终贴顶，不随滚动收起（以前 640–1399 是 主行 + 48px 二级吸顶栏 两行，向下滚动时主行收起）——见[页眉 · 窄屏](/chrome/header#窄屏)。1120–1400 的页面如果没有目录（`.ak-layout--no-toc`），页眉里就没有「本页目录」，看起来与 ≥1400 一样。

<SkinFrame :width="1280" :height="720" caption="1280：「本页目录」并进页眉那一行，侧栏还在" />

<SkinFrame :width="768" :height="720" caption="768：侧栏成了抽屉——页眉一行：◧ 菜单 · 品牌 · 搜索 · 本页目录 · ⋮" />

<SkinFrame :width="390" :height="760" caption="390：手机——页眉只有一行" />

## 滚动锁

只有带遮罩或占满屏宽的层才锁页面滚动：侧栏抽屉，以及手机（≤639）上的目录浮层（参考 VitePress `useBodyScrollLock`），两者共用一把锁、按持有者计数（`window.akdsScrollLock(owner, on)`）。640–1400 的目录浮层、页眉 ⋮ 卡片、下拉菜单（`.ak-menu`）都没有遮罩，不锁页面，也不写 `overscroll-behavior: contain`——滚轮在它们上面滚到头（或它们根本没有内滚）时照常带动页面；`contain` 在没有内滚时也会吞掉滚轮，指针停在上面页面就滚不动。

锁的做法：

- 首选 `html.ak-scroll-lock { overflow: hidden }`——不改滚动位置（不像 `body { position: fixed }` 那套会跳回顶部）；
- 有实体滚动条（Windows、「总是显示滚动条」）时同时写 `scrollbar-gutter: stable` 占住滚动条的位置，页面不会左右抖一下；不认 `scrollbar-gutter` 的老桌面浏览器退回拦 wheel / touchmove / 翻页键；
- iOS 上 `overflow: hidden` 拦不住触摸滚动，另拦 touchmove；浮层 / 抽屉自己可滚的区域放行。

## 打印

打印时去掉页眉（连同「菜单」「本页目录」）、头图、侧栏、目录、页脚、动作簇、回到顶部，布局退回单列，正文白纸去框去内边距。正文里的那一半（编辑链接、分类栏、指示器不打印，链接恢复下划线）在 `base/print.css`，见[MediaWiki 内容样式 · 打印](/content/#打印)。

## CSS

<CssSelectors :files="['chrome/responsive.css']" />
