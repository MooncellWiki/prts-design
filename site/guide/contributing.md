# 贡献一个组件

一个组件由这几样东西组成，放在固定位置：

```
packages/css/src/<层>/<组件>.css       CSS 实现（唯一的样式来源）；在该层 index.css 里按顺序 @import
packages/vue/src/components/<Name>/
  Ak<Name>.vue                          Vue 实现：只输出结构 + 状态 + 可访问性，不写样式
  Ak<Name>.stories.ts                   Storybook：Playground（args）+ 每个示例一条
  demos/*.vue                           示例：Storybook 与文档站共用
site/<components|arknights>/<id>.md     文档页（或 <id>/index.md + guidelines.md + accessibility.md 三个页签）
site/.vitepress/entries/<分组>.ts        注册一条：名字、描述、CSS 文件、Vue 组件、状态、Storybook 前缀、现网模板（registry.ts 汇总）
```

## 步骤

1. **CSS**：在 `packages/css/src/components/`（通用）或 `packages/css/src/arknights/`（游戏数据）加文件，写进该层 `index.css`，然后 `node scripts/css-order.ts --write` 同步 skin.json。类名走 BEM-lite：`.ak-{block}` `__{el}` `--{mod}`，状态 `.is-{state}` / `aria-*`。
2. **Vue**：`defineProps` 的每个属性写一行 JSDoc——文档站的 Props 表直接读它。只拼类名、不写样式；需要交互的给 `v-model`，键盘与 ARIA 按 WAI-ARIA 模式补齐。
   - 命名：`label` 只用于**可访问名**（字符串，作 `aria-label`），别拿来当布尔开关；布尔 prop 用正面说法（`tip={false}` 而不是 `noTip`）。
   - 容器 + 子项的组件（标签页这类）照 Naive UI 的写法：父组件从默认插槽里读子组件的 props / 插槽自己画（`AkTabs` + `AkTabPane`），不用 provide / inject 注册——首次渲染 / SSR 预渲染就是完整的。
3. **示例**：`demos/*.vue` 每个文件一个主题（变体 / 尺寸 / 状态 …），文件名就是 Storybook 的 story 名。
4. **Stories**：`export const Variants: Story = { name: "变体", ...demo(VariantsDemo) };`——`name` 写在字面量里 Storybook 才读得到。
5. **文档**：示例用独占一行的 `@demo <Name>/<Demo>`；Vue API 用 `<PropsTable of="AkX" />`；CSS 类名一览用 `<CssClasses :files="['components/x.css']" />`（自动从样式表抽取）。正文里要写现网模板名 <code v-pre>{{Cbox2}}</code> 这类双花括号时用 `<code v-pre>`——普通行内代码挡不住 Vue 插值。
6. **注册**：在 `site/.vitepress/entries/` 对应分组的文件里加一条（`registry.ts` 汇总它们），侧栏、总览、页头都从这里来。
7. **导出**：在 `packages/vue/src/index.ts` 导出组件（与要公开的类型）；`pnpm build` 出 `@mooncellwiki/akds-vue` 的 dist。

## 命名与约定

