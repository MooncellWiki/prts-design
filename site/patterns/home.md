---
title: 首页设计稿
---

# 首页设计稿

信息结构 1:1 取自 prts.wiki 现网首页（轮播 7 张 / 12 个入口 / 今日信息 / 亮点干员 / 近期新增 / 网站信息），只换视觉。页面只管自己——各区块样式在页面的 `<style>` 里（生产环境 = TemplateStyles），整页标 `ak-not-prose`；去标题 / 去目录 / 去白纸归皮肤。

源文件 `preview/_src/pages/home.html`，`python3 scripts/build-preview.py` 生成；单文件离线版在 `dist/home.html`。

<PageFrame page="home.html" />
