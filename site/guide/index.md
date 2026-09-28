# 介绍

PRTS Design（明日方舟网页设计系统）是 prts.wiki（MediaWiki 1.43）新皮肤 Arknights（[Skin:Arknights](https://github.com/MooncellWiki/mediawiki-skins-Arknights)）的设计系统。视觉母体是[明日方舟官网](https://ak.hypergryph.com/)与游戏内 UI（torappu 解包），不是一层换色的通用后台。

**叫法**：设计系统（本仓库：令牌、CSS、Vue、文档）叫 **PRTS Design**；加载它的 MediaWiki 皮肤叫 **Arknights**。npm 包是 `@mooncellwiki/prts-design-*`。类名前缀 `ak-`、令牌前缀 `--ak-` 不变；本仓库皮肤骨架 `skin/` 的扩展名 `AKDS`、模块名 `skins.akds.*` 等是早期的代码标识，没有改名（与生产皮肤的名字对照见[在 MediaWiki 中使用](/guide/mediawiki)）。

## 三层，和 Primer 一样分开

GitHub 的 [Primer](https://primer.style/) 把设计系统拆成令牌（primer/primitives）、CSS（primer/css）、框架实现（primer/react、primer/view_components）和文档站几块。PRTS Design 按同样的思路组织，只是放在一个仓库里：

| 层 | 目录 | 对应 Primer | 谁在用 |
|---|---|---|---|
| 令牌 | `packages/tokens/`（`@mooncellwiki/prts-design-tokens`，带 `tokens.css`）→ `tokens.css` | primer/primitives | 所有人；TemplateStyles 里直接 `var(--ak-accent)` |
| CSS 实现 | `packages/css/`（每个组件一份样式表；由皮肤加载，组件部分另发 npm `@mooncellwiki/prts-design-css`，不含字体与素材） | primer/css | MediaWiki 皮肤；模板 / Lua 输出 `.ak-*` 结构；别的皮肤 / 站外的 widget；纯 HTML 页面（单文件版，见[在纯 HTML 中使用](/guide/html)） |
| Vue 实现 | `packages/vue/`（`@mooncellwiki/prts-design-vue`） | primer/react | prts-widgets 等 Vue 小部件 |
| 文档站 | `site/`（本站） | primer.style | 所有人 |
| Storybook | `.storybook/` + `*.stories.ts` | primer.style/react/storybook | 组件开发 / 视觉走查 |

**CSS 是唯一的样式实现。** Vue 组件只负责输出同样的结构、管理状态与可访问性，不带自己的样式；组件文档里每个示例的「HTML」页签，就是 Vue 组件实际渲染出的结构——模板照着输出，外观一模一样。

## 按 MediaWiki 皮肤的需要分层

PRTS Design 是皮肤而不是 JS 组件库：组件 = **一段约定好的 HTML 结构 + 类名**，模板作者（Lua / wikitext）输出这段结构，皮肤保证外观与主题。样式按层组织，加载顺序也按层（见[模块与层序](/guide/resourceloader#层序)）：

| 层 | 管什么 | 源文件（`packages/css/src/`） | 文档 |
|---|---|---|---|
| L0 令牌 | 颜色 / 字体 / 尺寸 / 动效 / 层级，明暗主题（含局部主题），Codex 桥接；作用域根（排版基线） | `tokens.css` · `bridge-codex.css`（生成物，源在 `packages/tokens/src/`）· `scope.css` | [基础](/foundations/color) · [作用域](/components/scope) |
| L1 MediaWiki 内容 | wikitext 产物与核心 UI 的样式——编辑不需要知道设计系统存在 | `base/` | [MediaWiki 内容样式](/content/) |
| L2 皮肤骨架 | 黑色页眉 / 头图 / 侧栏 / 页面头 / 目录 / 页脚 / 搜索面板 / 响应式 | `chrome/` | [皮肤骨架](/chrome/) |
| L3 通用组件 | 纯 CSS 组件，可写进模板 / TemplateStyles | `components/` | [通用组件](/components/) |
| L4 方舟 | 装饰语言 + 游戏数据组件 | `decor/` + `arknights/` | [装饰语言](/foundations/decoration) · 方舟组件 |
| L5 页面模式 | 干员页 / 首页 / 列表页 … | `preview/` 样例页 | [页面模式](/patterns/) |

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
