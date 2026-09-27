<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# TabberNeue

`base/tabber.css`：编辑在正文里写的 `<tabber>`（TabberNeue 扩展）。扩展自带的滑动指示条、渐变阴影全部关掉，换成设计系统标签页的样子——细底线 + 3px 青色下划线 + 左上角选中角标（游戏内选中态），悬停浅底。页签过多时横向滚动，不显示滚动条。

```html demo
<div class="tabber">
  <header class="tabber__header"><nav class="tabber__tabs" role="tablist"><a class="tabber__tab" role="tab" href="#tb-a" aria-selected="true">档案</a><a class="tabber__tab" role="tab" href="#tb-b">语音</a><a class="tabber__tab" role="tab" href="#tb-c">时装</a></nav></header>
  <section class="tabber__section"><article class="tabber__panel" id="tb-a" role="tabpanel"><b>默认样式</b>：细底线 + 3px 青色下划线 + 左上选中角标（游戏内选中态）。</article><article class="tabber__panel" id="tb-b" role="tabpanel">语音面板内容。</article><article class="tabber__panel" id="tb-c" role="tabpanel">时装面板内容。</article></section>
</div>
<div class="tabber ak-tabber-block">
  <header class="tabber__header"><nav class="tabber__tabs" role="tablist"><a class="tabber__tab" role="tab" href="#tb2-a" aria-selected="true">精英零</a><a class="tabber__tab" role="tab" href="#tb2-b">精英一</a><a class="tabber__tab" role="tab" href="#tb2-c">精英二</a></nav></header>
  <section class="tabber__section"><article class="tabber__panel" id="tb2-a" role="tabpanel"><b>.ak-tabber-block</b>：游戏内块状标签页，选中项黑白反转（矩形，不斜切）。</article><article class="tabber__panel" id="tb2-b" role="tabpanel">精英一内容。</article><article class="tabber__panel" id="tb2-c" role="tabpanel">精英二内容。</article></section>
</div>
```

示例里的切换由预览脚本模拟；MW 上是 TabberNeue 自己的脚本，皮肤只换外观。

## 变体

变体类必须和 `.tabber` 写在**同一个元素**上（选择器是 `.tabber.ak-tabber-*`）：wikitext 里写成 `<tabber class="ak-tabber-block">`，让类落到 TabberNeue 输出的 `div.tabber` 上；外面包一层 `<div class="ak-tabber-block">` 不生效。（上线前在站点的 TabberNeue 版本上确认 `class` 属性会带到输出上；带不上时由 Gadget 给 `.tabber` 补类。）

| 类 | 外观 |
|---|---|
| （默认） | 下划线式 |
| `ak-tabber-block` | 游戏内块状：页签浅底块，选中项黑白反转；标题栏下 2px 实线。原来的平行四边形「斜切标签页」已去掉——系统里没有斜边 |
| `ak-tabber-boxed` | 卡片式：页签栏与面板都包进细框 |

```html demo
<div class="tabber ak-tabber-boxed">
  <header class="tabber__header"><nav class="tabber__tabs" role="tablist"><a class="tabber__tab" role="tab" href="#tb3-a" aria-selected="true">基础档案</a><a class="tabber__tab" role="tab" href="#tb3-b">综合体检测试</a><a class="tabber__tab" role="tab" href="#tb3-c">档案资料一</a></nav></header>
  <section class="tabber__section"><article class="tabber__panel" id="tb3-a" role="tabpanel"><b>.ak-tabber-boxed</b>：页签栏浅底、面板带框，整块读起来是一张卡。</article><article class="tabber__panel" id="tb3-b" role="tabpanel">综合体检测试内容。</article><article class="tabber__panel" id="tb3-c" role="tabpanel">档案资料一内容。</article></section>
</div>
```

模板 / 小部件里要切换内容，用设计系统的[标签页 Tabs](/components/tabs)（CSS 类 + Vue 组件，有竖排）；`<tabber>` 留给编辑直接写的正文。

## CSS

<CssSelectors :files="['base/tabber.css']" />
