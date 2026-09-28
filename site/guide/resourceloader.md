# 模块与层序

## ResourceLoader 模块

`skin/skin.json` 里的样式模块按「随组件走」与「只属于皮肤」拆开——组件那一份别的皮肤也能加载（prts-widgets / 模板在 Vector 2022 上用，见[在 Vue / prts-widgets 中使用](/guide/vue#样式从哪来)）：

| 模块 | 内容 | 加载 |
|---|---|---|
| `skins.akds.base` | `bridge-codex.css`（Codex / MW 令牌桥接）+ `base/skin-assets.css`（皮肤持有的素材接口 `--ak-item-bg-*`）+ `base/`（`root.css` html / body 底色、选区、焦点环、滚动条、减弱动效 → 正文排版 / 表格 / 表单 …）；`SkinModule`，同时开启核心的 normalize / elements / content-media / message-box / category / logo 特性 | 只有 AKDS 皮肤 |
| `skins.akds.components` | `tokens.css` + `scope.css`（作用域根）→ `components/` → `decor/` → `arknights/` → `utilities.css` → `forced-colors.css`，**逐文件列出**（80 个）；不写 `dependencies`，令牌自带 | AKDS 皮肤；**别的皮肤上 widget / 模板的入口**：`mw.loader.using("skins.akds.components")`，一个模块就齐 |
| `skins.akds.fonts` | `fonts.css`（121 条 `@font-face`：Novecento Sans Wide + Bender（官网同源）+ Noto Sans SC 101 片 + Oswald + Chakra Petch + JetBrains Mono，`font-display: swap`） | AKDS 皮肤；别的皮肤想要官网字体时再加它。独立成模块是为了能整体关掉（用户偏好 / Gadget / 低带宽），关掉后字体链自然退到装机 / 系统字。RL 只重写 `url()` 路径、不内联（没写 `@embed`），浏览器按 `unicode-range` 只取用到的片；上线时确认 CSSMin 没有改动 `unicode-range` |
| `skins.akds.shell` | `chrome/`（L2 皮肤骨架：页眉 / 头图 / 侧栏 / 页面头 / 目录 / 页脚 / 搜索面板 / 响应式），逐文件列出（15 个） | 只有 AKDS 皮肤 |
| `skins.akds.tokens` | `tokens.css` + `scope.css`（= `skins.akds.components` 的开头两个文件） | **不进皮肤的 `styles`**；别的皮肤上只要令牌（Gadget / 自写样式）时加载。AKDS 皮肤上令牌已随 components 到位，再加载它只是重复一份 |
| `skins.akds.js` | `skin.js` + `sidebar-tree.js` + `search-palette.js` + `search-providers.js`（`packageFiles`）；依赖 `mediawiki.user` / `mediawiki.util` / `mediawiki.cookie` / `mediawiki.api` | 所有页面 |

生产皮肤 Skin:Arknights 是同样的分法，模块名前缀换成 `skins.arknights.`：`base` / `components` / `fonts` / `shell` / `tokens` 的文件列表由它的 `scripts/sync-design-system.sh` 按本仓库 `index.css` 展开写入（`base` 的 `SkinModule` 特性按它自己的 skinStyles 配置；`shell` 逐文件列出 `chrome/`，哪些文件进去由脚本里的 `ADOPTED_CHROME` 定，现在是全部 15 个）；另有 `skins.arknights.icons`（OOUI 图标包）与字母序排在最后的 `skins.arknights.styles`——只装 MediaWiki 胶水 LESS，压在骨架之上。所以 prts.wiki 上别的皮肤用组件写的是 `mw.loader.using("skins.arknights.components")`。

皮肤的 `styles` 是 `skins.akds.base`、`skins.akds.components`、`skins.akds.fonts`、`skins.akds.shell` 四个。这么分是被两条 MediaWiki 的实现细节定下来的（`includes/ResourceLoader/ClientHtml.php` · `FileModule.php`，REL1_43；prts.wiki 现为 1.43.9）：

- **皮肤 `styles` 里的模块在同一个 `load.php` 请求里按模块名字母序输出**——`ClientHtml::makeLoad()` 先 `sort($modules)`，不是 skin.json 里写的顺序。所以字母序就是层叠顺序：`base` < `components` < `fonts` < `shell`。骨架模块因此叫 `shell` 而不是 `chrome`（`chrome` 排在 `components` 前面，页眉就压不住组件了）；`fonts` 与令牌只有 `@font-face` / 自定义属性，排在哪都一样。
  顺带：拆分之前只有两个模块，带 `SkinModule` 特性的那个（当时叫 `skins.akds.tokens`，装着 `tokens.css` + `base/root.css`，与现在同名模块的内容无关）其实排在 `skins.akds.styles` **之后**加载，核心 normalize / elements 的规则反而压在皮肤样式上面；现在 `base` 排第一，核心特性在最前。
- **带 `dependencies` 的模块不是 style-only**（`FileModule::getType()` → `LOAD_GENERAL`），放进皮肤 `styles` 会被跳过（日志里是 "Unexpected general module in styles queue"）。所以 `skins.akds.components` 不靠依赖拿令牌，而是自己带上 `tokens.css` + `scope.css`：别的皮肤 `mw.loader.using` 一个模块就齐；AKDS 皮肤上它已经在 `styles` 里（状态 ready），这行是空操作。
- **动态加载的样式插在哪**：`mw.loader` 把样式 `<style>` 插在 `<meta name="ResourceLoaderDynamicStyles">` 之前——皮肤样式之后、`site.styles`（`MediaWiki:Common.css` / `Vector.css`，由 `OutputPage::buildExemptModules()` 输出在标记之后）之前。所以别的皮肤上 `skins.akds.components` 压得过 Vector 自己的规则，Common.css 里同特指度的规则却压得过它；对照页 / Storybook 的 Vector 宿主因此把现网 `site.styles` 抓成 `site.css` 排在组件样式之后一起比。

## 层序

ResourceLoader 把一个模块的文件拼成一张样式表，**不跟 `@import`**，所以 `skin.json` 逐文件列出。顺序只有一个来源：`packages/css/src/index.css` 与各层 `index.css` 的 `@import` 顺序——

```
fonts → tokens → bridge-codex → base/skin-assets → base（root 在最前）→ scope → components → decor → arknights → utilities → forced-colors → chrome
```

前四个只有 `@font-face` / 自定义属性，位置无关；`tokens` 加上从 `scope` 到 `forced-colors` 这一段就是随组件走的部分（= `skins.akds.components`，也 = npm 包的默认入口 `standalone.css`）。`skin.json`、`packages/css/src/index.css`、预览、Storybook、本站示例全部同序。改了 `index.css`（增删 / 调序文件）之后：

```sh
node scripts/css-order.ts --write   # 同步进 skin/skin.json（五个模块的 styles + 皮肤的 styles 列表）；不带 --write 只检查（CI 用）
```

它检查三件事：皮肤 `styles` 里的模块按**字母序**拼起来、去掉位置无关的文件（`fonts.css` / `tokens.css` / `bridge-codex.css` / `base/skin-assets.css`，脚本逐条核过它们确实只有 `@font-face` / 自定义属性 / `color-scheme`）后，必须等于 `index.css` 的完整展开——即 MW 上的层叠顺序 = 单文件顺序；`standalone.css` 展开后是 `index.css` 的子序列（同序）；皮肤 `styles` 里的模块不带 `dependencies`。

- `chrome/`（皮肤骨架）排在通用组件、方舟组件、工具类与强制色**之后**：页眉里的 `.ak-btn` / `.ak-menu` / `.ak-fab` 等靠同特指度后到覆盖。以前骨架在 `utilities.css` / `forced-colors.css` 之前，挪到最后前核过：工具类在骨架元素上只有 `!important` 的 `ak-only-mobile`，强制色规则与骨架只有一处同特指度冲突（搜索面板的加载条轨道，已在 `chrome/search-palette.css` 里给回），首页 / 干员页在各模式和强制色模式下的计算样式快照都零差异。
- `base/`（正文排版）排在所有组件**之前**：组件靠同特指度后到覆盖正文规则；正文规则本身都带 `:not(:where(.ak-not-prose, .ak-not-prose *))`，模板用 `ak-not-prose` 整块退出（见[设计理念 · prose / not-prose](/foundations/principles#prose-not-prose)）。
- `scope.css` 在 `base/` 之后、组件之前（它是 `skins.akds.components` 的开头）：`body.skin-arknights` / `.ak-scope` 上挂排版基线；别的宿主上还要把宿主的元素规则、裸控件、链接色换成 AKDS 皮肤上组件看到的那一套（见[作用域](/components/scope)）。`base/print.css` 的 body 前景色因此写成 `html body.skin-arknights`，高一档才压得住。
- 每层内部的顺序也有意义：`components/title-reset.css` 在全部组件之后、`keyframes.css` 收齐动画；`arknights/table-numerals.css` 是方舟组件的最后一个；`chrome/responsive.css` 收齐断点、放骨架最后（同选择器同特指度的规则靠先后生效，见[响应式](/chrome/responsive)）。`forced-colors.css` 平时一条都不生效，压在组件层最后。
- 拆分成按组件的文件之前，MW 按 base → skin → components → arknights → utilities 加载，而预览按 base → components → arknights → skin → utilities，两边不一致；现在统一成一套（视觉上验过的顺序）。
- `chrome/demo-theme.css`（示例活动主题）与 `charinfo.css`（干员舞台的换皮草案）不在 `index.css`、也不进 `skin.json`。

## 体积

实测（2026-09，`packages/css/src` 当前内容；gzip 为 `-9`）：

| 部分 | 未压缩 | gzip |
|---|---|---|
| `skins.akds.base`（15 个文件：桥接 + 素材接口 + `base/`） | 59 KB | 17 KB |
| `skins.akds.components`（80 个文件：令牌 + 作用域 + 组件 + 工具类 + 强制色；= `standalone.css` 的展开） | 191 KB | 49 KB |
| `skins.akds.shell`（15 个文件：`chrome/`） | 71 KB | 20 KB |
| **皮肤加载的 CSS 合计**（上三项） | **≈ 321 KB** | **≈ 84 KB** |
| 同上，去掉注释与多余空白后（≈ ResourceLoader 压缩后） | ≈ 198 KB | ≈ 35 KB |
| 字体：`fonts.css`（121 条 `@font-face`，另计） | 111 KB | 32 KB |
| 字体文件 `fonts/`（另计，按需下载） | ≈ 5.0 MB 落盘 | — |
| 别的皮肤上：`skins.akds.components`（去注释空白后） | ≈ 118 KB | ≈ 21 KB |

按文件 / 层（未压缩 / gzip）：tokens 33 / 9 KB · bridge-codex 5.5 / 1.5 KB · scope 13 / 4 KB · base 54 / 15 KB · components 62 / 17 KB · decor 8 / 2.5 KB · arknights 64 / 17 KB · chrome 71 / 20 KB · utilities 7 / 2 KB · forced-colors 4 / 1.5 KB。源码注释很多，未压缩的数字大约三成是注释；线上经 RL 压缩后才是实际传输量。`packages/css/src` 下全部 CSS（含各层 `index.css`、`standalone.css`、不进皮肤的 `charinfo.css` / `demo-theme.css`，不含 `fonts.css`）是 361 KB / 93 KB。

- 需要时可以把 `decor/` + `arknights/` 拆成独立模块，只在内容页加载。
- 字体按需下载：Noto Sans SC 沿用 Google 的 101 片 `unicode-range` 切分（共 ≈ 4.5 MB），一页典型下 5–15 片（每片 2–77 KB）；Novecento（4 × 12 KB）+ Bender（2 × 12 KB）+ 拉丁 OFL 三族（≈ 270 KB）按用到的字重一次性。
- 脚本（未压缩 / gzip）：`skin.js` 21 / 8 KB、`sidebar-tree.js` 14 / 5 KB、`search-palette.js` 35 / 11 KB、`search-providers.js` 9 / 4 KB。面板核心可以拆成独立模块在触发器 hover / focus 时预取（见[搜索面板](/chrome/search#在-mediawiki-里)）。
- 图片：白色线稿 PNG 在 100–200px，建议转 SVG / WebP。
- 缓存：ResourceLoader 版本化；主题类在 `<html>` 上，无 FOUC。
