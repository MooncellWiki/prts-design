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
- 整块是链接、或会被放进正文的组件，最外层标 `ak-not-prose`（见[设计理念 · prose / not-prose](/foundations/principles#prose-not-prose)）。
- **`width: 100%` / `min-width` 的组件必须自带 `box-sizing: border-box`**（MediaWiki 没有全局 box-sizing 重置）。否则 padding 会在窄屏撑破容器；而只要有任何元素横向溢出，移动端 Chrome 就会把布局视口撑宽、整页缩小，`.ak-fab` 这类 fixed 元素被推到可见区之外。`.ak-input` / `.ak-select` / `.ak-textarea` / `.ak-stat` / `.ak-blue-band` 已处理，裸 `input` / `select` / `textarea` / `button` 由 `base/forms.css` 统一设了 border-box；闲置的提示气泡也收成 0 宽（见[文字提示](/components/tooltip)），新组件照做。
- 形状与装饰遵守[设计理念](/foundations/principles)：直角、不斜切；色条 + 细框用 `border-image` 直角拼接（见[装饰语言 · 色条 + 细框](/foundations/decoration#色条-细框)）。

## 仓库结构

```
packages/tokens/src/          令牌源（W3C DTCG JSON5）：base/ 原始色板 · 字体 · 尺寸 · 动效 · 层级 · functional/ 明暗主题 · 页眉接口 · 控件 · bridge/ Codex 桥接
packages/tokens/build.ts      pnpm tokens：生成 packages/css/src/tokens.css + packages/tokens/tokens.json（Style Dictionary；两者都不手改）
packages/css/src/
  tokens.css                  令牌 + 主题 + Codex 桥接（生成物；必须最先加载）
  fonts.css · fonts/          自托管字体（scripts/fetch-fonts.py 生成）
  base/                       L1 MW 内容样式，一块一个文件（root = html / body 基底、紧跟 tokens；typography / tables / media / tabber / forms / special-pages / print …）
  components/                 L3 通用组件，一个组件一个文件；title-reset 在全部组件之后，keyframes 收齐 ak-* 动画
  decor/                      L4 方舟装饰语言，一类一个文件（stripes / halftone / corner / type / glyph / inverse …）
  arknights/                  L4 游戏数据组件（rarity / profession / op-card / item / skill / range / module / dossier / stage …）；table-numerals 最后
  chrome/                     L2 皮肤骨架（header / keyart / sidebar / page-header / toc / footer / search-palette …；responsive 收齐断点、放最后）；demo-theme.css 示例活动主题（不进 index.css / skin.json）
  utilities.css               工具类
  forced-colors.css           强制色模式（最后加载）
  index.css                   汇总入口（预览 / Storybook / 文档站）：各层 index.css 按序 @import；skin.json 的逐文件列表由 scripts/css-order.ts 同步
  charinfo.css                干员页舞台的换皮草案（不接入，见 /patterns/operator）
  search-palette.js           悬浮搜索面板核心（皮肤与预览共用；数据源由调用方注入）
  sidebar-tree.js             侧栏多层导航（皮肤与预览共用）
  img/                        CSS 直接引用的游戏素材（道具稀有度底框）
packages/vue/src/             Vue 实现（见上）
skin/                         MediaWiki 皮肤：skin.json · templates/skin.mustache · resources/（skin.js、search-providers.js + 指向 packages/css/src 的链接）· i18n/
preview/
  _src/                       样例站源：skeleton.html（皮肤骨架，只写一份）+ pages/{home,operator}.html
  *.html                      生成物（scripts/build-preview.py）：首页设计稿 · 干员页整页样例
  vendor/                     第三方原样：swiper/（首页轮播）· charinfo/（现网 Widget:CharinfoV2 快照，scripts/fetch-charinfo.py）· jquery/（3.7.1，同 MW 1.43）
  assets/                     游戏图标 / 现网道具图 / 头图 / 首页素材 / 页脚徽章 …
site/                         本文档站（VitePress）
.storybook/                   Storybook（整页样例 story 在 pages/）
scripts/                      fetch-*.py · build-preview.py · build-dist.py · build-site.sh · css-order.ts · sprite-sync.ts · verify/
```

## 改 CSS 之后

重构类改动（不应改变外观的）用样式快照比对：

```sh
node scripts/verify/styles.ts snap before   # 改之前
node scripts/verify/styles.ts snap after    # 改之后
node scripts/verify/styles.ts diff before after
```

它把预览页每个元素（含伪元素）在 亮 / 暗 / 跟随系统 / 平板 / 手机 / 活动主题 下的计算样式拍下来逐项比对。令牌由 `packages/tokens/src/` 下的 JSON5 生成：改完跑 `pnpm tokens`。
