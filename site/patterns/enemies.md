---
title: 敌人一览
---

# 敌人一览

列表 / 筛选页的样例，排布同[干员一览](/patterns/operators)。prts.wiki 现网[敌人一览](https://prts.wiki/w/%E6%95%8C%E4%BA%BA%E4%B8%80%E8%A7%88)（= prts-widgets 的 `EnemiesListV2` Widget）的重新设计：筛选 → 工具条（搜索 · 排序 · 显示方式）→ 结果栏（条数 · 已选条件 · 复制链接 · 分页）→ 结果。**敌人数据与现网是同一份**，换的是视觉与排布；交互上能对着游戏的地方对着游戏——游戏的敌人图鉴（`Torappu.UI.EnemyHandBook`）自己就有一套筛选和排序。

源文件 `preview/_src/pages/enemies.html`，`python3 scripts/build-preview.py` 生成。数据是现网那份 JSON 的快照 `preview/vendor/enemies/data.js`（1710 个敌人，`node scripts/fetch-enemies.ts` 重抓）；头像不入库，运行时从 `media.prts.wiki` 取，取不到时留深色底框和编号。

<PageFrame page="enemies.html" />

## 页面与皮肤的分工

- **Widget 这半**：整页都是 Widget 的输出。现网页面只有一句 <code v-pre>{{#widget:EnemiesListV2}}</code>，Widget 挂到 `#root` 上、自己取「敌人一览/数据」那份 JSON（机器人按游戏数据维护，每个敌人一条）。样例页里那段脚本是 Widget 的替身；生产环境 = prts-widgets 用 `@mooncellwiki/prts-design-vue` 输出同样的结构——`.ak-*` 是设计系统组件，`.el-*` 是这页自己的排布，放 Widget 的样式表。根节点标 `ak-not-prose`；Widget 自己管状态，标 `data-no-toggle`。
- **皮肤这半**：同干员一览——这页没有章节标题、也就没有目录，主列想把目录导轨也吃掉，样例页在「0. 页面级」里按预览骨架打了补丁（见[干员一览 · 页面与皮肤的分工](/patterns/operators#页面与皮肤的分工)）。

## 筛选

现网是两块折叠面板共 10 行（筛选 4 行 / 六维筛选 6 行），每行 = 标题 + 全选 / 清除 + 一排按钮。这里分两层，默认只占三行。

- **常用的一直在**：地位 · 行动方式 / 种类 / 攻击方式 · 伤害类型。这五组就是游戏敌人图鉴筛选面板的五组（`EnemyHandbookShuffleViewModel`：`bossShuffleItems` / `raceShuffleItems` / `attackTypeList` / `damageTypeList` / `motionTypeList`）；选项少的两组（行动方式 2 项、伤害类型 4 项）并进别的行里。「行动方式」现网没有，数据里一直有这个字段。
- **匹配同游戏**（`CheckShuffleInfo`）：一行里选了几项是「或」，行与行之间是「且」。同时会近战和远程的敌人，选「近战」或「远程」都算——游戏里 `applyWay` 是按位与。
- **种类按游戏的次序**：`enemy_handbook_table.raceData` 的 `sortId`，没有种类的归「其他」（`RaceShuffleItem.isOther`）。
- **地位芯片带色块**：精英橙、领袖红，是结果里侧边色条的图例。
- **属性筛选**：一枚整行的开关钮，默认收起，钮上有已选数，开合记号同干员一览的「高级筛选」；开没开记在 `localStorage`。展开是八项属性各一行（比现网的六维多了元素抗性、损伤抵抗），选项都是 SS … E，芯片等宽、上下对成列。
  - **悬停 / 聚焦芯片给出这一档的数值范围**（`生命值 A：12000 – 25000`、`攻击速度 B：攻击间隔 2.6 – 3.5 秒`）：等级字母本身不说明问题。范围取自 `enemy_handbook_table.levelInfoList`，分档规则是 `EnemyHandBookEverViewModel._RefreshAttribute`（`min ≤ 数值 < max`）；攻击速度按攻击间隔分档，越短越高。
- 其余同干员一览：每行 = 标签列 + [筛选芯片](/components/chip)；选中后行标签左缘出青条、露出「清除」；**会筛出 0 条的芯片压淡**（`.is-empty`，仍可点）；不设「全选」；已选条件在结果栏再列一遍（可逐个 ✕、可「清除全部」）。

## 排序

**排序项 × 升降**，一个下拉 + 一枚方向钮。

- 默认是图鉴顺序升序（同现网）。游戏图鉴只有这一种排法（`EnemyHandBookEverViewModel.CompareTo` 比 `sortId`）加一枚升降钮（`_ascendingButton`）。
- 名称与八项属性的等级是现网表头上就能排的，这里并进下拉；表格里点表头也行（降序 → 升序 → 回到图鉴顺序）。
- 属性按等级排（SS 最高）；同级按图鉴顺序；游戏里隐藏数值的敌人（等级是 `?`）不分升降都排最后。

## 结果

**头像**。方图原样铺满，**图鉴编号叠在左上角的深色条上**——游戏敌人图鉴的格子就是这样（`EnemyHandBookItemView` 的 `_viewPart` + `_idPart`）。不裁成圆（原图是方的，系统默认直角），也不另写「NORMAL · B1」那样的一行。

**地位只看侧边色条**：精英橙、领袖红，普通没有颜色（色值同[敌人卡](/arknights/enemy)的左色条）。读屏另有一遍文字（`.ak-sr-only`）。

**等级**不另配颜色，只分轻重：S 档最重，往下一档比一档淡，一列扫下去先看到高的；`?` 最淡。

**能力**一行一条：行首的 `·`（普通）/ `※`（可被沉默，游戏 `abilityList` 的 `textFormat = SILENCE`）悬挂在外，小标题（`TITLE`）加粗；<code v-pre>{{术语}}</code> 是 [`.ak-term`](/components/tooltip)，气泡挂在 `body` 上按视口定位。

- **尖括号里的名字照原样显示**：能力里把别的敌人写成 `<源石虫>`、`<PRTS>`。现网用 `innerHTML` 输出，以拉丁字母开头的那些（`<PRTS>`、`<R系列动力装甲>`）被当成 HTML 标签吞掉了。这里只认数据里实际出现的三种标记（`<br>`、`.mc-tooltips`、两种颜色的 `span`），其余都当文字。

**表格**。现网一行十三栏，能力夹在中间占一栏，长的把整行撑成十几行高，等级被挤到最右边。

- 一个敌人 = 一个 `<tbody>`：上行是头像 + 名称 + 种类 / 攻击方式 + **八项等级各占一列**（点表头排序）；有能力的另起一行写全文，顶上一条弱线。
- 当前排序的那一列铺淡青底；表头吸在页眉下。

**卡片**。结果区窄于 1000（平板 / 手机）时表格换成卡片——看的是结果区自己的宽度，不是视口。外框是[敌人卡](/arknights/enemy) `.ak-enemy`（细框 + 精英 / 领袖的左色条），里面是头像 + 名字，下面摊开八项属性的 4 × 2 格与能力全文。

**头像视图**。敌人卡排成网格，整张卡是链接；按属性排序时卡上带出那项的等级。手机上默认是这个视图（现网手机皮肤上默认的「简」模式只有图、没有名字）。

## 分享链接

`#enemyLevel=精英;领袖&endure=S%2B&_o=attack-d&_d=1`——写法照干员一览：`<字段>=选项;选项`（字段名同数据）、`_s` 搜索、`_o` 排序项-升降、`_d` 显示方式（0 表格 / 1 头像）。

**只读不写**：打开页面（和地址栏的 `#` 变了）时读一次，之后筛选不往地址栏回写——现网没有地址栏参数，刷新页面就是清空；要分享点结果栏的「复制链接」。带属性筛选的链接打开时面板自动展开。不带 `=` 的 `#` 是页内锚点，不当成清空。

## 现网 → 这里

| 现网 | 这里 | 说明 |
|---|---|---|
| `FilterGroup`：标题 + 全选 / 清除 + 按钮 | `.el-row`：标签 + [`.ak-chip`](/components/chip)（`aria-pressed`） | 去掉全选；清除只在有选中时出现 |
| 两块折叠面板（筛选 / 六维筛选） | 常用三行 + 「属性筛选」`.el-more` | 多了行动方式、元素抗性、损伤抵抗 |
| 搜索框 | [`.ak-search`](/components/search) | 多搜图鉴编号；不分大小写 |
| 表头上的排序箭头 | `.ak-select` + 方向钮（表头也能点） | |
| 「简」钮 | [`.ak-btn-group`](/components/button/)：表格 / 头像 | 头像视图带名字 |
| `NDataTable`（十三栏） | `.ak-table.el-table`（一敌一组） | 窄了换 `.el-card` |
| 头像 65px 方图 | `.el-avatar`：方图 + 左上角编号 | |
| 「地位」一栏的文字 | 侧边色条 | 精英橙 / 领袖红 |
| 能力（`innerHTML`） | `.el-ability`：一行一条 | 尖括号不再被吞 |
| `NPagination`（50 / 100 / 200 / 500） | [`.ak-pagination`](/components/pagination) + `.ak-select` | 上下各一条；在底部翻页回到结果开头 |
| 没有 | 复制链接（`.ak-btn--ghost` + [Toast](/components/toast)） | |
| 没有结果：空表 | [`.ak-empty`](/components/empty) + 「清除全部条件」 | |

## 没有照搬的

- **没有直接用 `.ak-enemy__img` / `.ak-enemy__code`**。[敌人卡](/arknights/enemy)现在的头像是裁成圆的、编号写成「NORMAL · B1」一行；这页只借了它的外框（细框 + 左色条）与 `.ak-enemy__name`，头像是自己的 `.el-avatar`。敌人卡要不要跟着改成方图 + 编号角标，等关卡页的敌人列表做出来一起定。
- **`.el-*` 没进设计系统**。筛选行、工具条、结果栏、分页这几块与干员一览的 `.ol-*`、[道具一览](/patterns/items)的那一套几乎一样——现在有三张列表页了，可以按共同部分提成组件，这次没动。
- **属性等级的数值范围是抄在页面 / Widget 里的快照**，游戏改了分档要跟着改。
- **没有做无 JS 的兜底**（现网也没有）：`<noscript>` 只给一句提示。
