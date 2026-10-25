---
title: 后勤技能一览
---

# 后勤技能一览

列表 / 筛选页的样例：现网[后勤技能一览](https://prts.wiki/w/%E5%90%8E%E5%8B%A4%E6%8A%80%E8%83%BD%E4%B8%80%E8%A7%88)换成[干员一览](/patterns/operators)那套排布——一条提示 → 筛选（设施 / 作用对象 / 解锁阶段 / 干员稀有度 / 干员职业）→ 搜索 / 排序 / 两种显示方式 → 条数 · 已选条件 · 复制链接 · 分页 → 结果。现网这页不是 Widget：正文是 <code v-pre>{{后勤技能信息/store}}</code> 的 Cargo 输出，10 个设施各一张默认折叠的 wikitable（图标 / 名称 / 描述 / 持有干员），720 行、929 个「干员 × 技能」条目，没有搜索和筛选，看一条技能谁有要先展开那个设施再往下翻。这里把数据改从游戏的 `building_data` 来（现网那张表本来就是它的誊抄），多出游戏里有、现网没有的几样：设施次序 / 技能次序、作用对象、效率、技能名条的底色、按精英阶段替换的技能链；见[对着游戏](#对着游戏)。

源文件 `preview/_src/pages/riic.html`，`python3 scripts/build-preview.py` 生成。数据是游戏数据整理成的快照 `preview/vendor/riic/data.js`（763 条技能、432 位干员，`python3 scripts/build-riic-data.py --gamedata <torappu 解包的 gamedata 目录>` 重新生成）；技能图标与头像不入库，运行时从 `torappu.prts.wiki` 取。设施的白色线稿 `preview/assets/building/`（10 张）取自游戏进驻面板的 `buff_icon_hub`。

<PageFrame page="riic.html" />

## 页面与皮肤的分工

- **页面这半**：开头那条「如需了解后勤技能中出现的各种中间产物……」是页面正文里的 <code v-pre>{{参阅}}</code>（一条 <code v-pre>{{Cbox2}}</code>），不归 Widget 管。
- **Widget 这半**：其余都是 Widget 的输出，挂到 `#root`。样例页里那段脚本是 Widget 的替身；生产环境 = prts-widgets 用 `@mooncellwiki/prts-design-vue` 输出同样的结构——`.ak-*` 是设计系统组件，`.rs-*` 是这页自己的排布，放 Widget 的样式表。根节点标 `ak-not-prose`。
- **皮肤这半**：同干员一览，这页没有目录（现网有：10 个设施各一章——这里设施是筛选芯片 + 结果里吸顶的分组标题，目录没有用处了）。

## 数据从哪来

现网这页的数据链是：游戏数据 → 编辑用 <code v-pre>{{后勤技能信息/store}}</code> 誊进 Cargo（技能名 / 房间 / 图标 / 描述）+ 干员页的 <code v-pre>{{后勤技能}}</code> 存持有关系 → 页面查 Cargo 拼表。这页直接读游戏数据（torappu 解包的 gamedata）：

| 表 | 取了什么 | 用在哪 |
|---|---|---|
| `building_data.buffs` | 每条技能：`buffName` / `description`（富文本）/ `roomType` / `sortId` / `buffCategory` / `efficiency` / `targets` / `skillIcon` / `buffColor` · `textColor` | 行的全部；设施分组；排序；作用对象筛选；方砖颜色 |
| `building_data.chars` | 每位干员两个技能槽 `buffChar[i].buffData`：按解锁条件 `cond`（精英阶段 + 等级）依次替换的技能链 | 持有干员；解锁阶段筛选；「替换为 / 由 … 升级而来」；干员视图 |
| `building_data.rooms` · `buffSortData` | 设施名；制造站 / 加工站 / 训练室按效率排序时的分组（贵金属 / 作战记录 / 源石碎片、基建材料 / 精英材料 / 技巧概要 / 芯片、八个职业） | 设施芯片；作用对象芯片 |
| `character_table` | 干员名 / 稀有度 / 职业 / 分支 | 持有干员的稀有度 · 职业筛选；头像垫色 |
| `gamedata_const.termDescriptionDict` · `richTextStyles` | 描述里 `<$cc.xxx>` 术语的名字与解释；`<@cc.vup>` 这几种富文本标签 | 描述的 HTML（生成快照时就转好） |

生产环境 Widget 自己取这份数据（同干员一览那样由后端 / 页面给，或 Widget 运行时拉 gamedata 的 JSON），页面正文只剩那条提示。两边的 929 个「干员 × 技能」条目核对过：游戏数据里有后勤技能的 432 位干员 = 现网「持有干员」出现的 432 位，每位的解锁条件也一致。

## 对着游戏

游戏自己没有「后勤技能一览」这张表，技能出现在两处：干员详情的「基建技能」页签（`BuildingBuffDescView`：技能名条 `_bkgTitle` 取 `buffColor`、字取 `textColor`，图标在名条左边，解锁条件写在下面，下一级技能有「下一级」按钮）与基建进驻面板的干员列表（`BuildingStationSelect*`，每位干员名下一排技能图标，图标外一圈设施色光环 `buff_image_config`）。这页从这两处取的东西：

| 游戏 | 出处 | 页面上 |
|---|---|---|
| 技能的次序 | 进驻面板的 `CharSortType.BUFF_SORTID`：`sortId` 升序，设施各占一段（控制中枢 1000–、发电站 2000–、制造站 3000–……） | 排序项「游戏顺序」= 设施次序 + `sortId`；按这个排时结果按设施分组 |
| 效率 | `CharSortType.EFFICIENCY`：`buffs[].efficiency`（只有带效率排序的设施 `buffSortData.hasEfficiencySort` 才有值） | 排序项「效率」；行里标「效率 N」 |
| 作用对象 | `buffSortData.efficiencyTargetDict`：制造站按产物（`F_GOLD` / `F_EXP` / `F_DIAMOND`）、加工站按材料类别、训练室按职业分组，`StationCharViewModel.BuffStruct._CheckBuffMatchesTarget` 看 `buffs[].targets` 含不含 | 「作用对象」行：选了这三个设施才出，一个设施一段 |
| 技能类别 | 进驻面板的筛选 `CharFilterType.ROOM_BUFF_OUTPUT / FUNC / RECOVER` = `buffCategory` 产出 / 功能 / 恢复 | 没用：类别几乎跟设施走（发电 / 制造 / 贸易 = 产出、宿舍 = 恢复、其余 = 功能，763 条里只有 2 条例外），行里标出来只会让人问「功能」是什么意思 |
| 技能名条的底色 | `buffColor` / `textColor`（每个设施一种：控制中枢 `#005752`、制造站 `#ffd800`、训练室 `#7d0022`……） | 方砖 `.rs-tile` 的底色 + 白色技能图标；亮色主题的设施色 |
| 设施色（暗底） | `arts/building/buffs/buff_image_config`：进驻面板技能图标光环的颜色，按 `RoomType`（控制中枢 `#00E4D7`、制造站 `#FFCC00`、训练室 `#D20039`……） | 暗色主题的设施色：芯片上的线稿、分组标题的色条 |
| 设施线稿 | `arts/building/buffs/buff_icon_hub`：10 个设施各一枚白色线稿（钻石 / 灯泡 / 立方 / 文件 / 笑脸 / 三角 / 人像 / 哑铃 / 回收 / 文书） | `.rs-glyph` 当 mask、填 currentColor（同干员一览的职业线稿） |
| 技能链 | `BuildingBuffUtil.FindUnlockedBuffFromSlot`：一槽里按 `cond` 取当前解锁的那条，`BuildingBuffDescStruct.nextLevelBuff` 指下一级 | 行里的「精英二替换为 ×××」/「由 ××× 升级而来」；干员视图里一槽一条链 |

现网的「精英 0 / 1 / 2」小图标（叠在头像左下）照旧，只是不再是模板里的 inline style。

## 筛选

五行，每行 = 标签列 + [筛选芯片](/components/chip)，行内「或」、行间「且」（写法同[干员一览的筛选行](/patterns/operators#筛选)）：

- **设施**：10 枚，带设施线稿（线稿取设施色，选中后跟文字）。
- **作用对象**：选了制造站 / 加工站 / 训练室才出（同干员一览「分支」行只在选了职业时出），一个设施一段、段首是设施名。**只约束自己那个设施的技能**：选着制造站 + 加工站、点「贵金属」，加工站的技能不受影响。
- **解锁阶段**：精英零 / 精英零 30 级 / 精英一 / 精英二，带精英图标。
- **干员稀有度 / 干员职业**：同干员一览的写法（星 + 数字、职业线稿）。
- 后三行看的是「持有干员」：**技能只要有一位持有者符合就留下，不符合的持有者压淡**（`.is-dim`，悬停恢复）、符合的排到前面——留着是为了看得出这条技能还有谁。
- 点了也不会多出技能的芯片压淡（`.is-empty`，仍可点）；已选条件在结果栏再列一遍（可逐个 ✕、可「清除全部」）；手机上五行收成一枚「筛选」钮。

搜索同时搜技能名、描述（含术语）、持有干员的名字，命中的字在结果里高亮（`<mark>`，只换文本节点，不碰标签）。

## 排序 · 显示方式

结果栏的条数只写当前视图的那一种：技能视图「共 763 条技能」/「n / 763 条技能」，干员视图数干员。

- **排序项 × 升降**：游戏顺序 / 效率 / 持有人数 / 技能名。按游戏顺序排时结果按设施分组，组头 = 设施线稿 + 名字 + 英文代号 + 本组条数（`n / 设施总数`）、左缘设施色条、滚动时贴在页眉下面；别的排序不分组，每行自己带一枚设施名。
- **技能**（默认）：一行一条——方砖（技能名条底色 + 白色技能图标）‖ 名字 · 解锁条件 · 效率 · 替换关系 · 描述 ‖ 持有干员。持有干员是设计系统的[干员卡](/arknights/op-card) `.ak-op-card--sm`（同首页「亮点干员」：纯头像、不出名字栏；角标同现网 微件:干员头像——职业左上、星级右下），宽 64；悬停 / 聚焦出「名字 · 稀有度 职业 · 解锁条件」（纯 CSS [提示](/components/tooltip)）。**精英图标不叠在卡上**（64px 的卡叠三枚角标会把脸盖掉一半）：解锁条件在行里写一次——持有者条件都一样的（763 条里 729 条）写在技能名旁边，不一样的（线索搜集·β 这类 34 条）把持有干员按条件分成几段、段首写条件。超过 10 位先收起、点「+N」展开（线索搜集·α 有 10 位，独处 9 位）。结果区窄于 860 时持有干员移到描述下面一整行、卡收到 56、方砖缩小到 36。
- **干员**（现网没有）：一张卡一位干员——同一张干员卡头像（职业 / 星级在角上，卡头只剩名字）+「技能 1」「技能 2」两槽，每槽按精英阶段依次替换的技能链一行一条（小方砖 + 名字 + 解锁条件 + 设施，描述在下）；只有一槽的干员（104 位）不出空的「技能 2」。要看「某位干员有哪些后勤技能」现网得去干员页；这里顺便把干员页「后勤技能」那张表的信息按游戏进驻面板干员卡的摆法放了一遍。干员视图里排序只剩游戏顺序（稀有度高的在前，同稀有度按 charId）/ 名称，被筛掉的技能在卡里压淡。
- 描述里的富文本照游戏的 `richTextStyles`：`<@cc.vup>` 加成 / `<@cc.vdown>` 减益 / `<@cc.kw>` 关键词 / `<@cc.rem>` 提醒 → [富文本](/arknights/rich-text) `.ak-rt-vup / vdown / kw / rem`；`<$cc.xxx>` 术语 → `.ak-rt-term` + `data-ak-tip`（`termDescriptionDict` 的「名字：解释」，宽提示 `.ak-tip--wide`）。现网是 <code v-pre>{{color}}</code> 硬编码的颜色 + <code v-pre>{{术语}}</code> 的 mc-tooltips。

## 地址栏

现网没有地址栏状态。写法同干员一览 / 道具一览的 `#` 参数：

- `room=1-CONTROL;MANUFACTURE` · `target=1-gold;exp` · `phase=1-e0;e2`（`e0l30` = 精英零 30 级）· `rarity=1-6;5` · `prof=1-WARRIOR`。
- `_s` 搜索 · `_o` 排序（`order-d` / `eff-d` / `holders-d` / `name-a`，游戏正序不写）· `_d=1` 干员视图。

## 和现网不一样的

- **不再按设施折叠**：现网进页面是 10 张收起的表，要看什么先展开再翻；这里全部摊开、按设施分组吸顶，设施是筛选而不是章节。
- **多了筛选、搜索、排序、干员视图、地址栏状态、空状态**。
- **持有干员的头像**：现网叠着稀有度 / 职业 / 精英三枚小图（inline style 拼的），这里换成设计系统的干员卡，只留职业 / 星级两枚角标，精英条件写在行里、名字在提示里；职业 / 稀有度还多了筛选。
- **描述里的数据不改**：现网誊抄的描述与游戏文本是同一份（<code v-pre>{{color|#0098DC|+2%}}</code> = `<@cc.vup>+2%</>`），这里直接从游戏数据转 HTML，颜色走令牌、不再写死。
- **同名技能各算各的**：「最高权限」「丰富工作经验」这类同名不同条目（精零 / 精二两版，或不同设施的同名）在现网是两行，这里也是两行，但行里写明替换关系。
- 没动的：条目总数（763 条技能、432 位干员、929 个干员 × 技能）与现网一致。

## 现网 → 这里

| 现网 | 这里 | 说明 |
|---|---|---|
| <code v-pre>{{参阅}}</code>（Cbox2） | [`.ak-cbox--tip`](/components/cbox) | 页面正文，不归 Widget |
| 10 个 `== 设施 ==` 章节 + 目录 | 「设施」筛选行 + 结果分组 `.rs-section`（吸顶组头） | 目录撤掉 |
| `wikitable.logo mw-collapsible mw-collapsed` | `.rs-section` + `.rs-row-item` | 不折叠 |
| 图标格（`#999999` 灰底 + 技能图标） | `.rs-tile`：游戏技能名条的底色 + 白色图标 | 现网暗色下要靠 <code v-pre>{{#widget:style}}</code> 改灰底 |
| 描述里 <code v-pre>{{color}}</code> / <code v-pre>{{术语}}</code> | [`.ak-rt-*`](/arknights/rich-text) + `.ak-rt-term[data-ak-tip]` | 颜色走令牌 |
| 持有干员：头像 + 稀有度 / 职业 / 精英三枚小图 | [`.ak-op-card--sm`](/arknights/op-card)（`__prof` / `__rarity` 角标）+ 行里的 `.ak-elite` 解锁条件 + 提示 | 多了职业 / 稀有度筛选 |
| （无） | `.rs-filter` 五行 [`.ak-chip`](/components/chip) | |
| （无） | [`.ak-search`](/components/search) · `.ak-select` + 方向钮 · [`.ak-btn-group`](/components/button/) | 搜索 / 排序 / 显示方式 |
| （无） | 已选条件 [`.ak-tag`](/components/tag) + 复制链接（[Toast](/components/toast)）+ [`.ak-pagination`](/components/pagination) | |
| （无） | `.rs-op` 干员卡 | 干员视图 |
| （无） | [`.ak-empty`](/components/empty) | 没有结果 |

## 没有照搬的

- **`.rs-*` 没进设计系统**：筛选行 / 工具条 / 结果栏 / 分页条和干员一览 `.ol-*`、道具一览 `.il-*` 是同一套，提成组件另开一轮做（[道具一览 · 没有照搬的](/patterns/items#没有照搬的)）。方砖 `.rs-tile`（技能名条底色 + 白色图标）值得进 `arknights/`，等干员页「后勤技能」那张表也换过来再一起提。
- **游戏的技能名条**（整条底色、字用 `textColor`）没照搬成整行底色：一行里还有描述和头像，整行铺设施色太吵，只留一块方砖。
- **进驻面板的光环图标**（圆形光环 + 图标）没照搬：那是 40px 的小图标摆法，这里方砖 48px 够放白色线稿，光环色改用在设施线稿与色条上。
- **没有做无 JS 的兜底**（现网有：全是静态表）：`<noscript>` 只给一句提示。生产环境若要保留无 JS 可读，Widget 可以像现网那样先输出静态表再接管。
