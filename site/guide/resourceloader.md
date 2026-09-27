# 模块与层序

## ResourceLoader 模块

`skin/skin.json` 里四个模块：

| 模块 | 内容 | 加载 |
|---|---|---|
| `skins.akds.fonts` | `fonts.css`（121 条 `@font-face`：Novecento Sans Wide + Bender（官网同源）+ Noto Sans SC 101 片 + Oswald + Chakra Petch + JetBrains Mono，`font-display: swap`） | 所有页面，`styles` 首位。独立成模块是为了能整体关掉（用户偏好 / Gadget / 低带宽），关掉后字体链自然退到装机 / 系统字。RL 只重写 `url()` 路径、不内联（没写 `@embed`），浏览器按 `unicode-range` 只取用到的片；上线时确认 CSSMin 没有改动 `unicode-range` |
| `skins.akds.tokens` | `tokens.css` + `base/root.css`（html / body 的底色与正文字体、选区、焦点环、滚动条、减弱动效）；`SkinModule`，同时开启核心的 normalize / elements / content-media / message-box / category / logo 特性 | 所有页面，`<head>` 顶部——哪怕主样式还没到，底色和字已经对了 |
| `skins.akds.styles` | `base/` → `components/` → `decor/` → `arknights/` → `chrome/` → `utilities.css` → `forced-colors.css`，**逐文件列出**（105 个） | 所有页面 |
| `skins.akds.js` | `skin.js` + `sidebar-tree.js` + `search-palette.js` + `search-providers.js`（`packageFiles`）；依赖 `mediawiki.user` / `mediawiki.util` / `mediawiki.cookie` / `mediawiki.api` | 所有页面 |

## 层序

ResourceLoader 把一个模块的文件拼成一张样式表，**不跟 `@import`**，所以 `skin.json` 逐文件列出。顺序只有一个来源：`packages/css/src/index.css` 与各层 `index.css` 的 `@import` 顺序——

```
fonts → tokens → base（root 随 tokens 模块先载）→ components → decor → arknights → chrome → utilities → forced-colors
```

`skin.json`、`packages/css/src/index.css`、预览、Storybook、本站示例全部同序。改了 `index.css`（增删 / 调序文件）之后：

```sh
node scripts/css-order.ts --write   # 同步进 skin/skin.json；不带 --write 只检查（CI 用）
```

- `chrome/`（皮肤骨架）排在通用组件与方舟组件**之后**：页眉里的 `.ak-btn` / `.ak-menu` / `.ak-fab` 等靠同特指度后到覆盖。
- `base/`（正文排版）排在所有组件**之前**：组件靠同特指度后到覆盖正文规则；正文规则本身都带 `:not(:where(.ak-not-prose, .ak-not-prose *))`，模板用 `ak-not-prose` 整块退出（见[设计理念 · prose / not-prose](/foundations/principles#prose-not-prose)）。
- 每层内部的顺序也有意义：`components/title-reset.css` 在全部组件之后、`keyframes.css` 收齐动画；`arknights/table-numerals.css` 是方舟组件的最后一个；`chrome/responsive.css` 收齐断点、放骨架最后（同选择器同特指度的规则靠先后生效，见[响应式](/chrome/responsive)）。`forced-colors.css` 平时一条都不生效，压在最后。
- 拆分成按组件的文件之前，MW 按 base → skin → components → arknights → utilities 加载，而预览按 base → components → arknights → skin → utilities，两边不一致；现在统一成预览那套（视觉上验过的顺序）。
- `chrome/demo-theme.css`（示例活动主题）与 `charinfo.css`（干员舞台的换皮草案）不在 `index.css`、也不进 `skin.json`。

## 体积

实测（2026-09，`packages/css/src` 当前内容；gzip 为 `-9`）：

| 部分 | 未压缩 | gzip |
|---|---|---|
| `skins.akds.tokens`（`tokens.css` + `base/root.css`） | 34 KB | 10 KB |
| `skins.akds.styles`（105 个文件） | 271 KB | 70 KB |
| **皮肤加载的 CSS 合计**（上两项） | **≈ 305 KB** | **≈ 80 KB** |
| 同上，去掉注释与多余空白后（≈ ResourceLoader 压缩后） | ≈ 211 KB | ≈ 35 KB |
| 字体：`fonts.css`（121 条 `@font-face`，另计） | 114 KB | 32 KB |
| 字体文件 `fonts/`（另计，按需下载） | ≈ 5.0 MB 落盘 | — |

按层（未压缩 / gzip）：tokens 32 / 10 KB · base 53 / 15 KB · components 64 / 17 KB · decor 8 / 3 KB · arknights 65 / 17 KB · chrome 72 / 20 KB · utilities 7 / 2 KB · forced-colors 4 / 1.5 KB。源码注释很多，未压缩的数字大约三成是注释；线上经 RL 压缩后才是实际传输量。`packages/css/src` 下全部 CSS（含各层 `index.css`、不进皮肤的 `charinfo.css` / `demo-theme.css`，不含 `fonts.css`）是 344 KB / 89 KB。

- 需要时可以把 `decor/` + `arknights/` 拆成独立模块，只在内容页加载。
- 字体按需下载：Noto Sans SC 沿用 Google 的 101 片 `unicode-range` 切分（共 ≈ 4.5 MB），一页典型下 5–15 片（每片 2–77 KB）；Novecento（4 × 12 KB）+ Bender（2 × 12 KB）+ 拉丁 OFL 三族（≈ 270 KB）按用到的字重一次性。
- 脚本（未压缩 / gzip）：`skin.js` 21 / 8 KB、`sidebar-tree.js` 14 / 5 KB、`search-palette.js` 35 / 11 KB、`search-providers.js` 9 / 4 KB。面板核心可以拆成独立模块在触发器 hover / focus 时预取（见[搜索面板](/chrome/search#在-mediawiki-里)）。
- 图片：白色线稿 PNG 在 100–200px，建议转 SVG / WebP。
- 缓存：ResourceLoader 版本化；主题类在 `<html>` 上，无 FOUC。
