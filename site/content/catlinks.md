<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 分类栏与杂项

`base/catlinks.css`：页面底部的分类栏 `#catlinks`，外加一批 MW / 维基模板常用的小工具类（指示器、`hlist`、`plainlist`、`navbox`、`infobox`、浮动与清除）。

## 分类栏

MW 原生 `#catlinks` 结构不动：`div.catlinks > div.mw-normal-catlinks( a「分类」 + "：" + ul > li > a )`，可选第二行 `div.mw-hidden-catlinks`（隐藏分类，只有开了偏好的编辑者或分类页上可见）。不做芯片盒：一行 = 标签图标 + overline 小标签 + 普通链接（参考 fz.wiki）。

- 图标是 Codex 的 `tag`（`cdxIconTag`）用 mask 画的，与皮肤其余 `.ak-icon` 同源。
- 「：」来自 `colon-separator` 消息、是一个裸文本节点：容器 `font-size: 0` 吞掉它（无 JS 也生效）；皮肤脚本的 `tidyCatlinks()` 再把它删掉、把「隐藏分类」文字包成 `span.ak-catlinks__label`。
- 链接就用全局链接色（含 `:visited` 褪色），这里不重写颜色——重写成 `.catlinks li a { color }` 反而会压过 `a:visited`，分类链接永远不褪色。重定向分类斜体；隐藏分类整行更淡。

```html demo
<div class="catlinks"><div class="mw-normal-catlinks"><a href="#">分类</a>：​<ul><li><a href="#">干员</a></li><li><a href="#">六星干员</a></li><li><a href="#">近卫</a></li><li><a href="#">剑豪</a></li><li><a href="#">龙门近卫局</a></li><li><a href="#" class="mw-redirect">龙门</a></li></ul></div><div class="mw-hidden-catlinks mw-hidden-cats-user-shown">隐藏分类：​<ul><li><a href="#">对原文有修正的页面</a></li></ul></div></div>
```

分类栏在皮肤里放在正文白纸之外、紧贴其下（见[皮肤骨架](/chrome/)）；正文用平铺版式 `.ak-body--flat` 时，它上面补一道分隔线。

## 工具类

| 类 / 元素 | 作用 |
|---|---|
| `.mw-indicators` | 页面状态指示器（`<indicator>`），在页面头右上角 |
| `#contentSub` · `.mw-redirectedfrom` | 标题下的小字（子页面路径、「重定向自」） |
| `#siteSub` · `.printfooter` · `.mw-jump-link` · `.mw-empty-elt` | 不显示 |
| `.hlist` | 横排列表，项之间 ` · ` |
| `.plainlist` | 去掉列表符号与缩进 |
| `.navbox` · `.navbox-title` · `.navbox-group` · `.navbox-list` · `.navbox-even` | 导航框（<code v-pre>{{干员导航}}</code> 这类）：细框、浅底分组列，标题带 4px 青条 |
| `.infobox` · `.toccolours` | 信息框、旧式彩色框：细框 + 浅底 |
| `.floatleft` · `.floatright` · `.center` · `.clear` · `.clearfix` · `.nowrap` · `.noresize` | 同 MW 惯例 |

```html demo
<div class="hlist"><ul><li><a href="#">干员一览</a></li><li><a href="#">敌人一览</a></li><li><a href="#">道具一览</a></li><li><a href="#">关卡一览</a></li></ul></div>
<table class="navbox" style="width:100%">
<tr><th class="navbox-title" colspan="2">龙门近卫局</th></tr>
<tr><th class="navbox-group" style="width:6em">干员</th><td class="navbox-list hlist"><ul><li><a href="#">陈</a></li><li><a href="#">星熊</a></li><li><a href="#">诗怀雅</a></li><li><a href="#">假日威龙陈</a></li></ul></td></tr>
<tr><th class="navbox-group">相关</th><td class="navbox-list navbox-even hlist"><ul><li><a href="#">龙门</a></li><li><a href="#">炎</a></li></ul></td></tr>
</table>
```

## CSS

<CssSelectors :files="['base/catlinks.css']" />
