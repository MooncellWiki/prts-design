<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 头图与主题接口

prts.wiki 大活期间会换头图、顶栏底图、站标、侧栏配色（现网 `ext.gadget.seventhStyle` 改的就是这些：`body` 背景大图、`#mw-head` 左右底图、`.mw-wiki-logo`、`#MenuSidebar > p` 渐变）。新皮肤把这些位置抽成一组**接口变量**（令牌 `chrome.*`，生成在 `tokens.css` §2d），活动主题——一份 Gadget 或 `MediaWiki:Common.css`——只在 `:root` 上覆盖变量，**不碰任何选择器**。卸载 Gadget 即恢复默认，不用 purge 页面缓存。

下面是一份示例（`packages/css/src/chrome/demo-theme.css`）：罗德岛主界面昼 / 夜背景做头图（跟随档案 / 终端主题，画从页面顶端铺起，页眉玻璃调到 `.8` 让它多透一点）、警示黄做活动主色、换站标、画布点阵。切文档站的外观看昼夜两幅；上方开关可以关掉它对比默认。

<SkinFrame :height="760" state="demo" />

曾把同一幅画右段裁一条、左缘渐隐塞进页眉当「顶栏底图」（现网 Garanheadright 的做法）——白色图标压在天空上读不清，横向渐入也像贴上去的，去掉了；`--ak-chrome-image` 只留给深色角饰。

## 接口变量

| 接口变量 | 默认 | 作用 |
|---|---|---|
| `--ak-theme-accent` / `-fg` / `-subtle` | `#18D1FF` / `#000` / `rgba(24,209,255,.14)` | 活动主色：页眉标语与悬停、搜索图标框、开关选中项、侧栏 / 目录分组条、页脚斜纹、窄屏工具卡片顶条（正文链接 / 选中仍是 `--ak-accent`，想一起换就连它也覆盖）；`-subtle` 是主色的 14% 淡底（页眉里的悬停 / 选中底），换主色时一起写——不用 `color-mix()` 推导，老浏览器也认 |
| `--ak-chrome-bg` / `-bg-solid` | `rgba(8,9,10,.9)` / `#0E0F10` | 页眉玻璃（半透明，头图 / 滚过来的正文在下面均匀透出；想让头图多透一点调 alpha 到 .78–.85，别低于 .72——白色画面之下 `#F2F2F2` 仍 ≥7:1）/ 不透明处（窄屏工具卡片） |
| `--ak-chrome-backdrop` | `none` | 页眉玻璃底下的 `backdrop-filter`（毛玻璃）。默认不开：玻璃 .9 不透明时模糊只透出一成，开不开截图逐像素平均只差 1.4/255，却是滚动时 GPU 上最重的一项——粘性页眉每帧都要把底下重糊一遍。玻璃调淡、确实要毛玻璃的主题再设 `saturate(1.4) blur(10px)` 之类 |
| `--ak-chrome-fg` / `-fg-2` / `-fg-muted` | `#F2F2F2` … | 页眉前景三级 |
| `--ak-chrome-line` / `-line-strong` · `-hover` · `-field` | 白 `.14` / `.32` / `.08` / `.07` | 底线与分隔线 · 悬停底 · 搜索触发器底 |
| `--ak-chrome-image` / `-position` / `-size` / `-repeat` | `none` / `right top` / `auto 100%` / `no-repeat` | **顶栏角饰 / 底纹**：`url(left.png), url(right.png)`（现网 PRTSheadleft 的活动徽章 / Garanheadright 的波纹那种）。画在玻璃之上、不被压暗——只放深色低对比素材，照片请走 `--ak-keyart-image` |
| `--ak-chrome-texture` | `.55` | 右侧半调网点强度 0–1，有角饰时可设 0 |
| `--ak-keyart-image` / `-h` / `-position` / `-size` / `-bg` / `-fade` | `none` / `0` / `center 30%` / `cover` / `transparent` / `96px` | **头图** `.ak-keyart`：从页面顶端铺起、垫在页眉与版面背后的通栏画；`-h` 是页眉之下那段画的高度（画有多高，不是占多高）；`-position` / `-size` 相对整块（页眉 + `-h`）算；底部按 `-fade` 渐隐进画布；≤639 限高 40vw |
| `--ak-keyart-reveal` / `-veil` / `-veil-filter` | `72px` / `60%` / `blur(8px)` | 头图**占多少位**：`-reveal` 是留在版面之上、不被压住的一段高度（不超过 `-h`，没有头图时不占位）——默认只留 72px 一小条，画先露一口气、版面不贴着页眉，其余垫在版面背后；0 = 完全不占位，设成 `-h` 就是一条横幅带；各宽度相同，手机（≤639）上也露这一条（那里画高限在 40vw，露出段不超过画高）。垫在版面背后的那一段先糊、再蒙一层画布色的纱：`-veil` 是版面内容起点处纱的浓度（往下渐浓到 100%），画面越花调得越高，别低于 50%；`-veil-filter` 是纱底下给画加的 `filter`（加在同一幅画的副本上，不是 `backdrop-filter`），`none` 关闭，画面鲜艳的可以再加 `saturate(.6)` 之类 |
| `--ak-canvas-image` / `-position` / `-size` / `-repeat` / `-attachment` | `none` … | **画布底纹**：叠在 body 的 `--ak-bg-canvas` 之上（现网 body 的 bkg 位置）；侧栏 / 目录没有底色，宜低对比 |
| `--ak-logo-image` | （未设） | **站标**：设了就用 `content` 替换 `.ak-header__logo img`（Chromium / WebKit；Firefox 请改 `$wgLogos`） |

