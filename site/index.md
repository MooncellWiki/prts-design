---
layout: home
title: AKDS 明日方舟网页设计系统
hero:
  name: AKDS
  text: 明日方舟网页设计系统
  tagline: 为 prts.wiki 新皮肤而做——令牌 → CSS 组件 → Vue 组件，一套视觉语言，三层实现。
  actions:
    - theme: brand
      text: 开始了解
      link: /guide/
    - theme: alt
      text: 组件
      link: /components/
    - theme: alt
      text: 整页样例
      link: /patterns/operator
features:
  - title: 令牌 Primitives
    details: 颜色 / 字体 / 尺寸 / 动效，W3C DTCG 格式的 JSON 源文件生成 CSS 变量；每个颜色标明出处（官网 CSS / 游戏解包 / gamedata）。
    link: /foundations/color
  - title: CSS 实现
    details: 每个组件一份样式表，纯 CSS、框架无关。MediaWiki 皮肤直接加载，模板 / Lua 输出约定好的 .ak-* 结构即可。
    link: /guide/mediawiki
  - title: Vue 实现
    details: 同一套结构的 Vue 3 组件（@akds/vue），给 prts-widgets 这类小部件用：状态、键盘、可访问性都在组件里。
    link: /guide/vue
  - title: 双正典主题
    details: 终端（暗）/ 档案（亮），与 MediaWiki 1.43 的 clientPrefs 机制一致；活动主题只覆盖一组接口变量。
    link: /foundations/color
---
