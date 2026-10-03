# 页面模式

L5：把组件拼成整页。样例页运行在皮肤骨架里（`preview/`，由 `python3 scripts/build-preview.py` 从 `preview/_src/` 生成），信息结构取自 prts.wiki 现网页面，只换视觉——页面 wikitext 尽量不改，改的是模板输出的 HTML。

每张样例都分清两半：**皮肤这半**（骨架上的收敛行为，如首页去标题 / 去目录）归 `skin.mustache` 与皮肤样式，站点不用写 `MediaWiki:Common.css`；**页面这半**（区块结构与排布）归模板输出 + TemplateStyles，整页 / 整个模板输出标 `ak-not-prose`。

| 页面 | 状态 | 说明 |
|---|---|---|
| [首页](/patterns/home) | 设计稿 | 现网首页的轮播 / 入口 / 今日信息 / 亮点干员 / 近期新增 / 网站信息 |
| [干员页（陈）](/patterns/operator) | 设计稿 | 现网「陈」页面的 19 个章节；顶部 `CharinfoV2` Widget 原样复用 |
| [干员一览](/patterns/operators) | 设计稿 | 列表 / 筛选页：现网 `CharList` Widget 的 16 行筛选收成「常用三行 + 高级筛选五类页签」（[筛选芯片](/components/chip)，分支选了职业才出、带游戏图标）+ 排序 + 表格 / 卡片 / [干员卡](/arknights/op-card)网格三种结果 |
| [公招计算](/patterns/recruit) | 设计稿 | 工具页：现网 `HrCalculator` Widget 照游戏的招募流程重排——四行标签芯片（个数不限，次序对齐游戏招募页）+ 按「保底几星」分层的组合（每组至多 3 个标签，保底按 9:00 算，不保底的那层默认收起）；没选标签时是全部保底组合的速查 |
| 关卡页 | 规划 | [关卡](/arknights/stage) `.ak-stage` 头 + 地图 + [敌人](/arknights/enemy) `.ak-enemy` 列表 + 掉落 `.ak-item-list` |
| 剧情页 | 规划 | [剧情对话](/arknights/dialogue) `.ak-dialogue` + 分段 + 剧透 `.ak-redacted` |
| 特殊页 / 编辑页 | 规划 | OOUI / Codex 桥接令牌 + `.ak-body--flat`（见[特殊页面](/content/special-pages)） |
