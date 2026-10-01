# 字体排印

中文永远用思源黑体（行高 1.7）；大写拉丁展示字只做标题旁英文、编号、数值、水印——**Latin as ornament**。全部字体自托管，不论访客装没装，看到的都是同一套——这也就是上线效果（例外只有一处：Windows 低分屏的正文换微软雅黑，见[低分屏](#低分屏)）。

## 字族

<TokenTable prefix="typography.font" sample="font" />

| 角色 | 自托管 | 来源 / 说明 |
|---|---|---|
| 展示字 | **Novecento Sans Wide** 500 / 600 / 700 / 800 | 官网静态资源原文件（web.hycdn.cn），只补了 `gasp` 表（见[低分屏](#低分屏)）。商用字（Synthview）；PRTS.wiki 为明日方舟官方赞助站点，按与鹰角同一组织下共用授权使用，不可转授 |
| HUD 标签 / 数值 | **Bender** 400 / 700 | 同上；也是展示字链的第二位 |
| 正文 | Noto Sans SC 可变字重 100–900（= 思源黑体的 Google 构建） | OFL；沿用 Google Fonts 的 101 片 `unicode-range` 切分（共 ≈ 4.5MB），一页只下载用到的几片 |
| 压缩字 | Oswald 可变字重 200–700 | OFL；官网也自托管 Oswald。同时是展示字链在 Novecento / Bender 之后的接字 |
| 标签缺字 | Chakra Petch 400 / 500 / 600 / 700 | OFL；同为方形 HUD 字，只在 Bender 缺字时逐字顶上 |
| 等宽 | JetBrains Mono 可变字重 100–800，正体 + 斜体 | OFL；语法高亮的注释用斜体 |

`packages/css/src/fonts.css`（121 条 `@font-face`，`font-display: swap`）与 `packages/css/src/fonts/` 由 `python3 scripts/fetch-fonts.py` 生成（官网同源两族抓官网静态资源，OFL 四族取 Fontsource 的 npm 包，版本钉死）；各族目录里的 `NOTICE.md` / `LICENSE` 记着来源与授权。字体链（上表 `--ak-font-*`）的后段——装机备选、系统字——只在字体模块被关掉时起作用：MW 上字体是独立的 `skins.akds.fonts` 模块，可以整体关掉（低带宽 / 用户偏好 / Gadget）。

官网发布的 Novecento / Bender 是 **ASCII 子集**（各 101 字形：A–Z a–z 0–9 与 ASCII 标点）：`·` `»` `—` `–` `…` `×` `°` 这类非 ASCII 字符逐字回退到后一段（展示字落到 Oswald、标签落到 Chakra Petch），两者风格相近，视觉上是间隔号 / 破折号级别的差异；日后拿到全字符集文件，替换 `packages/css/src/fonts/` 里同名 woff2 即可（同样要补 `gasp` 表：放进 `SITE_FONTS` 重跑 `fetch-fonts.py`，或手动过一遍其中的 `with_gasp`）。拉丁 OFL 字体只带 latin + latin-ext 子集（拼音声调在 latin-ext）。

## 字号

<TokenTable prefix="typography.font-size" sample="size" />

## 低分屏

Windows 100% / 125% 缩放（< 1.5dppx，`@media (max-resolution: 1.49dppx)`）下，一个字只分到「字号」那么多个设备像素：字体有没有 hinting、走哪种渲染模式、中文小字有多小，都会直接露出来。高分屏（macOS、手机、Windows 150% 以上）看不出这些问题，下面三条也都只在低分屏或 Windows 上起作用：

- **正文链换微软雅黑**：Noto Sans SC 的 web 切片没有 hinting，DirectWrite 小字号下发虚；低分屏把 `Microsoft YaHei` 提到 Noto 前面（`--ak-font-body`），没装雅黑的系统照旧落到 Noto。
- **官网同源两族补了 `gasp` 表**：原文件没有 `gasp`，Bender Bold 的 `maxp` 又残留着「带指令」的标记，Chrome 在 Windows 上就把 ≤ 20px 的 Bender Bold 当成「为 GDI 调过 hinting」的字，只做横向抗锯齿，0 3 5 9 这类数字的曲线顶 / 底出锯齿。`scripts/fetch-fonts.py` 落盘时补一张 version 1 的 `gasp`（全字号含 symmetric smoothing，同 Fontsource 各族），字形 / 度量 / 其它表不动。
- **中文小字不小于 12px**：9–11px 的中文在 1× 屏上换哪款字都糊。低分屏下 `--ak-fs-overline` 从 11 抬到 12；组件里可能出现中文的 9–10px 小字（卡片副题、解锁条件、标签、页签计数、属性格名…）写成 `max(设计字号, var(--ak-fs-cjk-min))`——高分屏照设计字号，低分屏抬到 12px。纯拉丁 / 数字的小字（倒计时单位、关卡码副题、键帽、英文副题）不必套。

<TokenTable prefix="typography.legibility" />

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

- ✅ 用 Bender：属性面板读数 `.ak-attr__value`、统计数值 `.ak-stat__value`、等级 `.ak-level`、倒计时、SP 芯片、关卡码、稀有度 chip、标签、overline / eyebrow 小标签、`ol::marker`——都是**粗体（700）或 ≥ h3 的独立数值 / 编号 / 大写标签**。显式的 HUD 数字类是 `.ak-num`（粗体 Bender，只用于面板级、不进表格）。
- ❌ 不用 Bender：表格数字列（`.wikitable td.num` / `.ak-table .num`）、目录编号、引用角标、diff 行号、最近更改 ±、分页、时间戳、统计的变化量、技能数值行、通知计数徽标（`.ak-badge`：Bender Bold 在 11–12px 下笔画细、字形窄，18px 的圆里读不清）——统一正文字体 + `tabular-nums`（思源的数字默认等宽，列天然对齐）。
- **表格数据数字一律不用 Bender，没有例外**：技能全等级表 / 参数矩阵 / 天赋条件表 / 键值表的数字列都是正文字体；`.ak-num` `.ak-code-id` `.ak-trust` `.ak-item__count` `.ak-elite` 等带数字的 HUD 类落进 `td` / `th` / `.ak-kv > dd` 时，`arknights/table-numerals.css`（方舟组件的最后一个文件）兜底回正文字体，字重 / 字距 / 颜色照旧。

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
