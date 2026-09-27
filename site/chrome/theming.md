<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 头图与主题接口

prts.wiki 大活期间会换头图、顶栏底图、站标、侧栏配色（现网 `ext.gadget.seventhStyle` 改的就是这些：`body` 背景大图、`#mw-head` 左右底图、`.mw-wiki-logo`、`#MenuSidebar > p` 渐变）。新皮肤把这些位置抽成一组**接口变量**（令牌 `chrome.*`，生成在 `tokens.css` §2d），活动主题——一份 Gadget 或 `MediaWiki:Common.css`——只在 `:root` 上覆盖变量，**不碰任何选择器**。卸载 Gadget 即恢复默认，不用 purge 页面缓存。

下面是一份示例（`src/chrome/demo-theme.css`）：罗德岛主界面昼 / 夜背景做头图（跟随档案 / 终端主题，画从页面顶端铺起，页眉玻璃调到 `.8` 让它多透一点）、警示黄做活动主色、换站标、画布点阵。切文档站的外观看昼夜两幅；上方开关可以关掉它对比默认。

<SkinFrame :height="760" state="demo" />

曾把同一幅画右段裁一条、左缘渐隐塞进页眉当「顶栏底图」（现网 Garanheadright 的做法）——白色图标压在天空上读不清，横向渐入也像贴上去的，去掉了；`--ak-chrome-image` 只留给深色角饰。

## 接口变量

| 接口变量 | 默认 | 作用 |
|---|---|---|
| `--ak-theme-accent` / `-fg` | `#18D1FF` / `#000` | 活动主色：页眉标语与悬停、搜索图标框、开关选中项、侧栏 / 目录分组条、页脚斜纹、窄屏工具卡片顶条（正文链接 / 选中仍是 `--ak-accent`，想一起换就连它也覆盖） |
| `--ak-chrome-bg` / `-bg-solid` | `rgba(8,9,10,.9)` / `#0E0F10` | 页眉玻璃（半透明 + 毛玻璃，头图 / 滚过来的正文在下面均匀透出；想让头图多透一点调 alpha 到 .78–.85，别低于 .72——白色画面之下 `#F2F2F2` 仍 ≥7:1）/ 不透明处（窄屏工具卡片） |
| `--ak-chrome-fg` / `-fg-2` / `-fg-muted` | `#F2F2F2` … | 页眉前景三级 |
| `--ak-chrome-line` / `-line-strong` · `-hover` · `-field` | 白 `.14` / `.32` / `.08` / `.07` | 底线与分隔线 · 悬停底 · 搜索触发器底 |
| `--ak-chrome-image` / `-position` / `-size` / `-repeat` | `none` / `right top` / `auto 100%` / `no-repeat` | **顶栏角饰 / 底纹**：`url(left.png), url(right.png)`（现网 PRTSheadleft 的活动徽章 / Garanheadright 的波纹那种）。画在玻璃之上、不被压暗——只放深色低对比素材，照片请走 `--ak-keyart-image` |
| `--ak-chrome-texture` | `.55` | 右侧半调网点强度 0–1，有角饰时可设 0 |
| `--ak-keyart-image` / `-h` / `-position` / `-size` / `-bg` / `-fade` | `none` / `0` / `center 30%` / `cover` / `transparent` / `96px` | **头图** `.ak-keyart`：从页面顶端铺起、页眉压在它上面的通栏画；`-h` 是页眉之下可见的高度（0 = 不占位）；`-position` / `-size` 相对整块（页眉 + `-h`）算；底部按 `-fade` 渐隐进画布；≤639 限高 40vw |
| `--ak-canvas-image` / `-position` / `-size` / `-repeat` / `-attachment` | `none` … | **画布底纹**：叠在 body 的 `--ak-bg-canvas` 之上（现网 body 的 bkg 位置）；侧栏 / 目录没有底色，宜低对比 |
| `--ak-logo-image` | （未设） | **站标**：设了就用 `content` 替换 `.ak-header__logo img`（Chromium / WebKit；Firefox 请改 `$wgLogos`） |

各变量的生成值与说明见[色彩 · 页眉 / 头图 / 画布的主题接口](/foundations/color#页眉-头图-画布的主题接口)。

::: warning url() 写绝对地址
接口变量里的 `url()` 请写**绝对地址**（`//media.prts.wiki/…`）：Chromium 把自定义属性里的相对 `url()` 按「使用处」（`chrome/*.css`）解析，Firefox / WebKit 按「声明处」解析，相对地址在两边会指向不同目录。示例主题因此和使用处同放在 `src/chrome/`，才写得了相对路径。
:::

一次活动主题就这么多：

```css
/* MediaWiki:Gadget-eventStyle.css */
:root {
  --ak-theme-accent: #72a330;
  --ak-keyart-image: url(//media.prts.wiki/…/kv.jpg);  --ak-keyart-h: 220px;   /* 头图从页面顶端铺起，页眉玻璃压在上面 */
  --ak-chrome-bg:    rgba(8, 9, 10, .8);                                     /* 可选：玻璃调淡让头图多透一点（默认 .9） */
  --ak-logo-image:   url(//media.prts.wiki/…/logo.png);
  --ak-canvas-image: url(//media.prts.wiki/…/bkg.png);  --ak-canvas-size: 100% auto;  --ak-canvas-repeat: no-repeat;
}
html.skin-theme-clientpref-night { --ak-keyart-image: url(//media.prts.wiki/…/kv-night.jpg); }   /* 终端模式换夜景（可选） */
```

- **页眉本身在两套主题下都是黑的**，所以角饰 / 站标只需准备一套；头图与画布图要分昼夜，就按 `html.skin-theme-clientpref-day | night` 分写（跟随系统时另加 `@media (prefers-color-scheme: dark)` 分支，`demo-theme.css` 里有写法）。
- 只换 `--ak-theme-accent` 时正文不动，只有「框」在换——这是有意的：活动皮不该把内容页读起来的对比度也一起赌上。想连正文的链接 / 选中色一起换，再覆盖 `--ak-accent`（亮 / 暗各写一次）。

## 头图

`.ak-keyart` 是 `.ak-layout` 之上的一条通栏画，皮肤恒输出、默认 `--ak-keyart-h: 0` 不占位。画从**页面顶端**铺起：盒子上移一个页眉高、再用同样的 `padding-top` 把内容压回页眉之下（<1400 连二级栏一起探），于是画的顶端在粘性页眉（更高的 z-index）背后——页眉是压在画上的一块均匀黑玻璃，黑框 + 画是一整块，不是「顶栏一张、头图一张」两段裁切。底部按 `--ak-keyart-fade` 渐隐进画布色。

- 头图上要放活动标题 / 倒计时，Gadget 往 `.ak-keyart__inner` 里塞内容（它与页眉三列同宽、在页眉之下）；`.ak-keyart` 带 `aria-hidden`，放可读内容时记得去掉。
- 画布底纹 `--ak-canvas-image` 画在 `body.skin-akds` 上，叠在 `--ak-bg-canvas` 之上。

## CSS

<CssSelectors :files="['chrome/keyart.css', 'chrome/demo-theme.css']" />
