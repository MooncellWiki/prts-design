# AKDS · MediaWiki 皮肤落地指南

> 目标站点：prts.wiki · MediaWiki 1.43.5 · 现默认 Vector 2022，移动端 MobileFrontend + Minerva
> 已装扩展（与皮肤相关）：TemplateStyles · Gadgets · Widgets · TabberNeue · Cargo · SemanticMediaWiki · DPL3 · Echo · CodeMirror · WikiEditor · UniversalLanguageSelector · MsUpload · PageImages · TextExtracts
> 未装：DarkMode（皮肤自带明暗）· Popups · VisualEditor

## 1. 架构

```
skins/AKDS/
├── skin.json                    ← 注册皮肤 + ResourceLoader 模块 + clientPrefs
├── templates/
│   └── skin.mustache            ← 骨架（SkinMustache，无需 PHP）
├── resources/
│   ├── tokens.css               ← = src/tokens.css
│   ├── base.css                 ← = src/base.css
│   ├── components.css           ← = src/components.css
│   ├── arknights.css            ← = src/arknights.css
│   ├── skin.css                 ← = src/skin.css
│   ├── utilities.css            ← = src/utilities.css
│   ├── skin.js                  ← 主题切换 / 抽屉 / TOC scrollspy / 标签页 / toast
│   ├── images/                  ← 职业/精英/稀有度等白色线稿（或走 File: 命名空间）
│   └── fonts/                   ← Oswald + 思源黑体子集（OFL），可选
└── i18n/{en,zh-hans}.json
```
`skin/` 目录已提供 `skin.json` 与 `skin.mustache` 骨架，`resources/` 用符号链接或构建脚本从 `src/` 同步。

## 2. ResourceLoader 模块划分

| 模块 | 内容 | 加载 |
|---|---|---|
| `skins.akds.tokens` | tokens.css | **所有页面**，`<head>` 顶部（`skin.json` `SkinStyles`/`styles`） |
| `skins.akds.styles` | base.css + skin.css + components.css + arknights.css + utilities.css | 所有页面 |
| `skins.akds.js` | skin.js（`mw.user.clientPrefs`、抽屉、TOC、标签页、data-bind） | 所有页面（defer） |
| `skins.akds.mobile` | 移动端追加（若同时供 Minerva 使用则改为 `skinStyles` 注入） | 按 target |
| `skins.akds.fonts` | @font-face（可选） | 可由用户偏好/Gadget 关闭 |

`skin.json` 关键项：
```json
"ValidSkinNames": { "akds": { "class": "SkinMustache", "args": [{
  "name": "akds", "template": "skin",
  "responsive": true,
  "bodyClasses": ["skin-akds"],
  "styles": ["skins.akds.tokens", "skins.akds.styles"],
  "scripts": ["skins.akds.js"],
  "clientPrefEnabled": true,
  "wrapSiteNotice": true, "toc": false
}]}},
"ClientPreferences": { "skin-theme": { "options": ["os","day","night"], "default": "os" } }
```
`toc:false` + 自己渲染 `data-toc`（1.40+ 提供 `data-toc.array-sections`），实现右侧粘性目录。

## 3. skin.mustache 结构 ↔ CSS 类

```
<div class="ak-skip">…
<header class="ak-header"> .ak-header__inner
   button.ak-header__menu | a.ak-header__logo{{data-logos}} | nav.ak-header__nav{{#data-portlets.data-navigation}} (可改为 MediaWiki:Sidebar 首个 portlet)
   form.ak-header__search{{data-search-box}} | .ak-header__tools [theme-toggle][{{data-portlets.data-notifications}}][{{data-portlets.data-user-menu}}]
<div class="ak-layout">
   aside.ak-sidebar {{#data-portlets-sidebar}} .ak-portlet(.ak-portlet--grid for first) …
   main.ak-main#content
      header.ak-page-header  [breadcrumb from {{html-subtitle}}] {{html-indicators}} h1#firstHeading {{{html-title}}}
         .ak-page-header__bar  ul.ak-page-tabs{{data-portlets.data-views}} ul.ak-page-tabs--actions{{data-portlets.data-actions}}
      div.ak-body#bodyContent  {{{html-site-notice}}} {{{html-user-message}}} .mw-body-content{{{html-body-content}}}
         .ak-body-foot {{#data-footer.data-info}}
      {{{html-categories}}}
   aside.ak-toc  ul[data-toc] ← 由 data-toc 或 skin.js 生成
<footer class="ak-footer"> {{#data-footer.data-places}} {{#data-footer.data-icons}}
```
Portlet 渲染用 `Skin::getPortletsTemplateData()` 输出的 `html-items`，外层类由 mustache 加；`li.selected` 与 CSS `.ak-page-tabs li.selected` 对应（MW 原生类名）。

## 4. 明暗主题（clientPrefs）

- HTML 类：`skin-theme-clientpref-os | -day | -night`（与 Vector 2022 一致；MW 核心 `mediawiki.page.ready` 在 `<html>` 上读写 cookie/localStorage `mwclientpreferences`）。
- 切换：`mw.user.clientPrefs.set('skin-theme', 'night')`；tokens.css 已按这三个类定义。
- 未登录用户也可用（clientPrefs 走 localStorage）。
- **Codex 桥接**：tokens.css 第 3 段把 `--background-color-base`、`--color-progressive`、`--border-color-base` 等 Codex 令牌映射到 AKDS 语义令牌，因此 `mw-message-box`、Codex 表单、Echo 弹窗、搜索建议等核心 UI 自动跟随。OOUI 少量硬编码色在 base.css 里覆盖。
- 图片：白色线稿类图标统一走 `filter: var(--ak-glyph-filter)`（亮色反相）。模板里放游戏图标时给 `<img>` 加 `.ak-glyph`。