- 前缀 `ak-`；BEM-lite：`.ak-{block}__{elem}--{mod}`；状态用 `.is-*` 或 ARIA 属性（`aria-pressed` / `aria-selected` / `aria-current` …）。
- 数据属性驱动主题色：`data-rarity`、`data-prof`、`data-theme`、`data-color`（模组类型）。
- 私有变量用 `--_x`（组件内部的钩子，如 `--_c` 颜色、`--_s` 尺寸），公开的只有令牌 `--ak-*`。
- 尺寸用令牌（`--ak-space-*` …），颜色只引语义令牌，不写魔法数、不写死色值。
- **组件不依赖 JS 也应可读**（渐进增强）。JS 只做：主题、抽屉、目录 scrollspy、页眉收起、标签页、阶段 / 等级切换、Toast、对话框、搜索面板。目录开合是纯 CSS，JS 只补「镜像到 `html.ak-toc-open` / 锁页面滚动 / 点浮层外 / Esc / 跳转后关闭」这类收尾；搜索面板是纯 JS 组件，但页眉里先渲染的是真表单，JS 到了才换成触发器——无 JS 照常提交到 `Special:Search`。
- 整块是链接、或会被放进正文的组件，最外层标 `ak-not-prose`（见[设计理念 · prose / not-prose](/foundations/principles#prose-not-prose)）。渲染成 `<a>` 且根节点颜色不是继承色的组件，把颜色规则写到 `:hover` / `:visited` / `:active` 上（`.ak-x:is(:visited, :active) { color: … }`）：宿主与正文的 `a:visited` / `a:hover` 是 (0,1,1)，单个类压不过；`getComputedStyle` 看不到 `:visited`，`hosts` 用 CDP 强制伪类才测得到。
- **`width: 100%` / `min-width` 的组件必须自带 `box-sizing: border-box`**（MediaWiki 没有全局 box-sizing 重置）。否则 padding 会在窄屏撑破容器；而只要有任何元素横向溢出，移动端 Chrome 就会把布局视口撑宽、整页缩小，`.ak-fab` 这类 fixed 元素被推到可见区之外。`.ak-input` / `.ak-select` / `.ak-textarea` / `.ak-stat` / `.ak-blue-band` 已处理，裸 `input` / `select` / `textarea` / `button` 由 `base/forms.css` 统一设了 border-box；闲置的提示气泡也收成 0 宽（见[文字提示](/components/tooltip)），新组件照做。
- 形状与装饰遵守[设计理念](/foundations/principles)：直角、不斜切；色条 + 细框用 `border-image` 直角拼接（见[装饰语言 · 色条 + 细框](/foundations/decoration#色条-细框)）。
- **组件在任何宿主上都得一样**（AKDS 皮肤 / prts.wiki 的其它皮肤 / 站外，见[在 Vue / prts-widgets 中使用](/guide/vue#样式从哪来)）。组件层（`components/` `decor/` `arknights/` `utilities.css`）随 `standalone.css` 出去，没有 `base/`、`chrome/`、字体与素材：
  - 不依赖 body 的排版声明：需要的字体 / 字号 / 行高自己用令牌写（`--ak-font-*` / `--ak-fs-*` / `--ak-lh-*`），作用域根（`scope.css`）只给正文的那一档。
  - 不依赖 `base/` 的规则：正文排版给标题的行高、给 `dl` 的段距、`.wikitable` 的表格样式都不算数——组件元素上要的值自己写（`.ak-skill__name` 的行高、`.ak-kv` 的外边距、`.ak-table` 的 `border-spacing` 都是这么补的）。裸控件外观（`base/forms.css`）例外：作用域在别的宿主上补了同一套（`scope.css` 第 4 段，`node scripts/css-order.ts` 逐条核对两边一致，改一边要同步改另一边）。
  - 组件元素可能是 `h1`–`h6` 的（标题标签由调用方选的那种），规则再带一条标签限定的同义选择器 `:is(h1, h2, h3, h4, h5, h6).ak-x`（0,1,1）——宿主正文的 `.mw-body h3`（Vector 2022）是 (0,1,1)，单个类压不过。
  - 只给读屏的文字用 `.ak-sr-only`（在 `utilities.css`，不在骨架里）。
  - 不直接 `url()` 游戏素材：图片经皮肤的素材接口变量取（如 `var(--ak-item-bg-1, none)`，声明在 `base/skin-assets.css`），站外没有就是回退值。

## 仓库结构

```
packages/tokens/src/          令牌源（W3C DTCG JSON5）：base/ 原始色板 · 字体 · 尺寸 · 动效 · 层级 · functional/ 明暗主题 · 页眉接口 · 控件 · bridge/ Codex 桥接
packages/tokens/build.ts      pnpm tokens：生成 packages/css/src/tokens.css + bridge-codex.css、packages/tokens/tokens.css（同一份，随令牌包发布）+ tokens.json（Style Dictionary；都不手改）
packages/css/src/
  tokens.css                  令牌 + 主题（含 .ak-scope[data-theme] 局部主题）；生成物
  bridge-codex.css            Codex / MW 令牌桥接（生成物；只属于皮肤）
  scope.css                   作用域根：body.skin-akds / .ak-scope 的排版基线；别的宿主上把宿主环境换成皮肤上那一套
  fonts.css · fonts/          自托管字体（scripts/fetch-fonts.py 生成）
  base/                       L1 MW 内容样式，一块一个文件（root = html / body 基底；typography / tables / media / tabber / forms / special-pages / print …）；skin-assets.css = 皮肤的素材接口（--ak-item-bg-*，由 index.css 直接引）
  components/                 L3 通用组件，一个组件一个文件；title-reset 在全部组件之后，keyframes 收齐 ak-* 动画
  decor/                      L4 方舟装饰语言，一类一个文件（stripes / halftone / corner / type / glyph / inverse …）
  arknights/                  L4 游戏数据组件（rarity / profession / op-card / item / skill / range / module / dossier / stage …）；table-numerals 最后
  chrome/                     L2 皮肤骨架（header / keyart / sidebar / page-header / toc / footer / search-palette …；responsive 收齐断点、放最后）；demo-theme.css 示例活动主题（不进 index.css / skin.json）
  utilities.css               工具类
  forced-colors.css           强制色模式（最后加载）
  index.css                   皮肤全套的汇总入口（预览 / Storybook / 文档站）：各层 index.css 按序 @import；skin.json 的逐文件列表由 scripts/css-order.ts 同步
  standalone.css              组件入口（npm 包 @mooncellwiki/akds-css 的默认入口）：tokens + scope + 组件 + 工具类 + 强制色，是 index.css 的子序列
  charinfo.css                干员页舞台的换皮草案（不接入，见 /patterns/operator）
  search-palette.js           悬浮搜索面板核心（皮肤与预览共用；数据源由调用方注入）
  sidebar-tree.js             侧栏多层导航（皮肤与预览共用）
  img/                        CSS 直接引用的游戏素材（道具稀有度底框）
packages/vue/src/             Vue 实现（见上）
skin/                         MediaWiki 皮肤：skin.json（样式模块 base / components / fonts / shell / tokens）· templates/skin.mustache · resources/（skin.js、search-providers.js + 指向 packages/css/src 的链接）· i18n/
preview/
  _src/                       样例站源：skeleton.html（皮肤骨架，只写一份）+ gallery-skeleton.html（跨宿主对照页的骨架，?host= 切换）+ pages/{home,operator,gallery}.html
  *.html                      生成物（scripts/build-preview.py）：首页设计稿 · 干员页整页样例 · 跨宿主对照页
  vendor/                     第三方原样：swiper/（首页轮播）· charinfo/（现网 Widget:CharinfoV2 快照，scripts/fetch-charinfo.py）· jquery/（3.7.1，同 MW 1.43）· vector/（Vector 2022 样式夹具，scripts/fetch-vector-css.ts 抓取，GPL，入库只作回归测试、不随站点发布）
  assets/                     游戏图标 / 现网道具图 / 头图 / 首页素材 / 页脚徽章 …
site/                         本文档站（VitePress）
.storybook/                   Storybook（整页样例 story 在 pages/）
scripts/                      fetch-*.py · fetch-vector-css.ts · build-preview.py · build-dist.py · build-site.sh · css-order.ts · sprite-sync.ts
e2e/                          Playwright Test：hosts / snapshots / stories 三组（配置在 playwright.config.ts；support/ 是静态服务与计算样式快照）
```

## 改 CSS 之后

重构类改动（不应改变外观的）用样式快照比对（e2e 用 Playwright 的 headless shell，第一次先 `pnpm exec playwright install --only-shell chromium`）：

```sh
pnpm e2e --project=snapshots -u   # 改之前：拍基准 → _verify/snapshots/（不入库）
pnpm e2e --project=snapshots      # 改之后：逐项比对
```

它把预览页每个元素（含伪元素）在 亮 / 暗 / 跟随系统 / 平板 / 手机 / 活动主题 下的计算样式拍下来逐项比对，不一样就列出元素 / 属性（完整列表在 `pnpm exec playwright show-report` 的附件里）。令牌由 `packages/tokens/src/` 下的 JSON5 生成：改完跑 `pnpm tokens`。

改了组件（或 `scope.css`）之后，再核一遍它在别的宿主上是不是还一样：

```sh
node scripts/fetch-vector-css.ts           # 现网 MW 升级或 Common.css 改了才要：重抓 Vector 2022 样式夹具（vector.css）与站点自定义样式（site.css）到 preview/vendor/vector/，提交
python3 scripts/build-preview.py           # 改了 preview/_src/pages/gallery.html 时
pnpm e2e --project=hosts                   # 对照页 preview/gallery.html 在 akds / vector / bare × 暗 / 亮 下拍快照并比对
```

`hosts` 以 AKDS 皮肤（`?host=akds`）为基准，每个 `[data-gallery]` 块里的元素在 Vector 2022（夹具 + `standalone.css` + 站点自定义样式 `site.css`——MW 上动态加载的模块插在 `site.styles` 之前，所以 Common.css 排在组件样式之后）与站外（只有 `standalone.css`）上必须逐属性相同，否则列出不同的元素 / 属性、用例失败；白名单写在 `e2e/hosts.spec.ts` 里、逐条注明原因（道具底框素材、正文标题的锚点偏移、Vector 自己的减弱动效规则）。静态之外再比一轮交互态：块里的链接 / 控件逐个用 CDP 强制 `:hover` / `:focus-visible` / `:visited`（快照里路径带 `[hover]` 等前缀，不含伪元素）。没覆盖的：`:active`、强制色模式、窄视口、真实的键盘焦点顺序。CI 的 e2e 流水线（`.github/workflows/e2e.yml`，与部署分开、不挡部署）每次推送 / PR 跑它，连同 Storybook 每个 story 的自检（`--project=stories`，测 `pnpm build:storybook` 构建好的 `_build/storybook`）。测试一律不出网（`e2e/support/test.ts` 在浏览器里拦下外站请求），Vector 夹具入库，CI 不访问 prts.wiki；重抓夹具（prts.wiki 的 WAF 按指纹拦非浏览器客户端，Playwright 的 headless shell 也拦，所以脚本用本机的 Google Chrome）是维护时的手动操作。浏览器里直接看：`preview/gallery.html?host=vector&theme=light`；Storybook 工具栏的「宿主」同一张表。差异多半落在：组件靠了 `base/` 的规则或 body 的继承（组件自己补声明，用令牌）、组件标题是 `h1`–`h6` 却没有标签限定的选择器、宿主的元素规则漏进组件（`scope.css` 的重置）、链接型组件的根节点颜色没写到 `:hover` / `:visited` 上。
