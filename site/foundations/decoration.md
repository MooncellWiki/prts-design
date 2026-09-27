# 装饰语言

方舟界面的「签名」不是某个组件，而是一组可叠加的几何装饰：左侧色条 / 短横条 / 斜纹 / 半调网点 / 角标三角 / 黑白反转 / 大写拉丁字 / 白色线稿图标。全部是纯 CSS 类（`src/decor/`），可以叠在任何盒子上。**没有切角、斜切、斜带**——层级与状态靠色条、黑白反转、角标三角表达。

## 色条 + 细框

标题、消息、`pre`、面板头、模组卡、弹层顶条……系统里最常见的强调是「一侧粗色条 + 1px 细框」。直接写 `border-left: 4px` + `border: 1px` 会让浏览器在角上把两种宽度的边**斜接**（miter）出一道小斜边——那也是斜边，系统里不出现。做法：色条和细框都交给 `border-image`，slice 与各边 `border-width` 一致，直角拼接。

```css
border: 1px solid var(--ak-border);
border-left-width: 4px;
border-image: linear-gradient(to right, var(--_c) 4px, var(--ak-border) 4px) 1 1 1 4;
/* 顶部色条同理：border-top-width: 3px; border-image: linear-gradient(var(--_c) 3px, var(--ak-border) 3px) 3 1 1 1; */
```

表格格子里不行（`border-collapse` 的表格里 `border-image` 无效），表头色条改用 `box-shadow: inset 0 3px 0 …` 画在格子里（`.ak-th-accent`）。

```html demo
<div class="ak-message ak-message--accent ak-mb-2" style="padding:8px 12px">色条是 border-left，框是 border-image</div>
<pre class="ak-mb-0" style="padding:8px 12px">pre / 消息 / 面板头 / 模组卡 同一做法</pre>
```

## 斜纹 `.ak-stripes`

危险 / 施工 / 禁用 / 分隔。出处：游戏 `btn_done`、`image_btn_ap_confirm`。

```html demo
<div class="ak-flex-col ak-gap-2">
  <div class="ak-stripes ak-stripes--hazard ak-stripe-bar"></div>
  <div class="ak-stripes ak-stripes--danger ak-stripe-bar"></div>
  <div class="ak-stripes ak-stripes--strong" style="height:28px;border:1px solid var(--ak-border)"></div>
</div>
```

## 半调网点 `.ak-halftone`

游戏内蓝色标题条的网点渐隐。

```html demo
<div class="ak-flex-col ak-gap-2">
  <div class="ak-blue-band ak-halftone"><span>公开招募</span><span class="ak-en ak-fs-xs" style="opacity:.8">RECRUIT</span></div>
  <div class="ak-halftone ak-inverse" style="padding:10px 14px;font-weight:700">终端 TERMINAL</div>
</div>
```

## 角标三角 `.ak-corner`

官网右上角三角 / 游戏内选中角标。

```html demo
<div class="ak-grid ak-grid-2 ak-gap-3">
  <div class="ak-corner ak-bg-surface-2" style="padding:12px">选中角标（左上）</div>
  <div class="ak-corner ak-corner--tr ak-corner--yellow ak-corner--lg ak-bg-surface-2" style="padding:12px">右上黄色（UP）</div>
</div>
```

## 白色线稿图标 `.ak-glyph`

游戏图标是白色线稿；亮色主题下 `filter: var(--ak-glyph-filter)` 自动反相（切一下外观看看）。

```html demo
<div class="ak-flex ak-gap-3 ak-items-center"><img class="ak-glyph" src="assets/profession/warrior.png" width="40" alt=""><img class="ak-glyph" src="assets/elite/elite_2_large.png" width="44" alt=""><span class="ak-glyph-box" style="width:44px;height:44px"><img class="ak-glyph" src="assets/profession/caster.png" width="34" alt=""></span><img class="ak-glyph" src="assets/camp/lgd.png" width="44" alt=""></div>
```

## 黑白反转 `.ak-inverse`

游戏内 `btn_on` / `btn_off`：主动作靠明度反转而非彩色。

```html demo
<div class="ak-flex ak-gap-2"><span class="ak-inverse" style="padding:8px 16px;font-weight:700">开始行动</span><span class="ak-bg-surface-2" style="padding:8px 16px;border:1px solid var(--ak-border-strong)">取消</span></div>
```

## 网格 / 点阵 / 边角括号 / 水印

```html demo
<div class="ak-grid ak-grid-3 ak-gap-3">
  <div class="ak-bg-grid" style="height:72px;border:1px solid var(--ak-border)"></div>
  <div class="ak-bg-dots" style="height:72px;border:1px solid var(--ak-border)"></div>
  <div class="ak-brackets" style="height:72px;border:1px solid var(--ak-border)"></div>
  <div class="ak-relative" style="height:80px;overflow:hidden;border:1px solid var(--ak-border);grid-column:1/-1"><span class="ak-watermark">RHODES</span></div>
</div>
```

## 双箭头 · 编号 · 横幅

```html demo
<div class="ak-flex-col ak-gap-3">
  <div class="ak-news"><span class="ak-news__label">Breaking News</span><span class="ak-news__text">「怒号光明」复刻开启 · 新干员「维什戴尔」限时寻访 · <a href="#">查看活动一览</a></span></div>
  <div class="ak-flex ak-gap-3 ak-wrap ak-items-center"><a class="ak-chevrons" href="#">查看全部干员</a><span class="ak-code-id">Chapter 08 // Roaring Flare</span></div>
</div>
```
