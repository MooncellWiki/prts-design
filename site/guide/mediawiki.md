# 在 MediaWiki 中使用

皮肤骨架 `skin/`（Arknights 皮肤的参考实现）通过 ResourceLoader 加载全部 CSS；模板、TemplateStyles、Widget 只需要**输出约定好的结构**，不用自己带组件样式。皮肤装上以后，组件那一份（`skins.akds.components`）在别的皮肤的页面上也能 `mw.loader.using`，见[模块与层序](/guide/resourceloader#resourceloader-模块)。

::: tip 生产皮肤是 Skin:Arknights
prts.wiki 实际部署的是 [mediawiki-skins-Arknights](https://github.com/MooncellWiki/mediawiki-skins-Arknights)（`wfLoadSkin('Arknights')`，皮肤名 `arknights`）。它用 `scripts/sync-design-system.sh` 把本仓库 `packages/css/src/` 原样拷进 `resources/design-system/`（连同 `chrome/`），按 `index.css` 的顺序写进自己的 skin.json；模板（PHP 组件喂数据的 Mustache partial）按 `chrome/` 的类名输出，它自己的 LESS 只剩 MediaWiki 胶水（核心 / 扩展 UI 的 skinStyles、`.notheme` 生成物、无 JS 的真搜索表单这类）。本仓库的 `skin/` 是骨架参考实现，本节其余内容以它为例；两者的名字对照：

| 本仓库 `skin/` | Skin:Arknights |
|---|---|
| 皮肤名 `akds`，bodyClasses 显式加 `skin-arknights`（MW 还会按皮肤名自动加 `skin-akds`） | 皮肤名 `arknights`，`body.skin-arknights` 是 MW 自动加的。设计系统里「在皮肤里」的标记统一是 `skin-arknights`：`scope.css` 用 `:not(.skin-arknights *)` 区分别的宿主，`chrome/` 与 `base/print.css` 也按它写 |
| `skins.akds.base / components / fonts / shell / tokens` | `skins.arknights.base / components / fonts / shell / tokens`，另有 `skins.arknights.icons`（OOUI 图标包）与排在最后的 `skins.arknights.styles`（MediaWiki 胶水 LESS） |
| `$wgAKDSDefaultTheme` / `$wgAKDSSearchPalette` | `$wgArknightsThemeDefault` / `$wgArknightsSearchPalette`（全部配置见其 README） |
| `mw.hook('akds.search.local')` · `localStorage['akds-recent']` | `mw.hook('skin.arknights.search')` · `localStorage['arknights-search-recent']`；另有 `$wgArknightsSearchIndex` 把 Cargo 表做成带拼音的本地索引 |
| 主题：核心 `clientPrefEnabled` + `ClientPreferences` | 同一套 `skin-theme-clientpref-*` 类与 `mwclientpreferences` 存储，由皮肤自己的内联脚本与 `theme.js` 读写 |
| 侧栏 `#MenuSidebar` 由现网内联脚本搬入 | 服务端以当前页为上下文解析 `MediaWiki:MenuSidebar`（`$wgArknightsMenuSidebar`），无内联脚本 |
| 图标 sprite 内联在 skin.mustache | 同样内联（`templates/IconSprite.mustache`，同步脚本从本仓库抽取）；骨架自身另用 OOUI 图标包 `<span class="ak-icon ak-icon--{name}">` |
:::

- 目标站点：prts.wiki · MediaWiki 1.43.9 · 现默认 Vector 2022（未开夜间模式），移动端 MobileFrontend + Minerva。
- 已装、与皮肤相关的扩展：TemplateStyles · Gadgets · Widgets · TabberNeue · Cargo · SemanticMediaWiki · DPL3 · Echo · CodeMirror · WikiEditor · UniversalLanguageSelector · MsUpload · PageImages · TextExtracts。
- 未装：DarkMode（皮肤自带明暗）· Popups · VisualEditor。

这一节的几页：

| 页 | 内容 |
|---|---|
| 本页 | 安装、`skin.json` 要点、明暗主题、与现有扩展的配合 |
| [模块与层序](/guide/resourceloader) | ResourceLoader 模块划分、CSS 加载顺序、体积 |
| [skin.mustache 结构](/guide/skin-template) | 骨架 DOM ↔ MW 模板数据、门户、页脚数据、`#MenuSidebar` |
| [模板与 TemplateStyles](/guide/templates) | 模板 / Lua 怎么输出组件、现网模板 → 组件对照 |
| [迁移与上线](/guide/rollout) | 分阶段替换 Vector、上线前检查清单 |

活动主题（Gadget 换头图 / 站标 / 主色）见[皮肤骨架 · 头图与主题接口](/chrome/theming)；搜索面板的 MW 数据源见[搜索面板 · 在 MediaWiki 里](/chrome/search#在-mediawiki-里)。

## 安装

```
skins/AKDS/                      ← 仓库的 skin/ 拷过去，LocalSettings 里 wfLoadSkin('AKDS')
├── skin.json                    注册皮肤 + ResourceLoader 模块 + clientPrefs
├── templates/skin.mustache      骨架（SkinMustache，不写 PHP）
├── i18n/{en,zh-hans}.json
└── resources/
    ├── skin.js                  主题切换 / 抽屉 / 目录 scrollspy / 标签页 / data-bind / 提示可访问性 …
    ├── search-providers.js      搜索面板的 MW 数据源
    ├── fonts.css · fonts/       ─┐
    ├── tokens.css · scope.css   │
    ├── bridge-codex.css         │
    ├── base/ components/ decor/ │ 指向 packages/css/src/ 的符号链接（目录整层链接）
    ├── arknights/ chrome/ img/  │
    ├── utilities.css            │
    ├── forced-colors.css        │
    └── sidebar-tree.js · search-palette.js ─┘
```

`resources/` 里除 `skin.js` / `search-providers.js` 外都是指向 `packages/css/src/` 的符号链接；`img/` 是 `.ak-item--bare` 的道具底框（`base/skin-assets.css` 按 `../img/` 声明成 `--ak-item-bg-*`，`arknights/item.css` 读变量）。部署时要跟随链接拷贝实体文件。

`skin.json` 的关键项：

```json
"ValidSkinNames": { "akds": { "class": "SkinMustache", "args": [{
  "name": "akds", "template": "skin",
  "responsive": true, "supportsMwHeading": true,
  "toc": false, "wrapSiteNotice": true, "clientPrefEnabled": true,
  "bodyClasses": ["skin-arknights"],
  "styles": ["skins.akds.base", "skins.akds.components", "skins.akds.fonts", "skins.akds.shell"],
  "scripts": ["skins.akds.js"]
}]}},
"ClientPreferences": { "skin-theme": { "options": ["os", "day", "night"], "default": "os" } }
```

- `styles` 里的模块按模块名字母序输出（MW 的实现如此），这四个的字母序就是层叠顺序；它们都不能带 `dependencies`。为什么这么分、各装什么见[模块与层序](/guide/resourceloader)。
- `toc: false`：关掉 MW 的内联目录，皮肤自己用 `data-toc`（1.40+ 提供 `array-sections`）渲染右侧粘性目录 / 窄屏浮层，见[皮肤骨架 · 目录](/chrome/toc)。
- `supportsMwHeading`：配合站点的 `$wgParserEnableLegacyHeadingDOM = false` 用新版标题 DOM——编辑段落链接的「悬停显形」要求它（见[排版 · 标题](/content/typography#标题)）。
- 要关掉核心的 `mediawiki.searchSuggest`（与搜索面板冲突）：在 `SkinPageReadyConfig` 钩子里把 `search` 置 `false`（Vector 2022 的做法；Skin:Arknights 的 `SkinHooks::onSkinPageReadyConfig()`），见[搜索面板](/chrome/search#在-mediawiki-里)。
- 配置项：`$wgAKDSDefaultTheme`（`os` / `day` / `night`）、`$wgAKDSSearchPalette`（`false` 关掉悬浮搜索面板）；Skin:Arknights 叫 `$wgArknightsThemeDefault` / `$wgArknightsSearchPalette`。

## 明暗主题

- `<html>` 上的类：`skin-theme-clientpref-os | -day | -night`，与 Vector 2022 一致（核心 `mediawiki.page.ready` 读写 cookie / localStorage 的 `mwclientpreferences`）。`tokens.css` 已按这三个类定义两套语义令牌，见[色彩 · 主题机制](/foundations/color#主题机制)。
- 切换：`mw.user.clientPrefs.set('skin-theme', 'night')`；页眉的外观开关就是做这件事。未登录也可用（clientPrefs 走 localStorage）。主题类在 `<html>` 上、clientPrefs 的内联脚本早于样式执行，没有 FOUC。
- **Codex 桥接**：`bridge-codex.css`（生成物，在 `skins.akds.base` 里，只有 Arknights 皮肤加载——放到别的皮肤上会改掉宿主自己的 Codex 配色）把 `--background-color-base`、`--color-progressive`、`--border-color-base` 等 Codex 令牌映射到 PRTS Design 语义令牌，`mw-message-box`、Codex 表单、Echo 弹窗等核心 UI 因此自动跟随；OOUI 少量写死的颜色在 `base/forms.css` 等处覆盖（见[色彩 · Codex / MediaWiki 桥接](/foundations/color#codex-mediawiki-桥接)）。
- 游戏的白色线稿图标统一走 `filter: var(--ak-glyph-filter)`（亮色反相），模板里放游戏图标时给 `<img>` 加 `.ak-glyph`。

## 与现有扩展的配合

| 扩展 | 处理 |
|---|---|
| TabberNeue | `base/tabber.css` 覆盖 `.tabber__*`；变体 `ak-tabber-boxed` / `ak-tabber-block` 必须和 `.tabber` 在同一个元素上（`<tabber class="…">`），包一层 div 不生效，见 [TabberNeue](/content/tabber#变体) |
| Cargo / SMW / DPL3 | 结果表继承 wikitable 规则（`.cargoTable` / `table.mw-datatable`）；结果格式用 `template` 时输出 PRTS Design 组件结构 |
| Echo | 徽标用 `.ak-badge`（notices 默认黄；alerts 加 `--danger` 红）；弹窗走 Codex 桥接 |
| WikiEditor / CodeMirror | 编辑器底色 `--ak-bg-inset`，在 `base/forms.css` 覆盖（见[表单控件 · 核心按钮与编辑器](/content/forms#核心按钮与编辑器)） |
| MobileFrontend + Minerva | 两条路：(a) 皮肤 `responsive: true`，直接当移动端皮肤用（≤639 规则已写）；(b) 保留 Minerva，把令牌 + Codex 桥接（`tokens.css` + `bridge-codex.css`）经 `skinStyles` 注入 Minerva、只换色（仓库里还没有这样的模块；组件本身在 Minerva 上直接 `mw.loader.using("skins.akds.components")` 即可）。推荐 (a)，分阶段替换 |
| UniversalLanguageSelector | 语言切换在页眉用户菜单的「界面设置」组 `#p-user-interface-preferences`，侧栏不再有 Languages 组 |
| Gadgets | 依赖 Vector 类名（`#mw-panel`、`.vector-*`）的要迁移；骨架保留 MW 标准 id（`#p-personal #p-views #p-cactions #p-navigation #p-tb #searchform #searchInput #firstHeading #bodyContent #catlinks`） |
| Widgets / Gadgets 吐出的裸表单控件（`Widget:PropertyCalc`、各计算器 / 筛选栏） | `base/forms.css` 兜底：36px 定高、表格里 30px 且对齐跟随单元格、主题化颜色与状态；Widget 里针对旧皮肤的样式补丁可以删掉，见[表单控件](/content/forms) |
| 搜索（核心 `mediawiki.searchSuggest`） | 与悬浮面板冲突，在 `SkinPageReadyConfig` 钩子里把 `search` 置 `false`（1.43 里 `Skin::getDefaultModules()` 的 `search` 组本来就是空的，改那里没用），见[搜索面板](/chrome/search#在-mediawiki-里) |
