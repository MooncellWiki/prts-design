<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 排版

`base/typography.css`：wikitext 里最常见的那些元素——标题、段落、链接、行内元素、列表、引用、代码。全部是 MW 解析器的原生输出，编辑什么类名都不用写。

## 标题

h2 = 官网式标题：左侧 4px 青色色条 + 1px 细底线 + 底线上 96px 的青色短横条；h3 = 3px 灰色色条；h4–h6 只降字号（h6 大写加字距，给英文小节用）。h1 是页面标题，归皮肤骨架（见[页面头](/chrome/page-header)）。

标题上的「编辑」段落链接平时半透明、悬停标题才显形；触屏没有悬停，一直全显。多条链接（VisualEditor 会再加一条「编辑源代码」）之间的 `|` 由 CSS 画——皮肤的 mustache 模板判断不了「非第一项」。

```html demo
<div class="mw-heading mw-heading2"><h2 id="技能">技能</h2><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="#">编辑</a><a href="#">编辑源代码</a><span class="mw-editsection-bracket">]</span></span></div>
<p>龙门近卫局特别督察组组长陈，正依合约前来协助罗德岛的任务。</p>
<div class="mw-heading mw-heading3"><h3 id="鞘击">技能 1 · 鞘击</h3><span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="#">编辑</a><span class="mw-editsection-bracket">]</span></span></div>
<p>下次攻击造成相当于攻击力 200% 的物理伤害。</p>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>Level 6 · 六级标题</h6>
```

::: warning 标题 DOM
「悬停显形」与编辑链接靠右都要求新版标题 DOM（`<div class="mw-heading"><h2>…</h2><span class="mw-editsection">…</span></div>`）：站点须设 `$wgParserEnableLegacyHeadingDOM = false`。否则解析器仍输出 `<h2><span class="mw-headline">…</span><span class="mw-editsection">…</span></h2>`，这几条规则不生效（标题本身的色条照常）。
:::

## 链接与行内

链接色 `--ak-link`，悬停加 1px 下划线；红链 `a.new` 用 `--ak-link-new`；外链 `a.external` 后面跟一枚 mask 画的外链图标（`currentColor`，随链接色变；`.plainlinks` 里不画）；自身链接 `a.mw-selflink` 不是链接，只加粗。`<mark>` 是淡青底——与 `:target` 引用、表格当前行同一套「高亮」语言，不是荧光笔黄。

```html demo
<p><a href="./%E5%B9%B2%E5%91%98%E4%B8%80%E8%A7%88">普通内链</a> · <a href="#">已访问链接（href="#" 即本页，浏览器视为已访问）</a> · <a href="./%E4%B8%8D%E5%AD%98%E5%9C%A8" class="new">红链（不存在页面）</a> · <a class="external" href="https://ak.hypergryph.com/">外部链接</a> · <a href="#" class="mw-selflink">自身链接</a> · <abbr title="Rhodes Island">缩写</abbr> · <mark>高亮</mark> · <kbd>Ctrl</kbd>+<kbd>K</kbd> · <code>{{模板}}</code> · 上标<sup class="reference"><a href="#">[1]</a></sup></p>
<div class="ak-message ak-message--neutral ak-fs-sm"><div class="ak-message__body">
  <b>已访问 · visited</b>：不换色相（不用紫），就是同一个链接色「褪一层」——亮色 <code>#2C6B88</code>（= 链接色 55% + <code>--ak-fg-muted</code> 45%，白底 5.9:1），暗色 <code>#3F8EA4</code>（= 青 62% + 画布 38%，黑底 5:1）；写死算好的实色，不依赖 <code>color-mix</code>。悬停回到完整的 <code>--ak-link-hover</code>。
  <span class="ak-fg-muted">注意 <code>:visited</code> 里写 rgba / 半透明无效——浏览器为防历史嗅探只取 RGB 丢掉 alpha，所以「透明度」必须混成实色。</span>
  <div class="ak-flex ak-gap-3 ak-wrap ak-items-center ak-mt-2" style="font-weight:600">
    <span style="color:var(--ak-link)">链接</span>
    <span style="color:var(--ak-link-visited)">已访问（褪色青）</span>
    <span style="color:var(--ak-link-hover)">悬停</span>
  </div>
</div></div>
```

整套系统只有青这一种链接色，不出现紫：已访问就是同一个青「褪一层」。令牌与算法见[色彩 · 链接](/foundations/color#链接)。

`hr` 是 1px 分隔线；`hr.ak-hr-accent` 在左端加 96px 青色短横，与 h2 的短横条同一个语汇。

```html demo
<p>上一段。</p>
<hr>
<p>普通分隔线之后。</p>
<hr class="ak-hr-accent">
<p>带短横条的分隔线之后。<small>small 是 14px</small></p>
```

## 列表

无序列表的项目符号是 5px 的青色菱形（正方形转 45°，致敬源石，见[设计理念 · 菱形](/foundations/principles#菱形-源石)；嵌套一层变灰）；有序列表的编号用 Bender 粗体青色（`::marker`）；定义列表 `dt` 加粗、`dd` 缩进。

```html demo
<ul><li>先锋 · 部署费用低，回复部署费用<ul><li>冲锋手 / 尖兵 / 执旗手</li></ul></li><li>近卫 · 近战输出</li><li>重装 · 阻挡与承伤</li></ul>
<ol><li>选择干员</li><li>确认精英化阶段</li><li>查看材料</li></ol>
<dl><dt>信赖</dt><dd>提升至 100% 后属性加成达到上限。</dd><dt>潜能</dt><dd>通过重复获得干员提升。</dd></dl>
```

## 引用与代码

`blockquote`：左侧 4px 青条 + 浅一档的底、次要文字色；`<poem>` 只有一道 1px 左线。`pre`（含 SyntaxHighlight 的 `.mw-highlight`）是下沉底 + 3px 青色色条 + 1px 细框——色条和细框用 `border-image` 直角拼接，不让不同宽度的 border 在角上斜接出一道小斜边（见[装饰语言 · 色条 + 细框](/foundations/decoration#色条-细框)）。行内 `code` 是浅底细框的小块。

```html demo
<blockquote><p>「博士，现在起由我担任你的护卫。」</p><p class="ak-fs-xs ak-fg-muted">—— 陈 · 任命助理</p></blockquote>
<pre>{{干员信息
|名称=陈 |稀有度=6 |职业=近卫 |分支=剑豪
}}</pre>
```

## 工具类

| 类 | 作用 |
|---|---|
| `.ak-not-prose` | 标在模板输出的最外层：子树退出正文排版（[为什么](/foundations/principles#prose-not-prose)） |
| `.ak-hr-accent` | 带青色短横的分隔线 |
| `.ak-text-sm` / `.ak-text-xs` | 14 / 12px |
| `.ak-muted` | `--ak-fg-muted` 次要文字 |

## CSS

正文排版规则上的 `:not(:where(.ak-not-prose, .ak-not-prose *))` 后缀在下表里省略了——它的特指度是 0，不改变原规则的权重。

<CssSelectors :files="['base/typography.css']" />
