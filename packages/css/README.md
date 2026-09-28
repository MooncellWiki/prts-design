# @mooncellwiki/akds-css

AKDS（明日方舟网页设计系统）的 CSS 实现，≈ primer/css——prts.wiki 皮肤 Skin:Arknights 加载的就是这份样式表（`skin/resources/` 下是指向这里的链接）。

npm 包只含**代码部分**（MIT）：令牌、作用域根、通用 / 方舟组件、工具类、强制色模式，以及 MediaWiki 内容样式 `base/`、Codex 桥接与皮肤骨架 `chrome/`（后三样不在默认入口里，别的 MediaWiki 站想用可以单独 import）。**字体与游戏素材不在包里**——Novecento Sans Wide、Bender 按与鹰角同一组织下的共用授权使用、不可转授，`img/` 的游戏素材版权归鹰角网络；两者只随仓库里的皮肤走，见各自目录的 NOTICE / LICENSE。皮肤全套（`src/index.css`：字体 → 令牌 → Codex 桥接 → 素材接口 → `base/` → 作用域 → 组件 → 工具类 → 强制色 → 皮肤骨架 `chrome/`）在仓库里。

## 三种接入方式

组件放在作用域根里——`class="ak-scope"`（Vue：`<AkScope>`）——才有排版基线（字体 / 字号 / 行高 / 前景色），不靠宿主页面的 `<body>`；`data-theme="dark|light"` 让这一块局部固定走终端 / 档案配色。

| 宿主 | 样式来源 | 作用域 |
|---|---|---|
| prts.wiki · AKDS 皮肤 | 皮肤已加载全套，什么都不用做 | `body.skin-akds` |
| prts.wiki · 其它皮肤（Vector 2022 …） | `mw.loader.using("skins.arknights.components")`（令牌 + 作用域 + 组件，一个模块就齐；要官网字体再加 `"skins.arknights.fonts"`。模块由生产皮肤 Skin:Arknights 注册，仓库内 `skin/` 骨架里叫 `skins.akds.*`）；AKDS 皮肤上是空操作 | 根节点 `class="ak-scope"` |
| 站外 | `import "@mooncellwiki/akds-css"`（= `standalone.css`） | 同上 |

```js
import "@mooncellwiki/akds-css";                       // standalone.css：tokens + scope + components + decor + arknights + utilities + forced-colors
import "@mooncellwiki/akds-css/tokens.css";            // 只要令牌
import "@mooncellwiki/akds-css/components/button.css"; // 单个组件（先有 tokens.css + scope.css）
import "@mooncellwiki/akds-css/base/index.css";        // 别的 MediaWiki 站想要 AKDS 的正文排版（不在默认入口里）
```

- 不随包走的：字体（退到令牌里 Oswald / Chakra Petch / 系统字的回退链）、`img/`（`.ak-item--bare` 的稀有度底框；想要底框自己在 `:root` 上覆盖 `--ak-item-bg-1…6`，写 `media.prts.wiki` 的绝对地址）。皮肤骨架 `chrome/` 在包里但不在 `exports` 里。`bridge-codex.css`（Codex / MW 令牌桥接）在 `exports` 里，但只该给 AKDS 皮肤用——加载到别的皮肤上会改掉宿主自己的 Codex 配色。
- 包里的 `src/index.css` 引了字体与素材，npm 用户别用它（不在 `exports` 里）。

## 层与顺序

`fonts.css` → `tokens.css`（生成物，源在 `packages/tokens`）→ `bridge-codex.css`（生成物）→ `base/skin-assets.css` → `base/`（MediaWiki 内容）→ `scope.css`（作用域根）→ `components/`（通用组件）→ `decor/` + `arknights/`（方舟组件）→ `utilities.css` → `forced-colors.css`（只在强制色模式下生效）→ `chrome/`（皮肤骨架）。各层 `index.css` 的 `@import` 顺序就是加载顺序；`standalone.css` 是它的子序列。增删 / 调序后跑 `node scripts/css-order.ts --write` 同步 skin.json（MW 按模块名字母序输出皮肤样式，脚本按这个核）。

文档：https://mooncellwiki.github.io/prts-design/guide/vue#样式从哪来