各变量的生成值与说明见[色彩 · 页眉 / 头图 / 画布的主题接口](/foundations/color#页眉-头图-画布的主题接口)。

::: warning url() 写绝对地址
接口变量里的 `url()` 请写**绝对地址**（`//media.prts.wiki/…`）：Chromium 把自定义属性里的相对 `url()` 按「使用处」（`chrome/*.css`）解析，Firefox / WebKit 按「声明处」解析，相对地址在两边会指向不同目录。示例主题因此和使用处同放在 `packages/css/src/chrome/`，才写得了相对路径。
:::

一次活动主题就这么多：

```css
/* MediaWiki:Gadget-eventStyle.css（或直接写进 MediaWiki:Common.css） */
:root {
  --ak-theme-accent: #72a330;  --ak-theme-accent-subtle: rgba(114, 163, 48, .14);   /* 淡底 = 主色的 14% */
  --ak-keyart-image: url(//media.prts.wiki/…/kv.jpg);  --ak-keyart-h: 280px;   /* 头图从页面顶端铺起，垫在页眉与版面背后，只留 72px 一小条 */
  --ak-chrome-bg:    rgba(8, 9, 10, .8);                                     /* 可选：玻璃调淡让头图多透一点（默认 .9） */
  --ak-chrome-image: url(//media.prts.wiki/…/headleft.png);  --ak-chrome-image-position: left top;   /* 可选：顶栏角饰，只放深色低对比素材 */
  --ak-logo-image:   url(//media.prts.wiki/…/logo.png);                          /* Chromium / WebKit 生效；Firefox 请改 $wgLogos */
  --ak-canvas-image: url(//media.prts.wiki/…/bkg.png);  --ak-canvas-size: 100% auto;  --ak-canvas-repeat: no-repeat;
}
html.skin-theme-clientpref-night { --ak-keyart-image: url(//media.prts.wiki/…/kv-night.jpg); }   /* 终端模式换夜景（可选） */
```

- 头图取景：`--ak-keyart-position` / `-size` 相对「页眉 + 画高」整块算（页眉 56 + `--ak-keyart-h`；手机上页眉 52）；头图不必自己压暗 / 洗白——页眉靠玻璃的 alpha，版面靠 `--ak-keyart-veil-filter` 的模糊加 `--ak-keyart-veil` 那层纱。
- 头图默认只占 72px（`--ak-keyart-reveal`，手机上也是）：页眉之下先露一小条画，侧栏 / 页面标题 / 目录从那以下压在画上。想多露一些设 `--ak-keyart-reveal: 96px` 之类，想顶满设 0；要旧的横幅带就设成与 `-h` 相等。露出段会把侧栏导轨往下推：还没吸顶时导轨限高跟着减掉这一截（见[侧栏](/chrome/sidebar)），首屏也整条在视口里、只滚侧栏就能到底。
- **页眉本身在两套主题下都是黑的**，所以角饰 / 站标只需准备一套；头图与画布图要分昼夜，就按 `html.skin-theme-clientpref-day | night` 分写（跟随系统时另加 `@media (prefers-color-scheme: dark)` 分支，`demo-theme.css` 里有写法）。
- 只换 `--ak-theme-accent` 时正文不动，只有「框」在换——这是有意的：活动皮不该把内容页读起来的对比度也一起赌上。想连正文的链接 / 选中色一起换，再覆盖 `--ak-accent`（亮 / 暗各写一次）。

## 头图

`.ak-keyart` 是垫在 `.ak-layout` 背后的一幅通栏画，皮肤恒输出、默认 `--ak-keyart-h: 0`。它是「背景」不是「横幅」：盒子的下外边距取负，把自己的高度还给版面，侧栏 / 页面标题 / 目录照常从页眉之下排起、压在画上，头图不把正文往下推（现网是整幅 body 背景 + 内容负 `margin-top` 顶上去，效果相同）；`--ak-keyart-reveal` 是留在版面之上不被压住的一段，默认 72px——顶满的话版面第一行贴着页眉、正好压在画最清楚的地方，留一小条两边都透气。画从**页面顶端**铺起：盒子上移一个页眉高、再用同样的 `padding-top` 把内容压回页眉之下，于是画的顶端在粘性页眉（更高的 z-index）背后——页眉是压在画上的一块均匀黑玻璃，黑框 + 画是一整块，不是「顶栏一张、头图一张」两段裁切。底部按 `--ak-keyart-fade` 渐隐进画布色（取 `min(-fade, -h)`：高度为 0 时不会往页眉后面画渐隐）；`--ak-keyart-bg` 默认透明。

可读性不赌画面：被版面压住的那一段先糊、再蒙纱——`::before` 用 `background: inherit` 抄一份同样的画、按 `--ak-keyart-veil-filter`（默认 `blur(8px)`）加 `filter` 糊开，`::after` 蒙一层画布色的纱，到版面内容起点浓到 `--ak-keyart-veil`（默认 60%）、往下渐浓到画布色——亮色主题下画被洗白、暗色主题下被压暗，侧栏与标题的文字照常读得清。

为什么要先糊：只蒙纱时，画里的锐边（钢梁、斑马纹）在 60% 的纱下照样清楚，亮色主题看着像隔着一层磨砂膜看照片（暗色主题是黑纱压暗图，暗部本来就差不多，看不出来）；细节先糊掉、再被纱盖住，读起来才是雾或景深。纱和模糊都从露出段的下半截开始渐入，浓度先缓入、再匀速浓到底，接缝处斜率连续——折线式的浓度在斜率突变处有一道马赫带，压在画上就是雾的一条上沿。纱不用 `color-mix()`：上半段是画布色实色块加字面量 alpha 的 `mask-image`、整体 `opacity: var(--ak-keyart-veil)`，下半段与底部渐隐是 `transparent` → 画布色的两色标渐变，所以 Chrome 78 / Firefox 70 / Safari 13.1 起都能用。让画自己 `mask-image` 淡出替代不了这层纱：画布是纯色时两者算出来是同一张图；饱和度对这类灰调的画也几乎不起作用。没有头图垫底段（横幅带）时纱和模糊都不出现，只剩底部渐隐。层序不靠 `z-index`：`.ak-keyart`、`.ak-sidebar`（sticky）、`.ak-main`（relative）都是定位盒，后两者在 DOM 里靠后，自然画在头图之上。

糊的是副本，不是用 `backdrop-filter` 糊背后：画是静止的，副本加 `filter` 光栅化一次就进了图块缓存，滚动时不再重算；`backdrop-filter` 每帧都要把背后重糊一遍——现网反馈过首页顶部滚动卡顿，实测首页顶部滚动时 GPU 开销 27 → 9 ms/s，与完全不糊相同，截图逐像素平均只差 0.2/255。副本的盒子与 `.ak-keyart` 的内边距盒同大（`inset: 0`），`background` 的定位 / 尺寸才与本体算得一样，糊的范围靠 `mask-image` 截到垫底段；左右边缘几像素被糊成半透明，压在纱下看不出。

- 头图上要放活动标题 / 倒计时，Gadget 往 `.ak-keyart__inner` 里塞内容（它与页眉三列同宽、在页眉之下，高度 = 露出段 `--ak-keyart-reveal`，默认 72px，放内容要调高）；`.ak-keyart` 带 `aria-hidden`，放可读内容时记得去掉。
- 画布底纹 `--ak-canvas-image` 画在 `body.skin-arknights` 上，叠在 `--ak-bg-canvas` 之上。

## CSS

<CssSelectors :files="['chrome/keyart.css', 'chrome/demo-theme.css']" />
