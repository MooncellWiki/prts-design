# 迁移与上线

## 分阶段替换

1. **Phase 0 · 令牌落地**：装上皮肤（生产皮肤 Skin:Arknights：`wfLoadSkin('Arknights')`；还不想让用户在参数设置里选到，就先把 `arknights` 放进 `$wgSkipSkins`）后，它注册的模块在任何皮肤的页面上都能加载——Vector 2022 上用 `mw.loader.using("skins.arknights.components")`（令牌 + 作用域根 + 组件，自带齐，见[模块与层序](/guide/resourceloader#resourceloader-模块)）先让模板 / prts-widgets 用上 `.ak-*` 组件（`data-rarity`、`.ak-rt-*`、`.ak-item` …），输出的最外层包 `ak-scope`；逐步替换现有模板里写死的颜色。不需要 Gadget 再复制一份样式，RL 也不会重复取已加载的模块。
2. **Phase 1 · 皮肤上线（可选皮肤）**：把 `arknights` 从 `$wgSkipSkins` 里拿掉，`$wgDefaultSkin` 不变，用户在 `Special:Preferences` 里自选；收集 Gadget 兼容问题。
3. **Phase 2 · 核心模板改造**：干员 / 关卡 / 道具等模板按[干员页样例](/patterns/operator)的结构调整 Template / Module，Cargo 查询输出组件结构（对照表见[模板与 TemplateStyles](/guide/templates#现网模板-→-组件)）。
4. **Phase 3 · 设为默认**：`$wgDefaultSkin = 'arknights'`；评估移动端是否替代 Minerva（见[与现有扩展的配合](/guide/mediawiki#与现有扩展的配合)）。
5. **持续**：令牌与组件版本化（CHANGELOG）；样例页作为回归基准——改 CSS 前后用 `pnpm e2e --project=snapshots` 拍计算样式快照比对；跨宿主对照页（`preview/gallery.html`）由 `e2e/hosts.spec.ts` 核组件在 Arknights 皮肤 / Vector 2022 / 站外三处一致，CI 的 e2e 流水线每次跑（不挡部署）（见[贡献一个组件 · 改 CSS 之后](/guide/contributing#改-css-之后)）。

## 上线前检查

| 项 | 状态 |
|---|---|
| 亮 / 暗 / 跟随系统三态切换无闪烁；未登录也能持久化 | 待查 |
| 干员页 / 关卡页 / 首页 / 特殊页（搜索、历史、差异、参数设置）截图对比 | 待查 |
| 键盘可达：页眉、侧栏（桌面：切换钮 Enter / Space / → 打开飞出层，↑ ↓ / Esc / Tab；抽屉：树形展开 Enter / Space / ← / →）、页面动作簇、Tabber、对话框、下拉菜单 | 待查 |
| 侧栏：现网 `#MenuSidebar` 注入后桌面各分支悬停 / 点击飞出、不被裁切、不钻到页眉底下，`a.selflink` 所在路径高亮；抽屉里各层级可展开 / 记忆，`a.selflink` 所在路径自动展开 | 待查 |
| 对比度：`.ak-rt-*` 亮色值、`--ak-link`、`--ak-fg-muted` 全部 ≥ 4.5:1（见[可访问性](/foundations/accessibility#对比度)） | 待查 |
| 移动端 ≤ 390 无横向滚动（表格走 `.ak-table-scroll` / `display: block`；`width: 100%` 的组件一律 `box-sizing: border-box`） | 样例页已在 360 / 414 用脚本核过 `scrollWidth === clientWidth`；上线前用真机 / DevTools 移动模式再核一遍 |
| Gadget 兼容：列出依赖 Vector 选择器的小工具并迁移 | 待查 |
| 打印样式（`base/print.css` + `chrome/responsive.css` 的 `@media print`） | 待查 |
| `img { height: auto }` 与依赖 `height=` 属性的 Widget 图标（见[缩略图与图库 · 图片](/content/media#图片)） | 待定：改规则或各 Widget 补 CSS |
| TabberNeue 的 `class` 属性能带到 `div.tabber` 上（变体类要和 `.tabber` 同一元素） | 待查 |

横向滚动那条一旦破，移动端 Chrome 会把布局视口撑宽、整页缩小，`.ak-fab` 这类 fixed 元素被推到可见区外——所以新组件凡是 `width: 100%` / `min-width` 的都要自带 `box-sizing: border-box`（见[命名与约定](/guide/contributing#命名与约定)）。
