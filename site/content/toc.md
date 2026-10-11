<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 目录 · 折叠 · 引用

四个小文件：`base/toc.css`（正文内联目录）、`base/collapsible.css`（`mw-collapsible`）、`base/sections.css`（章节折叠，皮肤给每个顶层 h2 的开关）、`base/references.css`（`<ref>` / `<references />`）。

## 内联目录

皮肤的目录在正文右侧导轨 / 窄屏浮层里（`toc: false` + 皮肤自己渲染，见[皮肤骨架 · 目录](/chrome/toc)）。正文里的 `.toc` 是旧式内联目录（`#toc`：旧版解析器输出、模板手写的那种），给它同一套外观：顶部 3px 青条（`border-image` 与 1px 框直角拼接）、编号灰色等宽数字、标题大写加字距。

## 折叠

jquery.makeCollapsible 的 `mw-collapsible`：开关 `[展开]` / `[折叠]` 靠右浮动，方括号由 CSS 画（`mw-collapsible-toggle-default`）。加 `.ak-collapse-box` 变成盒式面板——开关占满一条浅底标题栏，内容在框里；适合「剧透」「完整数据」这类整块收起的内容。

## 章节折叠

prts 并成 Arknights 单皮肤、`m.` 域名回主域之后，手机上 Minerva 那套「点章节标题收起 / 展开」就没了——反馈「新界面折叠功能缺失」说的是这个（干员页的特性 / 获得方式 / 天赋 / 技能、集成战略页的区域 / 事件节点 / 结局……都是顶层章节）。皮肤把它补回来，而且不只手机：

- **一节一开关**：`sections.js`（皮肤与预览共用）把 `.mw-parser-output` 顶层每个 `.mw-heading2` 之后、下一个之前的内容包进 `<section class="ak-section">`（做法同 MobileFrontend 的 `MakeSectionsTransform` / `sectionCollapsing.js`，只折顶层、h3 以下跟着父节走），标题文字前插一枚 + / −（`button.ak-section__toggle`，同 Minerva 把箭头放在标题前；两条渐变拼的记号，同 [Panel](/components/panel) 折叠头 / 目录折叠钮 / 侧栏树）。点标题整行或那枚按钮开合；编辑链接、行内链接、拖选文字不算点。
- **收起 = `hidden="until-found"`**：内容仍在 DOM 里、Ctrl+F 搜得到，命中时浏览器派发 `beforematch`、脚本随即展开；点目录 / 页内链接 / 地址栏带 `#` 跳到收起节里的标题或引用，先展开再滚过去；跳到收起的 h2 本身也展开它（同 Minerva）。不写 `display: none`，那样就搜不到了。
- **收起的样子**：标题行下边距收到 0、连着的收起标题之间只留 `space-3`，全部收起时一页就是一列章节名（Minerva 的样子）；打印全部展开、不出记号。
- **在哪开、默认什么状态**由[阅读设置](/chrome/prefs)决定：「章节折叠」窄屏（默认：只在 ≤639 开，桌面 / 平板不出开关——Minerva 的范围，宽屏有目录导轨不缺导航）/ 全部 / 关闭；「章节默认」展开（默认，反馈里「初始全部展开、后续可收起」就是这一档）/ 收起（窄屏 + 收起 = 原来 Minerva 的行为）。改了或视口跨过 639 立刻重新套用到当前页：关掉时全部展开、`.mw-parser-output` 加 `.ak-sections--off` 藏起开关。不记忆每一节的开合（Minerva 也不记）。
- **不折的页面**：没有顶层 h2 的（首页）、`.mw-parser-output[data-ak-sections="off"]`、`body.ak-no-sections`、MW 首页（`wgIsMainPage`）。再渲染（VE 保存 / 编辑预览）由皮肤在 `wikipage.content` 钩子里重新 `init`。
- **模板不用改**：标题 DOM 还是 MW 1.43 的 `<div class="mw-heading mw-heading2"><h2>…</h2><span class="mw-editsection">…</span></div>`（站点须 `$wgParserEnableLegacyHeadingDOM = false`），脚本只是在它后面包一层 `<section>`、标题文字前插一枚没有文字的按钮（`h2.textContent` 不变，目录 / 搜索照常读标题）。靠 `.mw-parser-output > X` 直接子选择器找内容的 Gadget 会受影响（prts 现网在 Minerva 下跑过同样的结构，没出过问题）。

去[干员页样例](https://mooncellwiki.github.io/prts-design/preview/operator.html)点任一章节标题试试。

## 引用

`<sup class="reference">` 缩小；参考文献列表 14px 次要文字色，`.reflist.ak-cols-2` 分两栏。点角标跳到的那条（`:target`）是淡青底 + 细描边——与 `<mark>`、表格当前行同一套高亮语言；它和点「↑」跳回的角标都同标题一样停在固定页眉下方，不会被盖住（`base/typography.css` 给正文里的 `:target` 加了 `scroll-margin-top`）。

```html demo
<div class="toc" id="toc"><div class="toctitle"><h2>目录</h2><span class="toctogglespan">[<a class="toctogglelabel">隐藏</a>]</span></div><ul><li><a href="#"><span class="tocnumber">1</span> 干员信息</a><ul><li><a href="#"><span class="tocnumber">1.1</span> 属性</a></li><li><a href="#"><span class="tocnumber">1.2</span> 天赋</a></li></ul></li><li><a href="#"><span class="tocnumber">2</span> 技能</a></li><li><a href="#"><span class="tocnumber">3</span> 模组</a></li></ul></div>
<div class="mw-collapsible mw-collapsed ak-collapse-box"><span class="mw-collapsible-toggle mw-collapsible-toggle-default"><a href="#" role="button">展开</a></span><div class="mw-collapsible-content">这里是折叠内容。使用 <code>.ak-collapse-box</code> 变体让 mw-collapsible 变为盒式面板。</div></div>
<div class="mw-references-wrap"><ol class="references"><li id="cite_note-1"><span class="mw-cite-backlink"><a href="#">↑</a></span> <span class="reference-text">《明日方舟》官方网站，鹰角网络。</span></li></ol></div>
```

点「展开」试试（示例里的开合由预览脚本模拟，MW 上是核心的 jquery.makeCollapsible）。

## CSS

<CssSelectors :files="['base/toc.css', 'base/collapsible.css', 'base/sections.css', 'base/references.css']" />
