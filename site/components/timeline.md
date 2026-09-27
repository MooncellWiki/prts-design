---
title: 时间线 Timeline
component: timeline
---

左侧一条 2px 竖线 + 菱形节点的时间序列：版本记录、活动排期、剧情节点。节点空心 = 未到 / 普通，主色实心 = 已发生（`done`）或当前（`active`）。时间用 Bender 小字压在标题上方。

## 基本

写法同 Naive UI 的 `n-timeline`：`AkTimeline` 里放若干 `AkTimelineItem`，`time` / `title` / `content` 三段文字，`status` 定节点。

@demo Timeline/Basic

## 标题插槽

标题要带标签 / 链接时用 `#header` 插槽，说明写在默认插槽里（代替 `content`）。

@demo Timeline/Slots

## Vue API

### AkTimeline

只有默认插槽（若干 `AkTimelineItem`），输出 `<ul class="ak-timeline ak-not-prose">`。

### AkTimelineItem

<PropsTable of="AkTimelineItem" />

## CSS 实现

放在正文（`.mw-parser-output`）里时 `<ul>` 要标 `ak-not-prose`：正文列表的方块项目符号（`ul > li::before`）特指度更高，会盖掉菱形节点、改掉缩进（Vue 版已标上）。代价是列表里的链接不再用正文链接色、而是继承文字色——说明里要放链接时留意。

```html demo
<ul class="ak-timeline ak-not-prose">
  <li class="is-done"><span class="ak-timeline__date">2019.04.30</span><div class="ak-timeline__title">公开测试开启</div><div class="ak-timeline__desc">明日方舟正式上线。</div></li>
  <li class="is-active"><span class="ak-timeline__date">2026.08.01</span><div class="ak-timeline__title">2.7.61 版本</div><div class="ak-timeline__desc">当前数据版本。</div></li>
  <li><span class="ak-timeline__date">TBA</span><div class="ak-timeline__title">下一版本</div></li>
</ul>
```

<CssClasses :files="['components/timeline.css']" />