## 5. 模板 / TemplateStyles / Lua 如何使用组件

- 组件类全部是纯 CSS，无需 JS：模板直接输出 `<div class="ak-skill">…</div>` 等结构（见 `docs/02-components.md` 与 `preview/*.html` 源码）。
- **TemplateStyles**：组件 CSS 已随皮肤加载，模板样式表只写模板特有布局；需要令牌时直接 `var(--ak-accent)`（css-sanitizer 5.x 支持自定义属性）。
- Lua（Scribunto）把 gamedata 富文本 `<@ba.vup>x</>` 转 `<span class="ak-rt-vup">x</span>`；`<$ba.stun>` 转 `<span class="ak-rt-term" data-ak-tip="…">`。
- 稀有度：容器 `data-rarity="6"`；子元素用 `.ak-r-*`。职业：`data-prof="warrior"`。
- 图标资源：建议把 `preview/assets/{profession,elite,potential,specialized,rarity,subprofession,camp}` 上传为 `File:AKDS_*.png` 或放皮肤 `resources/images/`，模板通过 `{{filepath:}}` 或 `--ak-asset-base` 引用。
- 交互增强（等级切换、阶段切换）：`data-bind-*` 约定已在 preview.js 演示（`data-scope` + `data-bind="phase"` + `data-bind-phase='{"e0":…}'`），可作为 Gadget 或皮肤 JS 的一部分。

## 6. 与现有扩展的配合

| 扩展 | 处理 |
|---|---|
| TabberNeue | base.css 覆盖 `.tabber__*`；提供 `.ak-tabber-boxed / .ak-tabber-skew` 变体（`<tabber class="…">` 或包裹 div） |
| Cargo / SMW / DPL3 | 表格继承 wikitable 规则；结果格式 `template` 时输出 AKDS 组件结构 |
| Echo | 徽标用 `.ak-badge`；弹窗走 Codex 桥接 |
| WikiEditor / CodeMirror | 编辑器底色用 `--ak-bg-inset`，已在 base.css 基线覆盖 |
| MobileFrontend + Minerva | 两条路：(a) 皮肤 `responsive:true` 后可直接作为移动端皮肤（≤639 规则已写）；(b) 保留 Minerva 时，把 `skins.akds.tokens` 通过 `skinStyles` 注入 Minerva，仅换色。推荐 (a) 分阶段替换 |
| UniversalLanguageSelector | 触发器放 `.ak-header__tools` |
| Gadgets | 现有小工具若依赖 Vector 类名（`#mw-panel`、`.vector-*`），需迁移；`skin.mustache` 保留 MW 标准 id（`#p-personal #p-views #p-cactions #p-navigation #p-tb #searchform #firstHeading #bodyContent #catlinks`） |

## 7. 迁移路线

1. **Phase 0 · 令牌落地**：以 Gadget 形式加载 `tokens.css + arknights.css`，在 Vector 2022 上先让模板可用 `.ak-*` 组件（`data-rarity`、`.ak-rt-*`、`.ak-item`…），并逐步替换现有模板中的硬编码颜色。
2. **Phase 1 · 皮肤上线（可选皮肤）**：`skins/AKDS` 安装，`$wgDefaultSkin` 不变，用户可在 Special:Preferences 选择；收集 Gadget 兼容问题。
3. **Phase 2 · 干员/关卡/道具等核心模板改造**：按 `preview/operator.html` 结构调整 Template/Module，Cargo 查询输出组件结构。
4. **Phase 3 · 设为默认**：`$wgDefaultSkin = 'akds'`；移动端评估是否替代 Minerva。
5. **持续**：令牌与组件版本化（CHANGELOG），预览页作为回归基准（截图对比）。

## 8. 性能与工程

- CSS 合计 ~90KB 未压缩（tokens 15 / base 25 / components 30 / arknights 30 / skin 12 / utilities 6），gzip 后 < 20KB。可按需拆 `arknights.css` 为独立模块，仅内容页加载。
- 无 JS 依赖的组件为主；skin.js < 6KB。
- 字体：思源黑体子集（常用 3500 字 + 页面动态子集）；标题拉丁字用系统回退时视觉退化可接受（预览即为回退效果）。
- 图片：白色线稿 PNG 已在 100–200px；建议转 SVG/WebP。
- 缓存：ResourceLoader 版本化；主题类在 `<html>` 上，无 FOUC（clientPrefs 内联脚本早于样式）。

## 9. 检查清单（上线前）

- [ ] 亮/暗/跟随系统三态切换无闪烁；未登录持久化
- [ ] 干员页 / 关卡页 / 首页 / 特殊页（搜索、历史、差异、偏好设置）截图对比
- [ ] 键盘可达：页眉、侧栏、页面标签、Tabber、Dialog、Dropdown
- [ ] 对比度：`.ak-rt-*` 亮色值、`--ak-link`、`--ak-fg-muted` 全部 ≥ 4.5:1
- [ ] 移动端 ≤ 390：无横向滚动（表格走 `.ak-table-scroll` / display:block）
- [ ] Gadget 兼容：列出依赖 Vector 选择器的小工具并迁移
- [ ] 打印样式
