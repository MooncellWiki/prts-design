<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 特殊页面

`base/special-pages.css`：不是 wikitext、而是 MW 核心 / 扩展直接渲染的界面——差异、历史、最近更改、搜索结果、通知气泡、Echo、编辑标签。布局都由核心自己的样式模块负责（`mediawiki.diff`、`mediawiki.special.changeslist` …），皮肤只把颜色、字号、强调换成 AKDS 的：

| 界面 | 皮肤做了什么 |
|---|---|
| 差异 `table.diff` | 上下文行浅底；增 / 删行左侧 3px 绿 / 红条，改动的字用 `--ak-success-bg` / `--ak-danger-bg` 淡底（不用饱和色块）；行号等宽数字 |
| 历史 `#pagehistory` · 最近更改 `.mw-changeslist` | 14px；选中的修订 = 淡青底 + 左侧青条（同侧栏当前项）；字节增减 `+128` / `−64` 绿 / 红 / 灰，等宽数字 |
| 搜索结果 `.mw-search-results` | 每条之间细线；标题 17px 加粗；命中词 `.searchmatch` 青色加粗；元数据 12px 灰 |
| 通知 `.mw-notification` | 与消息框同一套：左侧 4px 状态色条 + 细框、直角、大阴影；层级 `--ak-z-toast` |
| `.usermessage`（「你有新留言」）· `.error` / `.warningbox` / `.successbox` | 状态色 |
| 编辑标签 `.mw-tag-marker` | 浅底细框的小块 |
| Echo 通知弹窗 | 底色 / 未读淡青 |
| Minerva（移动端） | 加载了 AKDS 令牌时页眉换底色 |

::: tip 为什么这些示例是「裸」的
这些界面不在 `.mw-parser-output` 里（没有正文排版），示例因此用 `html demo bare`；核心自己的布局样式没有加载，所以看到的是「皮肤这一半」。
:::

```html demo bare
<table class="diff" style="width:100%;border-collapse:collapse">
<tr><td colspan="2" class="diff-lineno">第 12 行：</td><td colspan="2" class="diff-lineno">第 12 行：</td></tr>
<tr><td class="diff-marker"></td><td class="diff-context"><div>|稀有度=6</div></td><td class="diff-marker"></td><td class="diff-context"><div>|稀有度=6</div></td></tr>
<tr><td class="diff-marker" data-marker="−"></td><td class="diff-deletedline"><div>|分支=<del class="diffchange diffchange-inline">剑豪</del></div></td><td class="diff-marker" data-marker="+"></td><td class="diff-addedline"><div>|分支=<ins class="diffchange diffchange-inline">剑豪（近卫）</ins></div></td></tr>
</table>
```

```html demo bare
<ul id="pagehistory" style="list-style:none;padding:0;margin:0">
<li class="selected"><a href="#">2026年8月29日 (六) 17:40</a> <span class="history-user"><a href="#">Doctor</a></span> <span class="comment">（补全模组数据）</span></li>
<li><a href="#">2026年8月20日 (四) 09:12</a> <span class="history-user"><a href="#">Amiya</a></span> <span class="comment">（修正语音记录）</span> <span class="mw-tag-markers"><span class="mw-tag-marker">移动版编辑</span></span></li>
</ul>
<div class="mw-changeslist" style="margin-top:16px"><ul style="list-style:none;padding:0;margin:0">
<li><a href="#">陈</a> · <span class="mw-plusminus-pos">+128</span> · <span class="history-user"><a href="#">Doctor</a></span></li>
<li><a href="#">星熊</a> · <span class="mw-plusminus-neg">−64</span> · <span class="history-user"><a href="#">Amiya</a></span></li>
<li><a href="#">诗怀雅</a> · <span class="mw-plusminus-null">0</span> · <span class="history-user"><a href="#">Kal'tsit</a></span></li>
</ul></div>
```

```html demo bare
<ul class="mw-search-results">
<li class="mw-search-result"><div class="mw-search-result-heading"><a href="#"><span class="searchmatch">陈</span></a></div><div class="searchresult">龙门近卫局特别督察组组长<span class="searchmatch">陈</span>，正依合约前来协助罗德岛的任务。</div><div class="mw-search-result-data">12 KB（1,024 个字）- 2026年8月29日 (六) 17:40</div></li>
<li class="mw-search-result"><div class="mw-search-result-heading"><a href="#">假日威龙<span class="searchmatch">陈</span></a></div><div class="searchresult">假日威龙<span class="searchmatch">陈</span>是游戏《明日方舟》中的六星狙击干员。</div><div class="mw-search-result-data">9 KB（820 个字）- 2026年8月12日 (三) 21:05</div></li>
</ul>
```

皮肤骨架里还有一条相关的：特殊页面的正文白纸内边距收窄（`chrome/special-pages.css`），见[皮肤骨架](/chrome/)。

## CSS

<CssSelectors :files="['base/special-pages.css']" />
