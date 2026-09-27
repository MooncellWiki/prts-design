---
title: 新闻横幅 News
component: news
---

游戏主界面上那条 Breaking news 横幅：左边是矩形红块（不斜切），右边是反色底上的一行正文，超长时用省略号截断。正文里可以放链接和加粗。

这种横幅只装得下一条。如果同时有两三个活动要列（例如首页「进行中的网页活动」），应该改用列表，一条一行，不要把几条挤进一句话里轮流滚动。

## 横幅

红块里的字默认是 Breaking News，可以用 `title` 或 `#title` 插槽改写。

@demo News/Basic

## Vue API

<PropsTable of="AkNews" />

## CSS 实现

<CssClasses :files="['arknights/news.css']" />
