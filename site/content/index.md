<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# MediaWiki 内容样式

L1 是皮肤最重要的一层：把编辑写出来的 wikitext 渲染得好看——标题、链接、列表、表格、图片、目录、引用、消息框、折叠、TabberNeue、分类。这一层的规则全部落在 **MediaWiki 自己输出的 HTML** 上（解析器产物 `.mw-parser-output`，以及分类栏、消息框、差异 / 历史这类核心 UI），编辑不用写任何类名，写普通的 wikitext 就得到这套外观。

所以这一层没有 Vue 实现，也没有 `@demo`：下面各页的示例都是 **MW 原生 DOM**，只换肤；「HTML」页签里的结构就是 MW 实际输出的样子。模板 / Lua 要输出的是设计系统组件（见[组件](/components/)），不是这一层。

源文件在 `packages/css/src/base/`，一块一个文件，按 `base/index.css` 的顺序加载，排在所有组件之前——组件靠同特指度后到覆盖正文排版（层序见[模块与层序](/guide/resourceloader#层序)）。

## 作用域

| 容器 | 是什么 | 这一层在这里做什么 |
|---|---|---|
| `.mw-body-content` | 正文区（皮肤骨架给的容器） | 字号 / 行高 / 颜色；标题色条 |
| `.mw-parser-output` | wikitext 解析产物 | 段距、列表符号、引用块、外链图标、`hr`——只在正文里生效 |
| 全局 | 核心特殊页面、编辑页、弹窗 | 链接色、`code` / `kbd` / `mark`、`.wikitable`、裸表单控件、Codex / OOUI 桥接——这些东西常常不在 `.mw-parser-output` 里（`Special:Version` 的表格、编辑页的按钮），也要一致 |

正文排版规则（标题、段落、列表、引用、链接色）都带 `:not(:where(.ak-not-prose, .ak-not-prose *))`：模板把 `ak-not-prose` 标在输出的最外层，子树就退出正文排版，链接回到 `color: inherit`。为什么要这样见[设计理念 · prose / not-prose](/foundations/principles#prose-not-prose)。

## 文件

| 文件 | 管什么 | 页面 |
|---|---|---|
| `root.css` | html / body 底色与正文字体、选区、焦点环、滚动条、减弱动效 | [本页](#全局基底) |
| `typography.css` | 标题（含编辑段落链接）、段落、链接、行内元素、列表、引用、代码 | [排版](/content/typography) |
| `tables.css` | `.wikitable`、可排序表、Cargo / `mw-datatable` | [表格](/content/tables) |
| `media.css` | 缩略图、浮动与对齐、图库 | [缩略图与图库](/content/media) |
| `toc.css` · `collapsible.css` · `references.css` | 正文内联目录、`mw-collapsible`、参考文献 | [目录 · 折叠 · 引用](/content/toc) |
| `notices.css` | `mw-message-box` / `cdx-message` / `ambox` / hatnote | [消息框](/content/notices) |
| `catlinks.css` | 页面底部分类栏，以及指示器、`hlist`、`navbox` 等 MW 常用工具类 | [分类栏与杂项](/content/catlinks) |
| `tabber.css` | TabberNeue 标签页 | [TabberNeue](/content/tabber) |
| `forms.css` | 裸 `<input>` `<select>` `<button>`、`mw-ui` / Codex 按钮、OOUI、编辑器 | [表单控件](/content/forms) |
| `special-pages.css` | 差异、历史、最近更改、搜索结果、通知、Echo、Minerva | [特殊页面](/content/special-pages) |
| `print.css` | 打印 | [本页](#打印) |

## 全局基底

`root.css` 紧跟 `tokens.css` 加载（MW 里是 `skins.akds.tokens` 模块的第二个文件），所以任何页面——哪怕皮肤的主样式模块还没到——底色和字都已经对了：

- `html` / `body` 底色 `--ak-bg-canvas`，正文字体思源黑体 16px / 1.7（中文长文的行高）。
- 选区 `--ak-selection`（淡青），焦点环 `:focus-visible` 2px `--ak-focus` 描边——鼠标点击不出环，键盘才出。文本类输入框另用 `:focus` 的青边 + 淡青环，见[表单控件](/content/forms)。
- 滚动条细（`scrollbar-width: thin` / 8px），颜色 `--ak-scrollbar`。
- `prefers-reduced-motion: reduce` 时所有动画与过渡缩到 0.01ms——不是 `none`，`animationend` 之类的事件照常触发，依赖它的脚本不会卡住。

<CssSelectors :files="['base/root.css']" />

## 打印

白底黑字；编辑段落链接、`.noprint`、分类栏、指示器、内联目录不打印；链接退回继承色 + 下划线；表头浅灰。皮肤骨架那一半（页眉、侧栏、目录导轨、页脚、动作簇、回到顶部）在 `chrome/responsive.css` 的 `@media print` 段，见[皮肤骨架 · 响应式](/chrome/responsive#打印)。

<CssSelectors :files="['base/print.css']" />
