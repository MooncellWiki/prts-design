# AKDS · 明日方舟网页设计系统（for prts.wiki 新皮肤）

> Arknights Web Design System — 参考 [ReEnd-Components](thirdparty/ReEnd-Components)（终末地）的令牌→组件→模式分层，
> 视觉母体为 [明日方舟官网](https://ak.hypergryph.com/) 与游戏内 UI（torappu 解包），目标是 prts.wiki（MediaWiki 1.43）的新皮肤。

## 在线预览

- 设计系统展示（运行在皮肤骨架内）：https://claude.ai/code/artifact/f04aa56e-c8bb-4491-ae2c-7711f330d396
- 干员页整页样例（陈）：https://claude.ai/code/artifact/0b7e2137-5569-416d-8f3a-620b12ce81a2

本地：直接打开 `preview/index.html` / `preview/operator.html`（右上角切换 终端(暗) / 档案(亮) / 跟随系统）。

## 目录

```
docs/
  01-design-system.md          规范：理念、令牌（含每个颜色的出处）、字体、间距、装饰语言、图标、可访问性
  02-components.md             组件清单：L1 MW 内容 / L2 皮肤骨架 / L3 通用 / L4 方舟 / L5 页面模式；ReEnd 对照 + MW 映射
  03-mediawiki-integration.md  皮肤落地：skin.json、RL 模块、mustache 结构、clientPrefs 主题、Codex 桥接、TemplateStyles/Lua 用法、迁移路线
src/
  tokens.css        令牌 + 双主题 + Codex/MW 令牌桥接（必须最先加载）
  base.css          .mw-parser-output / wikitable / toc / tabber / 表单 / diff …
  components.css    通用组件 .ak-btn .ak-tag .ak-card .ak-panel .ak-tabs .ak-message …
  arknights.css     方舟装饰（切角/斜切/斜纹/网点/角标）+ 游戏数据组件（稀有度/职业/技能/道具/干员卡/模组/档案…）
  skin.css          皮肤骨架：页眉/侧栏/页面头/TOC/页脚/响应式
  utilities.css     工具类
  index.css         本地汇总入口
skin/               MediaWiki 皮肤骨架：skin.json · templates/skin.mustache · resources/skin.js（CSS 为 src 的符号链接）· i18n
tokens/tokens.json  机器可读令牌（scripts/export-tokens.py 生成）
preview/            展示页 + 干员页样例 + preview.js + assets/（torappu 解包的游戏图标：职业/精英/潜能/专精/稀有度/势力/道具/技能/头像）
dist/               单文件打包（图片内联，用于发布/分享；scripts/build-dist.py 生成）
scripts/            export-tokens.py · build-dist.py
```

## 三句话看懂这套系统

1. **黑白为体、青为用**：大面积黑/白/灰；青 `#18D1FF`（官网，暗色主题）/ `#0098DC`（游戏内，亮色主题）只做选中、链接、主动作与强调条；黄 `#FFD800` 为次强调；红只表示危险/NEW。
2. **直角、斜切、斜纹、半调网点、角标三角、黑白反转、大写拉丁装饰字、白色线稿图标**——这组几何装饰语言（`.ak-chamfer .ak-skew .ak-stripes .ak-halftone .ak-corner .ak-inverse .ak-en .ak-glyph`）取代了终末地的菱形/辉光。
3. **终端 / 档案双主题**是双正典（游戏本身就是双色 UI），走 MediaWiki 1.43 的 `skin-theme-clientpref-*` 机制，并把 Codex 令牌桥接到 `--ak-*`，核心/扩展 UI 自动跟随。

## 颜色出处（可追溯）

| 来源 | 取得的令牌 |
|---|---|
| 官网 CSS（`web.hycdn.cn/arknights/official/_next/static/css/*`） | `#18D1FF` 青、灰阶 `#1D1F20 #8D8D8D #D2D2D2`、字体 Novecento Sans Wide / Bender / Oswald / 思源黑体、标题左 8px 色条与短横条、右上三角 |
| 游戏解包精灵（torappu：`ui/pages/home_page` `ui/character/*` `arts/*_hub` …） | 选中蓝 `#0098DC`、`#22BBFF`、开关 `#0075A9`、黄 `#FFD800`、SP 荧光绿 `#CAEC46`、红 `#A40000/#711111/#C82A36`、标准按钮灰 `#313131`、亮色面板 `#F5F5F5`、稀有度星/职业/精英/潜能/专精/势力图标 |
| gamedata（`gamedata_const.richTextStyles`、`sandbox_table.charRarityColorList`） | 富文本 `ba.vup #0098DC / ba.vdown #FF6237 / ba.rem #F49800 / ba.kw #00B0FF …`；稀有度 `#BABABA #D3DC35 #82C5F5 #BF96ED #EFD691 #FF9433` |

## 使用

- 任何页面：`<link rel="stylesheet" href="src/index.css">`（或分文件按需）。
- MediaWiki：把 `skin/` 复制到 `skins/AKDS/`，`wfLoadSkin('AKDS')`；`resources/*.css` 由 `src/` 同步。详见 `docs/03-mediawiki-integration.md`。
- 模板/TemplateStyles：直接输出 `.ak-*` 结构（示例见 `preview/*.html` 源码），令牌可在 TemplateStyles 中 `var(--ak-accent)` 引用。

## 重新生成

```bash
python3 scripts/export-tokens.py                       # tokens.css → tokens/tokens.json
python3 scripts/build-dist.py                          # preview → dist（需要 Pillow）
```

## 说明

- 字体：预览未内嵌商用字体（Novecento/Bender），Latin 展示字回退到系统字体；上线建议自托管 Oswald + 思源黑体子集（OFL）。
- 游戏素材版权归鹰角网络所有；本仓库仅作 PRTS 皮肤设计用途。
