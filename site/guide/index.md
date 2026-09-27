# 介绍

AKDS（Arknights Web Design System）是 prts.wiki（MediaWiki 1.43）新皮肤的设计系统。视觉母体是[明日方舟官网](https://ak.hypergryph.com/)与游戏内 UI（torappu 解包），不是一层换色的通用后台。

## 三层，和 Primer 一样分开

GitHub 的 [Primer](https://primer.style/) 把设计系统拆成令牌（primer/primitives）、CSS（primer/css）、框架实现（primer/react、primer/view_components）和文档站几块。AKDS 按同样的思路组织，只是放在一个仓库里：

| 层 | 目录 | 对应 Primer | 谁在用 |
|---|---|---|---|
| 令牌 | `tokens/`（源文件）→ `src/tokens.css` | primer/primitives | 所有人；TemplateStyles 里直接 `var(--ak-accent)` |
| CSS 实现 | `src/`（每个组件一份样式表） | primer/css | MediaWiki 皮肤；模板 / Lua 输出 `.ak-*` 结构 |
| Vue 实现 | `vue/src/components/` | primer/react | prts-widgets 等 Vue 小部件 |
| 文档站 | `site/`（本站） | primer.style | 所有人 |
| Storybook | `.storybook/` + `*.stories.ts` | primer.style/react/storybook | 组件开发 / 视觉走查 |

**CSS 是唯一的样式实现。** Vue 组件只负责输出同样的结构、管理状态与可访问性，不带自己的样式；组件文档里每个示例的「HTML」页签，就是 Vue 组件实际渲染出的结构——模板照着输出，外观一模一样。

## 实现状态

每个组件的页头都列出两种实现各自的状态（参考 [Primer 的组件生命周期](https://primer.style/guides/component-lifecycle)）：

| 状态 | 含义 |
|---|---|
| <span class="akd-status is-ready">可用</span> | 已在整页样例 / 皮肤里跑过，结构与类名稳定，改动会同步文档 |
| <span class="akd-status is-experimental">实验</span> | 新写的，API 可能还会变；可以试用，发现问题请提 issue |
| <span class="akd-status is-deprecated">弃用</span> | 将被移除，文档会写明替代品 |
| <span class="akd-status">规划</span> | 在清单里，还没有实现 |

目前 CSS 实现多为「可用」（v0.1，皮肤尚未上线），Vue 实现全部是「实验」。

## 三句话看懂这套系统

1. **黑白为体、青为用**：大面积黑 / 白 / 灰；青 `#18D1FF`（官网，暗色主题）/ `#0098DC`（游戏内，亮色主题）只做选中、链接、主动作与强调条；黄 `#FFD800` 为次强调；红只表示危险 / NEW。
2. **直角、斜纹、半调网点、角标三角、黑白反转、大写拉丁装饰字、白色线稿图标**——方舟本体的形状语言：不做圆角，不做辉光，也没有切角 / 斜切 / 斜带。
3. **终端 / 档案双主题**是双正典（游戏本身就是双色 UI），走 MediaWiki 1.43 的 `skin-theme-clientpref-*` 机制，并把 Codex 令牌桥接到 `--ak-*`，核心 / 扩展 UI 自动跟随。
