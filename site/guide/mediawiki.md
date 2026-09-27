# 在 MediaWiki 中使用

皮肤 `skin/`（AKDS）通过 ResourceLoader 加载全部 CSS；模板、TemplateStyles、Widget 只需要**输出约定好的结构**，不用自己带组件样式。

- 目标站点：prts.wiki · MediaWiki 1.43.5 · 现默认 Vector 2022，移动端 MobileFrontend + Minerva。
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
    ├── tokens.css               │
    ├── base/ components/ decor/ │ 指向 packages/css/src/ 的符号链接（目录整层链接）
    ├── arknights/ chrome/ img/  │
    ├── utilities.css            │
    ├── forced-colors.css        │
    └── sidebar-tree.js · search-palette.js ─┘
```

`resources/` 里除 `skin.js` / `search-providers.js` 外都是指向 `packages/css/src/` 的符号链接；`img/` 是 `.ak-item--bare` 的道具底框（`arknights/item.css` 按 `../img/` 引）。部署时要跟随链接拷贝实体文件。

`skin.json` 的关键项：

```json
"ValidSkinNames": { "akds": { "class": "SkinMustache", "args": [{
  "name": "akds", "template": "skin",
  "responsive": true, "supportsMwHeading": true,
  "toc": false, "wrapSiteNotice": true, "clientPrefEnabled": true,
  "bodyClasses": ["skin-akds"],
  "styles": ["skins.akds.fonts", "skins.akds.tokens", "skins.akds.styles"],
  "scripts": ["skins.akds.js"]
}]}},
"ClientPreferences": { "skin-theme": { "options": ["os", "day", "night"], "default": "os" } }
```

- `toc: false`：关掉 MW 的内联目录，皮肤自己用 `data-toc`（1.40+ 提供 `array-sections`）渲染右侧粘性目录 / 窄屏浮层，见[皮肤骨架 · 目录](/chrome/toc)。
- `supportsMwHeading`：配合站点的 `$wgParserEnableLegacyHeadingDOM = false` 用新版标题 DOM——编辑段落链接的「悬停显形」要求它（见[排版 · 标题](/content/typography#标题)）。
- 要关掉核心的 `mediawiki.searchSuggest`（与搜索面板冲突），`class` 得换成一个极小的 `SkinAKDS extends SkinMustache`，见[搜索面板](/chrome/search#在-mediawiki-里)。
- 配置项：`$wgAKDSDefaultTheme`（`os` / `day` / `night`）、`$wgAKDSSearchPalette`（`false` 关掉悬浮搜索面板）。

## 明暗主题

- `<html>` 上的类：`skin-theme-clientpref-os | -day | -night`，与 Vector 2022 一致（核心 `mediawiki.page.ready` 读写 cookie / localStorage 的 `mwclientpreferences`）。`tokens.css` 已按这三个类定义两套语义令牌，见[色彩 · 主题机制](/foundations/color#主题机制)。
- 切换：`mw.user.clientPrefs.set('skin-theme', 'night')`；页眉的外观开关就是做这件事。未登录也可用（clientPrefs 走 localStorage）。主题类在 `<html>` 上、clientPrefs 的内联脚本早于样式执行，没有 FOUC。
- **Codex 桥接**：`tokens.css` 把 `--background-color-base`、`--color-progressive`、`--border-color-base` 等 Codex 令牌映射到 AKDS 语义令牌，`mw-message-box`、Codex 表单、Echo 弹窗等核心 UI 因此自动跟随；OOUI 少量写死的颜色在 `base/forms.css` 等处覆盖（见[色彩 · Codex / MediaWiki 桥接](/foundations/color#codex-mediawiki-桥接)）。
- 游戏的白色线稿图标统一走 `filter: var(--ak-glyph-filter)`（亮色反相），模板里放游戏图标时给 `<img>` 加 `.ak-glyph`。

## 与现有扩展的配合

| 扩展 | 处理 |
|---|---|
| TabberNeue | `base/tabber.css` 覆盖 `.tabber__*`；变体 `ak-tabber-boxed` / `ak-tabber-block` 必须和 `.tabber` 在同一个元素上（`<tabber class="…">`），包一层 div 不生效，见 [TabberNeue](/content/tabber#变体) |
| Cargo / SMW / DPL3 | 结果表继承 wikitable 规则（`.cargoTable` / `table.mw-datatable`）；结果格式用 `template` 时输出 AKDS 组件结构 |
| Echo | 徽标用 `.ak-badge`（notices 默认黄；alerts 加 `--danger` 红）；弹窗走 Codex 桥接 |
| WikiEditor / CodeMirror | 编辑器底色 `--ak-bg-inset`，在 `base/forms.css` 覆盖（见[表单控件 · 核心按钮与编辑器](/content/forms#核心按钮与编辑器)） |
| MobileFrontend + Minerva | 两条路：(a) 皮肤 `responsive: true`，直接当移动端皮肤用（≤639 规则已写）；(b) 保留 Minerva，把 `skins.akds.tokens` 经 `skinStyles` 注入 Minerva、只换色（仓库里还没有这个模块）。推荐 (a)，分阶段替换 |
| UniversalLanguageSelector | 语言切换在页眉用户菜单的「界面设置」组 `#p-user-interface-preferences`，侧栏不再有 Languages 组 |
| Gadgets | 依赖 Vector 类名（`#mw-panel`、`.vector-*`）的要迁移；骨架保留 MW 标准 id（`#p-personal #p-views #p-cactions #p-navigation #p-tb #searchform #searchInput #firstHeading #bodyContent #catlinks`） |
| Widgets / Gadgets 吐出的裸表单控件（`Widget:PropertyCalc`、各计算器 / 筛选栏） | `base/forms.css` 兜底：36px 定高、表格里 30px 且对齐跟随单元格、主题化颜色与状态；Widget 里针对旧皮肤的样式补丁可以删掉，见[表单控件](/content/forms) |
| 搜索（核心 `mediawiki.searchSuggest`） | 与悬浮面板冲突，需 `SkinAKDS::getDefaultModules()` 清空 `search` 组，见[搜索面板](/chrome/search#在-mediawiki-里) |
