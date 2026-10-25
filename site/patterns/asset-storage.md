---
title: 资源库（ak-asset-storage）
---

# 资源库 ak-asset-storage

站外工具页的样例：[torappu.prts.wiki](https://torappu.prts.wiki/)（MooncellWiki/ak-asset-storage）的前端换成 PRTS Design。它不是 wiki 页面——没有侧栏、没有正文排版，页眉里放五个入口（官网导航栏那一套：黑底、青色当前项），其余全是组件：树、表、键值表、缩略图格、命令面板。稿子就是上线后的样子，页面里没有给读者看的说明。

源文件 `preview/_src/pages/akas-*.html`，骨架 `preview/_src/app-skeleton.html`（不是皮肤骨架：只填 title / head / 正文），样式 `preview/assets/asset-storage.css`（`.as-*` 只写排布，颜色全读令牌），脚本 `preview/assets/asset-storage.js`（主题三态、树开合、页签、复制）。`python3 scripts/build-preview.py` 生成。数据是 2026-10-25 线上实例的真实返回（见[数据](#数据)）；缩略图运行时从 `torappu.prts.wiki/assets/` 取。

实现时 ak-asset-storage 自己 `import "@mooncellwiki/prts-design-css"` 并自己出页眉 / 页脚那一层样式（这里为了预览直接引了皮肤全套 `src/index.css`）。

## 版本

<PageFrame page="akas-versions.html" />

首页。最新版本一块：客户端版本、资源版本号、一枚状态、三个动作（对比上一版 / 清单 / 数据表）与「更多」（复制 torappu 命令 / 下载热更新列表 / 重新解包）。下面是按客户端版本分组的版本表：资源版本 / 时间 / 较上一版的新增 ~修改 −删除 / 状态；悬停出对比 / 清单 / 数据表三个图标动作。

状态只分四种：已就绪 · 下载中 · 正在导入清单 · 解包失败。中间态见[状态](#状态)。

## 变更

<PageFrame page="akas-diff.html" />

两版 bundle 列表之差。工具条：两个版本下拉 + 交换、新增 / 修改 / 删除 三格开关（格子本身就是那一种颜色，按下淡底色字、松开灰字划掉数字）、路径筛选。三栏：只列有变更的目录树（每支带 +~− 计数）· 当前目录的变更表（路径两行：目录小字 + 文件名；大小；变化量）· 选中 bundle 的新旧两列（版本 / 大小 / 哈希 / 下载）+ 这个路径的历次变化。

新增 / 修改 / 删除 = `--ak-success` / `--ak-warning` / `--ak-danger`，不新造颜色；行首 3px 色条 + 字母标 A / M / D（[徽标不能只靠颜色](/foundations/accessibility)）。<1400 详情栏落到表下方；<1120 三栏叠成一列。原来的 `/file` 页（按路径 / 哈希搜 bundle 历史）并进右栏的「历次变化」与搜索面板。

## 清单

<PageFrame page="akas-manifest.html" />

某一版资源名 → bundle 的映射。版本下拉 + 搜索；左树按需加载；右边是面包屑 + 资源名 + 下载 bundle + 三行键值（Bundle · 资源路径 · SHA-256）+ 同目录表。

## 文件

<PageFrame page="akas-files.html" />

torappu 的解包产物与数据表两个根。目录视图默认缩略图网格（棋盘底，`object-fit: contain`），可切列表；排序；加载更多。

<PageFrame page="akas-file.html" />

单文件：格式化 / 原始两个页签 + 带行号的代码块 + 复制 / 下载；右栏路径 / 大小 / 修改时间 / 复制直链 + 同目录列表。图片、音频、二进制、大文件各自的态见[状态](#状态)。

## 剧情资源

<PageFrame page="akas-story.html" />

哪些剧本用了某张背景 / 角色 / 图片 / 道具。类型是块状页签；左列表（缩略图 + id + 次数，搜索命中加粗）；右详情：图 + 「N 个剧本使用」+ 查看图片 / 复制 id，下面是剧本表（按活动分组，可筛选，加载更多）。

## 搜索

<PageFrame page="akas-search.html" />

皮肤的[搜索面板](/chrome/search)原样搬来：页眉触发器 / <kbd>⌘K</kbd> / <kbd>/</kbd> 打开，一次查询分三组列出——文件 · 清单资源 · Bundle；高亮行右端出复制直链 / 下载。

## 状态

<PageFrame page="akas-states.html" />

正常页面里此刻看不到的态：下载中（进度条）、清单导入中（不定进度）、解包失败（`.ak-message--danger` + 重新解包 / 查看日志）、没有结果、加载骨架、文件太大、重新解包对话框（版本 / 对比的上一版 / 只跑 · 跳过这些任务 / 令牌）、三条提示、连不上服务。每一块都只用设计系统已有的组件与状态令牌。

## 要后端补的

版本表里的「变更」一列与变更页右栏的「历次变化」，现在只能由前端把两版各一万五千条 bundle 记录拉下来自己比（两份各 3 MB）；最新版本块里的「解包完成」时间、下载中的 81 / 131、解包失败这几种状态，现在的接口只给 `isReady` 与清单的 pending / importing / ready，没有下载进度和 torappu 的结果。这两处要先补接口：一个按版本算好的差异统计，一个最近一次处理的状态；补之前这两块先不显示。

## 数据

2026-10-25 从 torappu.prts.wiki 取：365 个版本，#354 到 #365 相邻两版的 +~− 用 `/version/{id}/files` 两两比出；变更页的路径 / 大小 / 哈希是 #364 → #365 的真实差异；清单页目录与 `illust_char_002_amiya_1` 的详情、文件页的目录名 / 文件名 / 大小、剧情资源的 id / 次数 / 剧本路径均为真实返回。示意的部分：2.7.51 两行的变更量、变更详情里 #363 以前的三条历史、同目录里 epoque#4 的 bundle 大小、状态页整页。
