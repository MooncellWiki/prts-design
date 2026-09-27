---
title: 活动 Event
component: event
---

活动卡和倒计时。活动卡从上到下是：21:9 横幅、强调色的类型行、标题、起止时间，时间下面可以放倒计时或按钮。倒计时由三枚灰块组成，每块是一个数字加一个单位；灰块和 `.ak-level--badge` 是同一种读数，不做成白块，否则看起来像一排按钮，也会压过标题。

## 活动卡

`status="live"` 在类型行前加一个闪烁的红点（进行中），`status="ended"` 让类型行转灰（已结束）。横幅地址由调用方用 `cover` 传入，按 21:9 裁切铺满；不传时不显示横幅，也可以用 `#cover` 插槽自己放。倒计时放在默认插槽里。

@demo Event/Cards

## 倒计时

`AkCountdown` 只需要一个截止时刻 `until`，剩余时间按当前时间实时算。也可以像 Naive 的 `NCountdown` 那样给 `duration`（剩余毫秒），从挂载时开始倒数。`active=false` 暂停：`until` 模式下读数停住，恢复后跳回实际剩余；`duration` 模式下恢复后从停下的地方接着倒数。

读数规则同首页脚本：剩余不足一天时从「时」开始显示（00 时也照常显示），一直显示到 `precision`（默认到分，`sec` 到秒）。`parts` 限制最多显示几格，例如首页幻灯片用 2 格，显示成「03 days 14 hrs」，不足一天时是「14 hrs 27 min」。倒数到 0 时触发 `finish`，之后整个倒计时不再渲染。

@demo Event/Countdown

## 可访问性

- 倒计时是 `role="timer"`，它隐含 `aria-live="off"`，每分钟刷新时不会打断读屏器。
- 灰块上的单位是英文（DAYS / HRS / MIN），读屏名另给一份中文「剩余 3 天 14 小时 27 分」，灰块本身对读屏器隐藏。
- 只刷新到需要的精度：到分时下一次唤醒就排在读数变化的那一刻，不每秒重渲染。

## Vue API

### AkEvent

<PropsTable of="AkEvent" />

### AkCountdown

<PropsTable of="AkCountdown" />

## CSS 实现

<CssClasses :files="['arknights/event.css']" />
