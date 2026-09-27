---
title: 计数徽标 Badge
component: badge
---

未读计数 / 未读点。**默认黄**（次强调「提示」），不走红：红只留给危险与 NEW / BREAKING，未读数不是高危信息；Echo 的 alerts 类（回退 / 权限变更）才用 `danger`。NEW 角标是[标签](/components/tag)的 `variant="new"`，不是徽标。

数字是正文字体 700 12px + 等宽数字（不用 Bender：11–12px 下它比思源黑体细窄，黑字落在黄圆里读不清）；高 18px，单个数字是正圆、两位以上才拉成胶囊。

## 颜色 · 封顶 · 圆点

写法同 Naive UI 的 `n-badge`：`value` 数字或短串，`max` 封顶显示「99+」，`dot` 只出一个点；`value` 为 0 时默认不显示，`show-zero` 让它显示。

@demo Badge/Variants

## 骑在内容上

默认插槽写了内容（图标按钮、头像）时，徽标中心压在它的右上角（外壳 `.ak-badge-wrap` 只负责定位）；`show` 为 `false` 或计数归零时只剩内容。页眉铃铛那枚是骨架自己定位的，不走这里。

@demo Badge/Wrap

## 可访问性

光一个「3」读屏听不出是什么。写 `label`（「3 条未读通知」）时，数字对读屏隐藏、改念这句（`.ak-sr-only`）；**圆点徽标一定要写 `label`**，否则读屏什么也听不到。徽标本身不可聚焦，要能点的是它包住的那个按钮。

## Vue API

<PropsTable of="AkBadge" />

## CSS 实现

行内徽标：`<span class="ak-badge">12</span>`；骑在内容上：`<span class="ak-badge-wrap"><button …>…</button><span class="ak-badge">3</span></span>`。页眉的 Echo 通知就是它：notices 默认黄，alerts 加 `.ak-badge--danger`。

18px 高、`border-box`（`min-width` = 高，所以一位数是正圆）；`padding-bottom: 1px` 补思源黑体上下伸不对称带来的约 0.7px 下沉，数字才坐在正中。

<CssClasses :files="['components/badge.css']" />
