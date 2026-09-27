---
title: 职业 / 分支 Profession
component: profession
---

职业、分支图标都是 torappu 解包的游戏原图（`profession_large_hub` / `ui_sub_profession_icon_hub`）：白色图形，暗色主题原样、亮色主题由 CSS 反相为黑（`--ak-glyph-filter`），不用准备两套图。图片地址由调用方传。

## 八大职业

写了 `name` 就作图标的 `alt`，并默认作悬停提示（`tip` 可改写，`tip=false` 关掉）；不写 `name` 是装饰图标——旁边已经有文字时这么用。

@demo Profession/Professions

## 尺寸 · 外观

`sm` 22 · 默认 32 · `lg` 48 · `xl` 72（px 边长），图占 82%。`box` 深底白图，两套主题不变（同游戏内）；`outline` 加 1px 描边。

@demo Profession/Variants

## 分支 · 带文字

`AkProfessionLabel` 输出 `.ak-prof-label`：图标 + 中文名 + Bender 英文小字（`en`），`href` 让名字成为链接——干员页「特性」的分支格就是它。`src` 默认画成分支图标（`AkProfession branch` = `.ak-subprof`，26px、图占 90%）；要职业图标等别的写法时放进 `#icon` 插槽。表格里只要一枚分支图标时直接用 `<AkProfession branch>`。

@demo Profession/Branch

## 职业色

8 个职业各有一枚图表 / 筛选高亮用的颜色（非官方，社区常用配色降饱和）：容器写 `data-prof="pioneer | warrior | tank | sniper | caster | medic | support | special"` 得到 `--ak-p`，或直接用 `--ak-prof-<职业>`。

```html demo
<div class="ak-flex ak-wrap ak-gap-2">
  <span data-prof="pioneer" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">先锋</span>
  <span data-prof="warrior" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">近卫</span>
  <span data-prof="tank" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">重装</span>
  <span data-prof="sniper" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">狙击</span>
  <span data-prof="caster" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">术师</span>
  <span data-prof="medic" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">医疗</span>
  <span data-prof="support" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">辅助</span>
  <span data-prof="special" class="ak-tag" style="background: var(--ak-p); color: #1d1f20">特种</span>
</div>
```

## Vue API

### AkProfession

<PropsTable of="AkProfession" />

### AkProfessionLabel

<PropsTable of="AkProfessionLabel" />

## CSS 实现

<CssClasses :files="['arknights/profession.css']" />
