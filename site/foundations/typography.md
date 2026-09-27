# 字体排印

中文永远用思源黑体（行高 1.7）；大写拉丁展示字只做标题旁英文、编号、数值、水印——**Latin as ornament**。全部字体自托管（`src/fonts.css`），人人看到一致。

## 字族

<TokenTable prefix="typography.font" sample="font" />

| 角色 | 自托管 | 来源 / 说明 |
|---|---|---|
| 展示字 | **Novecento Sans Wide** 500–800 | 官网静态资源原文件；PRTS.wiki 为明日方舟官方赞助站点，按与鹰角同一组织下共用授权使用 |
| HUD 标签 / 数值 | **Bender** 400 / 700 | 同上；也是展示字链的第二位 |
| 正文 | Noto Sans SC 可变字重（= 思源黑体） | OFL；沿用 Google Fonts 的 101 片 `unicode-range` 切分，一页只下载用到的几片 |
| 压缩字 | Oswald | OFL；展示字链在 Novecento / Bender 之后的接字 |
| 标签缺字 | Chakra Petch | OFL；同为方形 HUD 字，只在 Bender 缺字时逐字顶上 |
| 等宽 | JetBrains Mono | OFL；语法高亮的注释用斜体 |

官网发布的 Novecento / Bender 是 **ASCII 子集**：`·` `»` `—` `…` `×` 这类非 ASCII 字符逐字回退到后一段（展示字落到 Oswald、标签落到 Chakra Petch），视觉上是间隔号 / 破折号级别的差异。字体模块 `skins.akds.fonts` 可以整体关掉（低带宽 / 用户偏好），关掉后字体链自然退到装机 / 系统字。

## 字号

<TokenTable prefix="typography.font-size" sample="size" />

## 行高 · 字距

<TokenTable prefix="typography.line-height" />
<TokenTable prefix="typography.tracking" />

## 字阶样张

```html demo
<div style="display:grid;grid-template-columns:minmax(0,180px) minmax(0,1fr);gap:14px 20px;align-items:baseline">
  <span class="ak-fs-xs ak-fg-muted">display-xl · 56/1.05</span><div class="ak-display ak-display--xl">ARKNIGHTS</div>
  <span class="ak-fs-xs ak-fg-muted">display · 40/1.05</span><div class="ak-display">OPERATOR<span class="ak-fg-muted"> / 干员</span></div>
  <span class="ak-fs-xs ak-fg-muted">h1 · 32/1.2 · 800</span><div style="font-size:var(--ak-fs-h1);font-weight:800;line-height:1.2">页面标题 · 干员「陈」</div>
  <span class="ak-fs-xs ak-fg-muted">h2 · 24/1.25 · 700</span><div style="font-size:var(--ak-fs-h2);font-weight:700">章节标题 · 技能与天赋</div>
  <span class="ak-fs-xs ak-fg-muted">h3 · 20/1.25 · 700</span><div style="font-size:var(--ak-fs-h3);font-weight:700">小节标题 · 精英化材料</div>
  <span class="ak-fs-xs ak-fg-muted">body · 16/1.7</span><div>正文：龙门近卫局特别督察组组长陈，正依合约前来协助罗德岛的任务。生气的时候很可怕，平常也最好别惹她。</div>
  <span class="ak-fs-xs ak-fg-muted">body-sm · 14/1.6</span><div class="ak-fs-sm">辅助正文：用于表格、卡片描述、图注。行高 1.6，中文最小 12px。</div>
  <span class="ak-fs-xs ak-fg-muted">overline · 11 · .14em</span><div class="ak-overline">Section · 干员档案 · Operator Files</div>
  <span class="ak-fs-xs ak-fg-muted">mono · JetBrains Mono</span><div><code>{{干员|陈|稀有度=6}}</code></div>
</div>
```

## Bender 的使用边界

Bender 是游戏 HUD 字——粗体、大字号、独立出现时才成立。14px 常规字重时笔画细、斜杠 0 读作「Ø」、和思源混排灰度不齐；而且**它的数字是比例宽度**、子集不带 `tnum`，`font-variant-numeric: tabular-nums` 对它无效，数字列对不齐。

- ✅ 用 Bender：属性面板读数、统计数值、等级、倒计时、SP 芯片、关卡码、稀有度 chip、标签、overline / eyebrow 小标签、`ol::marker`——都是**粗体或 ≥ h3 的独立数值 / 编号 / 大写标签**。显式的 HUD 数字类是 `.ak-num`。
- ❌ 不用 Bender：表格数字列、目录编号、引用角标、diff 行号、最近更改 ±、分页、时间戳、技能数值行、通知计数徽标——统一正文字体 + `tabular-nums`（思源的数字默认等宽，列天然对齐）。**表格数据数字一律不用 Bender，没有例外**：HUD 类（`.ak-num` `.ak-code-id` `.ak-item__count` …）落进 `td` / `th` / 键值表 `dd` 时，`arknights/table-numerals.css` 兜底回正文字体。

```html demo
<div class="ak-flex-col ak-gap-3">
  <div class="ak-num" style="font-size:28px">HP 2880 · ATK 610 · DEF 352 · RES 0</div>
  <div class="ak-fs-sm" style="font-variant-numeric:tabular-nums">生命 <b>1684</b> → <b>2188</b> → <b>2880</b> · 攻击 361 → 469 → 610 · 防御 221 → 288 → 352<span class="ak-fg-muted ak-fs-xs">（Bender 数字比例宽度、14px 太细，列对不齐；只在面板级粗体大字上用）</span></div>
</div>
```

## 双语标题

中文标题永远是主角；英文是跟在旁边 / 上方的装饰层（大写、展示字、灰色），不替代中文。`.ak-bilingual` 是装饰语言里的纯排版类（上下两行，`--row` 横排）；带色条的章节标题用[标题 Heading](/components/heading) 组件（英文在右侧，`--stack` 放到上方做 kicker）。

```html demo
<div class="ak-flex ak-gap-6 ak-wrap ak-items-center">
  <div class="ak-bilingual" style="font-size:28px"><span class="ak-bilingual__cn">干员档案</span><span class="ak-bilingual__en">Operator Files</span></div>
  <div class="ak-heading ak-m-0"><h3 class="ak-heading__title" style="border:0;padding:0;margin:0">技能</h3><span class="ak-heading__en">Skills</span></div>
  <div class="ak-heading ak-heading--stack ak-m-0"><span class="ak-heading__en">Chapter 08</span><h3 class="ak-heading__title" style="border:0;padding:0;margin:0">怒号光明</h3></div>
</div>
```

## 拉丁装饰字

```html demo
<div class="ak-flex-col ak-gap-3">
  <div><span class="ak-display" style="font-size:40px">RHODES ISLAND</span></div>
  <div class="ak-bilingual"><span>干员档案</span><span class="ak-en">OPERATOR FILES</span></div>
  <div class="ak-flex ak-gap-4 ak-items-center"><span class="ak-overline">Overline 小标签</span><span class="ak-num ak-fs-h3">2,880</span><span class="ak-code-id">LM04 // CHEN</span><span class="ak-stage-code">1-7</span><span class="ak-stage-code ak-stage-code--hard">H8-4</span></div>
</div>
```
