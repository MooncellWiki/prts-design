<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 响应式

各块的断点规则集中在 `chrome/responsive.css`，放在骨架最后加载——同选择器同特指度的规则靠先后顺序生效（例如 `prefers-reduced-motion` 的 `animation: none` 必须排在对应的 `animation` 之后），所以暂不拆开。断点与 Codex 一致（640 / 1120 / 1680），另加 1400 作为目录导轨的断点。

| 视口 | 骨架的形态 |
|---|---|
| ≥ 1680 | 侧栏、目录导轨加宽到 268px（写在 `:root`，页眉网格与布局共用） |
| 1400 – 1679 | 完整三栏：侧栏 · 正文 · 右侧目录导轨；页眉一行；右下角「回到顶部」 |
| 1120 – 1400 | 页眉长出二级吸顶栏（本页目录）；目录变浮层；「回到顶部」收进目录浮层；向下滚动时页眉主行收起 |
| 640 – 1119 | 侧栏变抽屉（二级栏多出「菜单」）；页眉主行回到 flex，工具收进 ≡ 卡片；正文白纸内边距收到 20px |
| ≤ 639 | 手机：gutter 16、页眉 52px、搜索收成图标、标语隐藏；标题降到 h2 字号；正文白纸左右贴边；目录浮层拉满；动作簇只留图标；页脚两列；wikitable 横向滚动；缩略图不浮动 |

1120–1400 的页面如果没有目录（`.ak-layout--no-toc`），二级栏两个入口都不需要，整条收起。

<SkinFrame :width="1280" :height="720" caption="1280：二级吸顶栏 + 目录浮层入口，侧栏还在" />

<SkinFrame :width="768" :height="720" caption="768：侧栏成了抽屉，页眉只剩品牌 / 搜索 / ≡" />

<SkinFrame :width="390" :height="760" caption="390：手机" />

## 滚动锁

侧栏抽屉与目录浮层开着时锁住页面滚动（参考 VitePress `useBodyScrollLock`），两者共用一把锁、按持有者计数（`window.akdsScrollLock(owner, on)`）：

- 首选 `html.ak-scroll-lock { overflow: hidden }`——不改滚动位置（不像 `body { position: fixed }` 那套会跳回顶部）；
- 有实体滚动条（Windows、「总是显示滚动条」）时同时写 `scrollbar-gutter: stable` 占住滚动条的位置，页面不会左右抖一下；不认 `scrollbar-gutter` 的老桌面浏览器退回拦 wheel / touchmove / 翻页键；
- iOS 上 `overflow: hidden` 拦不住触摸滚动，另拦 touchmove；浮层 / 抽屉自己可滚的区域放行。

## 打印

打印时去掉页眉、头图、侧栏、目录、二级栏、页脚、动作簇、回到顶部，布局退回单列，正文白纸去框去内边距。正文里的那一半（编辑链接、分类栏、指示器不打印，链接恢复下划线）在 `base/print.css`，见[MediaWiki 内容样式 · 打印](/content/#打印)。

## CSS

<CssSelectors :files="['chrome/responsive.css']" />
