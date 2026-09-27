<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 目录 · 折叠 · 引用

三个小文件：`base/toc.css`（正文内联目录）、`base/collapsible.css`（`mw-collapsible`）、`base/references.css`（`<ref>` / `<references />`）。

## 内联目录

皮肤的目录在正文右侧导轨 / 窄屏浮层里（`toc: false` + 皮肤自己渲染，见[皮肤骨架 · 目录](/chrome/toc)）。正文里的 `.toc` 是旧式内联目录（`#toc`：旧版解析器输出、模板手写的那种），给它同一套外观：顶部 3px 青条（`border-image` 与 1px 框直角拼接）、编号灰色等宽数字、标题大写加字距。

## 折叠

jquery.makeCollapsible 的 `mw-collapsible`：开关 `[展开]` / `[折叠]` 靠右浮动，方括号由 CSS 画（`mw-collapsible-toggle-default`）。加 `.ak-collapse-box` 变成盒式面板——开关占满一条浅底标题栏，内容在框里；适合「剧透」「完整数据」这类整块收起的内容。

## 引用

`<sup class="reference">` 缩小；参考文献列表 14px 次要文字色，`.reflist.ak-cols-2` 分两栏。点角标跳到的那条（`:target`）是淡青底 + 细描边——与 `<mark>`、表格当前行同一套高亮语言。

```html demo
<div class="toc" id="toc"><div class="toctitle"><h2>目录</h2><span class="toctogglespan">[<a class="toctogglelabel">隐藏</a>]</span></div><ul><li><a href="#"><span class="tocnumber">1</span> 干员信息</a><ul><li><a href="#"><span class="tocnumber">1.1</span> 属性</a></li><li><a href="#"><span class="tocnumber">1.2</span> 天赋</a></li></ul></li><li><a href="#"><span class="tocnumber">2</span> 技能</a></li><li><a href="#"><span class="tocnumber">3</span> 模组</a></li></ul></div>
<div class="mw-collapsible mw-collapsed ak-collapse-box"><span class="mw-collapsible-toggle mw-collapsible-toggle-default"><a href="#" role="button">展开</a></span><div class="mw-collapsible-content">这里是折叠内容。使用 <code>.ak-collapse-box</code> 变体让 mw-collapsible 变为盒式面板。</div></div>
<div class="mw-references-wrap"><ol class="references"><li id="cite_note-1"><span class="mw-cite-backlink"><a href="#">↑</a></span> <span class="reference-text">《明日方舟》官方网站，鹰角网络。</span></li></ol></div>
```

点「展开」试试（示例里的开合由预览脚本模拟，MW 上是核心的 jquery.makeCollapsible）。

## CSS

<CssSelectors :files="['base/toc.css', 'base/collapsible.css', 'base/references.css']" />
