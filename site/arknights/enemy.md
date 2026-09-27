---
title: 敌人 Enemy
component: enemy
---

敌人卡：左列是 64px 圆形头像（深底），右列从上到下是级别 · 编号、名字、威胁度菱形。精英加橙色左条，领袖（BOSS）加红色左条。用在关卡页的敌人列表里。

## 级别

`variant` 对应游戏数据里的 `enemyLevel`：`normal` / `elite` / `boss`。级别字（NORMAL / ELITE / BOSS）会写在编号前面，不只靠色条区分，色弱读者和读屏器也能拿到这个信息。`level` 是点亮几枚菱形，共 `levelMax` 枚（默认 4）。

头像由调用方用 `src` 传入（游戏里是方图，这里裁成圆形）；不传时显示深色空圆。

@demo Enemy/Ranks

## 可访问性

- 头像的 `alt` 为空：名字就写在旁边，读屏器不需要再读一遍。
- 威胁度这排菱形是 `role="img"`，读屏名为「威胁度 2 / 4」，不会被当成四个空元素跳过。

## Vue API

<PropsTable of="AkEnemy" />

## CSS 实现

<CssClasses :files="['arknights/enemy.css']" />
