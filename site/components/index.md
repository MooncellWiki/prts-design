---
title: 组件总览
---

# 组件总览

每个组件都有 CSS 实现（MediaWiki 皮肤加载，模板输出结构即可），大多数也有 Vue 实现（给 prts-widgets）。卡片上是两种实现各自的[状态](/guide/#实现状态)。

<ComponentGrid />

组件 = **一段约定好的 HTML 结构 + 类名**：模板作者（Lua / wikitext）输出这段结构，皮肤保证外观与主题；类名、状态类与数据属性的约定见[贡献一个组件 · 命名与约定](/guide/contributing#命名与约定)。

暂不纳入（wiki 场景优先级低）：OTP 输入、日期选择、富文本编辑器、评分、文件上传（MW 自带 `Special:Upload`）、Cookie 同意、会话超时、看板、价格表。需要时按同一套令牌补。
