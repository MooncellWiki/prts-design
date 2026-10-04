---
title: 干员页样例（陈）
---

# 干员页样例（陈）

信息结构 1:1 取自 prts.wiki 现网「陈」页面的 19 个章节。顶部「干员信息」= 现网 `CharinfoV2` Widget 原样（DOM / CSS / JS 一字不改，静态文件快照在 `preview/vendor/charinfo/`），其余章节 = 现网各模板 → 设计系统组件的映射（见下）。

源文件 `preview/_src/pages/operator.html`。

<PageFrame page="operator.html" />

## 章节

现网「陈」页面的 wikitext 是 19 节模板调用。新皮肤下**干员页的 wikitext 一字不改，章节一节不少**：改的是各模板输出的 HTML（换成设计系统组件）；<code v-pre>{{CharinfoV2}}</code> 这块连样式表都先不动——原样跑现网 Widget，皮肤只补接缝。

异格一览 `.op-alter` → **干员信息**（现网 Widget 原样）→ 特性 `.ak-kv--boxed` → 获得方式 `.ak-kv--inline` → 属性（`.op-calc` 属性计算器 + 模组选择 + `.ak-attrs` / 四档 wikitable）→ 攻击范围 ×3 → 天赋（条件表 + 潜能 · 算法开关）→ 潜能提升 `.ak-pot-list` → 技能 ×3（全等级表 + 日 / 英名 + 提示 + 范围 + 备注）→ 后勤技能 → 精英化材料 → 技能升级材料（+ 专精三技能表）→ 模组 ×3 `.ak-module`（原型证章 + X + Y）→ 相关道具 → 干员档案（竖排页签 9 段 + 未获得时档案 `.ak-archive`）→ 语音记录（语种切换 + 38 条 `.ak-voice`）→ 干员密录 → 悖论模拟 → 干员异格任务（已删除存档）→ 干员模型 `.sv`（[SpineViewer](#干员模型)）→ 引用 + navbox。

- 舞台之下**不设身份栏 / 题注**：代号 / 星级 / 职业 · 分支 · 位置 / 标签 / 画师 / CV / 时装舞台 HUD 上都有（手机版样式表只藏按钮，这些字段照留），所属在「属性」节的所属势力行；HUD 之外只剩情报编号 / 干员序号 / 游戏内 ID / 日文名——前三者不是关键信息，日文名属多语言名称数据，都不值得在门面外显。先前的身份栏键值表 8 行里 6 行与 HUD 复读，已整块删掉。舞台文字全由 JS 填入，无 JS / 爬虫看到的舞台是空的——生产环境若在意，让模板另出一份 `visually-hidden` 的键值，不做可见复读。
- 属性表四维之下再四行：部署费用 / 阻挡 / 攻击间隔 / 再部署——这四项游戏数据里就是按精英阶段存的，和四维同一个轴，不另起键值表（现网附加属性表里 colspan 横跨的那几项，「19 → 21 → 23」是在一格里手搓列轴）；势力两项 `.ak-kv--inline` 一行做表脚。

## 现网模板 → 组件

| 现网（wikitext → 输出） | 新结构 | 说明 |
|---|---|---|
| <code v-pre>{{异格干员}}</code> → `.alter-operator-list` wikitable | `.op-alter`：黑标「异格一览」+ 原型 / 异格 [`.ak-op-card--sm`](/arknights/op-card)（当前页 `.is-current`）+ `<details>` 说明 | 现网的 popup 说明改成就地展开 |
| <code v-pre>{{CharinfoV2}}</code> → <code v-pre>{{#widget:charinfoV2}}</code> | **原样**：DOM、`charinfo_*.min.css` ×2（600px 切桌面 / 手机）、`charinfo_*.min.js` + `charId*.js` + `charVoice*.js`、模板参数生成的内联数据全部照旧；皮肤只补几条接缝规则 | 见下「CharinfoV2 怎么接」 |
| <code v-pre>{{干员获得方式}}</code> → cbox 提示 + wikitable | [`.ak-cbox--tip`](/components/cbox)（另见「干员上线时间一览」，位置同现网：先提示后表）+ [`dl.ak-kv--inline`](/arknights/kv)（两对一行；获得方式值用中性 `.ak-tag`，不用 `--yellow`——整页的黄只留给真要强调的东西） | |
| <code v-pre>{{属性}}</code> → `Widget:CharEquipSelector` 模组下拉 + 附加属性表 + 四档属性表 + `Widget:PropertyCalc` 计算器 | `.op-calc`（[`.ak-phase-tabs`](/arknights/phase-tabs) + 裸 `<input>` `<select>`：等级 / 信赖 / 潜能 / 模组 + [`.ak-attrs`](/arknights/attrs) HUD 读数）+ `wikitable.ak-compact`（精英 0 1 级 / 精英 0 满级 / 精英 1 满级 / 精英 2 满级 / 信赖加成上限；四维 + 部署四项）+ `dl.ak-kv--inline`（所属势力 / 隐藏势力） | 计算器与模组选择合成一块：选了潜能，「潜能提升」节里对应格点亮 |
| <code v-pre>{{干员攻击范围}}</code> → 三格 wikitable | `.op-ranges > .ak-range` ×3（精英零 / 一 / 二），见[攻击范围](/arknights/range) | |
| <code v-pre>{{天赋列表3}}</code> → wikitable + `Widget:Passages switch` | [`table.ak-talent-table`](/arknights/talent-table)：潜能开关 `.is-pot`（描述换成潜能版）+ **算法开关 `.is-calc`**（描述里每个加成项前露出 `.ak-calc--add / --mul / --fadd / --fmul` 四枚标记 + `tfoot` 图例行） | 同现网「潜能 / 算法」两个复选框 |
| <code v-pre>{{潜能提升}}</code> → 五格 wikitable | [`.ak-pot-list > .ak-pot`](/arknights/pot-list)（图标 + 小标 + 效果；`.is-on` 由属性面板点亮） | |
| <code v-pre>{{技能}}</code> ×3 → 表头 + 全等级 wikitable + 备注 | [`.ak-skill-sheet`](/arknights/skill-sheet)：表头（图标 / 名称 + 日 / 英名 / SP 芯片（提示解释回复与触发方式）/ 开放阶段 / 范围 `.ak-range--sm`）+ `.ak-skill-table`（1–7 + 专精 Ⅰ–Ⅲ；列头芯片带提示：初始 / 消耗 / 持续的定义）+ `__note`；术语与异常效果 = `.ak-rt-term.ak-tip--wide` | 现网的 <code v-pre>{{术语}}</code> / <code v-pre>{{异常效果}}</code> 弹窗 → 宽版提示 |
| <code v-pre>{{后勤技能}}</code> → wikitable（条件 / 图标 / 技能 / 房间 / 描述） | `wikitable.ak-compact` + `.ak-elite`；图标位 `.ak-glyph-box` | 现网技能图标由 Cargo 查出，样例用线稿占位 |
| <code v-pre>{{精英化材料}}</code> <code v-pre>{{技能升级材料}}</code> → wikitable | [`.ak-materials`](/arknights/materials)（1→2 … 6→7，`__divider` 写「达到精英阶段 1 后解锁」）+ 专精 `wikitable`（三技能 × 专精 Ⅰ–Ⅲ，同现网一张表对比） | 材料 `.ak-item--sm` + 提示名称；图还是现网那张 `道具_带框_<名>.png`，<code v-pre>{{道具图标}}</code> 只换外壳：`<div style="display:inline-block;position:relative">` + `.prts-item-quantity-label` → `.ak-item` + `.ak-item__count` |
| <code v-pre>{{模组}}</code> ×N → `.equiptemplate` | [`.ak-module[data-color]`](/arknights/module)：型号块（类型图标 + SWO-X）+ 名称 + 说明提示 + 基础信息（故事默认 3 行，「全文阅读」checkbox 展开）+ 三阶段表（属性 / 特性追加 · 天赋更新）+ 解锁任务 + 解锁需求与材料（信赖 / 等级 / 任务 + `.ak-item-list`）；原型证章 = 同一张卡不带 `data-color` | `类型颜色` → `data-color`；<code v-pre>{{修正}}</code> → `.template-fix-mark` + `<references group=注>` |
| <code v-pre>{{相关道具}}</code> → wikitable | `wikitable.ak-compact` + `.ak-item` | |
| <code v-pre>{{人员档案}}</code> → 折叠 wikitable（9 段）+ 未获得时档案 | `.op-files`：左 `.ak-tabs--vertical`（9 项 + 解锁条件短写；<768 横排）+ 右 `.ak-tabpanel > .ak-dossier`（基础档案 `.ak-kv`、综合体检 `.ak-attrs--compact`、其余段落；`__unlock` 写解锁条件）；未获得时档案 → `.ak-archive`（解锁条件 `.ak-stage-code`），见[档案](/arknights/dossier) | 游戏档案页的「左列表右正文」；9 段全在 DOM 里 |
| <code v-pre>{{:xx/语音记录}}</code>（`#voice-table-root` VoiceTable + `#voice-data-root` 多语种数据） | `.ak-voice-toolbar` 里两排 `.ak-voice-langs`：**文本**（台词语言 `.ak-chip` 多选，可一个不选）+ **语种**（音频差分单选，带 CV 名）+ [`.ak-voice-list > .ak-voice`](/arknights/voice)（标题 / `__cond` 解锁条件 / 文件名 `.ak-code-id` / 文本 `data-cn data-jp data-en data-kr data-yue`） | 38 条全部列出；文本选几种就显示几行，语种只换音频；独立的 `/语音记录` 页每条多一枚下载钮 `.ak-voice__download`，干员页里不给 |
| <code v-pre>{{干员密录}}</code> <code v-pre>{{悖论模拟}}</code> → 折叠 wikitable | [`.ak-archive`](/arknights/archive)：头（kicker + 标题 + 解锁条件 `.ak-elite` / `.ak-trust`）+ 体（文案）+ 脚（阅读密录 / 关卡 `.ak-stage` / 首通奖励 `.ak-item`） | |
| <code v-pre>{{干员异格任务}}</code> → cbox + wikitable | `.ak-cbox--warning`（已删除、仅存档；图标 `i-trash` = 现网 delete-empty）+ `wikitable.ak-compact` + `.ak-item-list` + `.ak-chevrons` | |
| <code v-pre>{{spineId}}</code>（SpineViewer） | `.sv`：选择条（时装 `.ak-chip` · 模型 `.ak-btn-group`，多于 5 个换 `.ak-select`）+ 舞台 + 动作列表 + 时间轴 / 播放条 | 见下「[干员模型](#干员模型)」；未载入时只有一个「载入模型」`.ak-btn--primary` |
| <code v-pre>{{干员导航}}</code> | `.navbox`（见[分类栏与杂项](/content/catlinks#工具类)） | |

## CharinfoV2 怎么接

样例页就是这么接的，生产环境同理。

- **Widget 原样**：<code v-pre>{{#widget:charinfoV2}}</code> 输出的 DOM、模板参数生成的内联数据（`char_info` / `charimg_params` / `charskin_params` / `back_list` …）、`charinfo_*.min.css`（桌面 / 手机两份，600px 切）、`charinfo_*.min.js` + `charId*.js` + `charVoice*.js`、crypto-js、`charname` 字体全部照旧。样例把这些静态文件钉版本抓成快照 `preview/vendor/charinfo/`（`scripts/fetch-charinfo.py`；`NOTICE.md` 记着来源与仅有的改动——CSS 里几处 `url()` 改相对路径、charVoice 只留陈），立绘 / 场景图 / 职业 · 星级 · 分支图标 / BGM / 语音仍由脚本运行时从 media / static / torappu.prts.wiki 拉。
- **依赖**：脚本用 `RLQ.push(['jquery', fn])` 等 jQuery——MW 里 ResourceLoader 照常处理；样例页自带 jQuery 3.7.1（= MW 1.43）和两行 RLQ 替身。
- **接缝规则**（样例页 `<style>` 的「舞台接缝」段；生产放 Widget 自己的 `<style>` 或站点样式）：
  1. 桌面版舞台 1024×576 定宽、Widget 自己不缩（现网 Vector 正文 975 宽也就那么溢出着），正文列比它窄时整块 `zoom: var(--op-stage-zoom)`（页面脚本按列宽算）。用 zoom 不用 transform：Widget 的「全屏查看」是把 wrapper 设成 `position: fixed` 铺满视口，transform 会改它的包含块、zoom 不会；再加 `:has(> .charinfo-wrapper[style*="fixed"]) { zoom: 1 }`，全屏时不缩。
  2. 全屏层与手机「查看立绘」层的 z-index 抬到 `--ak-z-modal` 之上（Widget 内联的 999 只够压 Vector——它顺手压下去的 `#mw-panel` `#mw-head` 皮肤里没有）。
  3. `line-height: 1.6`（Vector 正文行高；Widget 的文字全靠继承，皮肤正文的 1.7 会把画师面板 / 语音气泡撑高一点）。
  4. Widget 的两份样式表按**视口**宽度切（600px），脚本却按**正文**宽度（舞台的祖父元素 `#mw-content-text`）<600 判手机版。视口 601 起、正文列还不到 600 的那一段（皮肤里约 601–690），脚本会给桌面版的 1024 舞台套上手机版的缩放（`transform: scale(正文宽 / 600)` + 容器内联宽高），舞台撑出页面一倍：`@media (min-width: 601px)` 里把容器的内联宽高、wrapper 的内联 transform 用 `!important` 压掉，页面脚本算 zoom 时同样按视口判，这一段照桌面版缩。脚本内部仍当自己是手机版（时装面板的几处内联定位走手机那套），根治得改 Widget 的脚本（判断换成 `matchMedia('(max-width: 600px)')`）。
- **接缝之外**：Widget 的手机版由脚本按正文宽度 <600 在加载时一次性决定（自己 transform 缩放，不响应 resize），视口 ≤600 时皮肤不插手——它量的是舞台的祖父元素，样例骨架因此照 MW 原样保留 `#mw-content-text.mw-body-content > .mw-parser-output` 两层（并成一层会量到带内边距的 `.ak-body`，手机上舞台比正文宽出 24px）；看图模式的滚轮缩放 / 拖拽用 `getBoundingClientRect` 对 `offsetWidth`，zoom 之下拖动手感会差一个系数（全屏时 zoom 归 1，不受影响）。

### 换皮草案（暂不接入）

`packages/css/src/charinfo.css` 是对同一套 DOM 的皮肤化草案：黑玻璃 HUD（同页眉）、直角、选中 = 青条 + 青字、名字牌 = 思源 900 + 6px 青条（不再要 `charname` 字体）、时装 / 场景抽屉从右缘滑入、整块按容器宽度 `transform: scale(var(--charinfo-scale))`、≤639 藏 HUD 只留页签与名字牌。它不在 `index.css` / `skin.json` 里。真要接入得连 JS 一起改三处：resize 只设 `--charinfo-scale`；选中态从换蓝图标 + 内联 color 改成加类 `.is-active`；面板 / 抽屉开合从内联 height / right / opacity 改成加类 `.is-open` `.is-show` `.is-watch`。先把现网的动效 / 文本排布 / 试听语音 / BGM 原样看全，再定换皮范围。

## 干员模型

页面最后一节 = 现网的 SpineViewer（prts-widgets `src/widgets/SpineViewer/`）。**运行时、模型地址、`meta.json` 的结构都与现网相同**（样例页真的从 `torappu.prts.wiki` 取模型来播；运行时是 prts-widgets 那一份的快照 `preview/vendor/spine/`，`node scripts/fetch-spine.ts`；导出 GIF 用的 gifenc 同现网一个版本，快照在 `preview/vendor/gifenc/`，`node scripts/fetch-gifenc.ts`，点了导出才加载），换的是「怎么看」。样例页那段脚本是 Widget 的替身，地址栏加 `?spine=char_4104_coldst` 可以换一位干员看（动作多的 / JSON 骨骼的 / 只有「战斗」一面的）；`?spine=enemy_1265_durcar` 是模型多的敌人（自走车，31 个，模型收进下拉；敌人没有 `meta.json`，模型表是页面里内联的那份，样例页留了一份快照）。

现网是一张卡片：左边三个下拉（时装组 / 模型组 / 动画）、循环开关、背景取色器、速度滑杆、四个圆按钮，右边一块 300×300 的画布（1000×1000 的画布缩到 0.3）。这里拆成四块，从上到下是「选哪个 → 看 → 控制」：

- **选择条**：时装是一排[筛选芯片](/components/chip)，模型是一组按钮（正面 / 背面 / 基建，顺序固定）。游戏里小人只有两类：战斗（`CharacterAnimator` 的 `front` / `back` 两张脸）与基建（`VCharacter`），`UICharSpineHolder.SpineType` 也只分 `BATTLE` / `BUILDING`——所以是一组三个键而不是下拉。敌人页的「敌人模型」也是这个 Widget，一套骨骼可以装几十个 skin（自走车有 31 个），一行按钮会撑出正文列——**模型多于 5 个就收进[下拉选择](/components/select)**（同 Select 的用法：≤ 5 个、立即生效的视图切换才用按钮组），宽度随最长的名字；手机上弹的是系统的滚轮选择器。换时装 / 模型时沿用同名动作（没有就回到待机），速度、循环、朝向、背景不变。
- **舞台**：正方形，边长随正文列宽、最大 560（动作列表吃掉剩下的宽度，高度跟舞台齐），按设备像素比出图。舞台就是**取景框** = 导出的画幅：框边长 1000 骨骼单位，同现网 1000×1000 画布的那把尺（贴图差不多 1 : 1，各时装 / 模型大小可比），缩放读数的 100% 就是它；放大、手机横屏时舞台不是正方形，把框画出来、框外压暗（提示里写「框内为导出画面预览」）。载入、换动作后自动取景——脚底原点落在框里横向正中、纵向 80% 处；当前动作（连同一招的另几段，连播换段时不跳）全程的包围盒只算看得见的附件（有的特效平时 alpha = 0 挂在老远），在这把尺下出框就先平移，平移也装不下才缩小；拖过 / 缩放过就不再替人取景，双击复位才回去。脚下一枚落脚点（游戏里战斗 / 基建小人脚下都有一枚 `Shadow`）。底色没手动选过就跟页面：Arknights 皮肤白天浅色、夜间深色（看令牌解析出来的 `color-scheme`，clientpref 类 / `data-theme` / 跟随系统几种开法都认，切了不用刷新），别的皮肤固定浅色；右下角四格换：深 / 浅 / 透明 / 自定义，选过就不再跟。「自定义」是自己画的取色面板（外框 [`.ak-popover`](/components/tooltip)，里面是饱和度 / 明度平面 + 色相条 + 十六进制 + 8 个预设，预设里有绿幕 / 品红，导出 WebM 后好抠像），不用 `<input type="color">`——那个弹的是浏览器 / 系统自己的取色面板（Chrome 的小窗、macOS 的系统色板、Windows 的对话框），各家长得不一样。右上角四个工具：翻转朝向（游戏的 `faceSign`）、网格线（默认关，脚底那条地面线跟着一起开关）、复位视图、放大（整块铺满视口，Esc 退出；支持 Popover API 的浏览器提进顶层——Vector 的 `#bodyContent` 是 `z-index: 0` 的层叠上下文，里面的 fixed 再高也盖不过侧栏和「TOP」按钮，进不了顶层的旧浏览器放大期间把这两样藏起来）。
  - **拖拽平移；缩放要按住 Ctrl / ⌘ 再滚轮**（触控板捏合、双指捏合同效）。现网在画布上直接吃掉滚轮，长页面滚到这里会被卡住；这里不按 Ctrl 的滚轮照常滚页面。放大模式里滚轮直接缩放。手机上竖向滑动留给页面，放大后才整块接管。
  - 键盘（舞台获得焦点后）：空格 播放 / 暂停，← → 逐帧，F 翻转，G 网格线，0 复位；导出中不接（遮罩只挡得住指针）。
  - 只在播放中且舞台在视口内时才逐帧重绘。
- **动作列表**：一行一个动作，点了就播——游戏自己的时装预览（`ui/skinselect/skin_preview_panel`）底部也是一排直达按钮（`btn_play_enter` / `btn_play_special` / `btn_play_interact`），不是下拉。
  - 超过 8 个时按 入场 / 待机 / 攻击 / 技能 / 其它 分组；组内把一招的几段按出招顺序排（`Skill_2_Begin` → `Skill_2_Loop` → `Skill_2_End`，段名同游戏的 `BEGIN_ANIM_KEY` / `END_ANIM_KEY`），骨骼文件里是字母序。
  - 只给游戏代码里有名有姓的键加中文注：战斗 `AnimationConsts` 的 Idle / Die / Stun / Default…，基建 `VCharacter` 状态机的 Relax / Move / Interact / Sit / Sleep / Special。`Skill_2_Loop` 这类各干员自取的名字不猜。
  - 每行右边是帧数（30 帧 / 秒，游戏的逻辑帧）；带黄色菱形的数字 = 这个动作里 `OnAttack` 事件的个数，即判定次数（陈的「赤霄·绝影」是 11）；悬停这个数字（或键盘聚焦到这一行）出 [`.ak-tooltip`](/components/tooltip) 列出是第几帧——不放在整行的 `title` 里（浏览器原生提示，要在行上停一会儿才出，也看不出该停在哪）。列表是滚动容器，CSS 版 `data-ak-tip` 会被裁掉，所以同干员一览的术语提示，按视口定位。现网藏在 ⓘ 气泡里的「模型动画数据」表就是这一列，不再另设。
  - 默认播待机（战斗 `Idle`、基建 `Relax`）并循环；现网默认播字母序第一个动作（多半是 `Attack`）一遍就停。
- **时间轴 + 播放条**：时间轴可拖、吸附到整帧，右边读数「当前帧 / 总帧数 · 秒」；**骨骼数据里的事件帧标在轴上**——`OnAttack`（攻击判定）是黄色菱形，其余（`OnStart` / `OnPlayAudio` / `OnAttackFinished`）是细竖线，悬停看帧号；播放头扫过判定帧时舞台左上角闪一下。前摇几帧、第几帧出伤害，不用再数。
  - 播放 / 暂停、上一帧 / 下一帧；「循环」；「连播」= 播完一段接同一招的下一段，最后一段播完回到第一段；速度 ×0.1–×2。对应游戏 UI 小人的三种播法 `PlayAnimOption.LOOP` / `PLAY_ONCE` / `STOP`（定格在某一帧，`framePercent`）。
  - 导出：都只出取景框。PNG（当前帧）与 WebM（当前动作播一遍）1000 × 1000；GIF 500 × 500 与 GIF 2x 1000 × 1000（文件约为 GIF 的 3 倍），当前动作按所选速度，「循环」开着就一直循环、关了播一遍停在最后一帧。按钮的提示只写尺寸。背景选了颜色就带上，选透明就是透明底。
  - GIF 不录屏：逐帧把动作画进取景框、读回像素再编码，所有帧共用一套 256 色（均匀挑几帧求，比逐帧求快、前后帧不闪）；帧时长以厘秒计，按累计时刻取整（30 帧 / 秒排成 3 4 3…，总时长不漂），快到一帧不足 2 厘秒就隔帧取。导出中遮罩上有进度，导完回到导出前那一帧。透明底的 GIF 只有全透明 / 不透明两档（alpha 过半算不透明），边缘有锯齿、半透明的光效会变实或消失——背景选了透明时导出按钮下面出一行警示色的提示，照样能导。
- **未载入**：只有一个「载入模型」按钮（同旧版）——运行时与模型都等点了再取，同现网；载入失败在按钮旁边一行红字。

实现上的一处不同：现网用 `AnimationState` 推进时间，循环靠每圈重新入队来绕开多圈累加的旋转问题；这里每帧从初始姿态起把动作在 `t` 时刻的姿态直接套上（`Animation.apply` + `MixBlend.setup`），同一个 `t` 永远是同一个姿态，所以能拖、能逐帧、能倒退，也没有累加问题。运行时里 prts-widgets 的修补（旋转 ±180° 处的 `Math.fround`）在 `RotateTimeline` 里，这条路径照样经过。

## 皮肤与页面的分工

**皮肤这半**：无——干员页不需要皮肤层的特殊处理，标题 / 目录 / 动作簇照常（目录自动收 19 个 h2 + 技能 / 模组的 h3）。

**页面这半**：`.op-*` 的几条排布规则归各模板的 TemplateStyles（`Template:异格干员/styles.css`、`Template:属性/styles.css`、`Template:人员档案/styles.css`、语音记录的），样例页把它们合在页面的一个 `<style>` 里（`.sv-*` 是 SpineViewer 这个 Widget 自己的样式表，也合在里面）；属性计算器 / 语音语种切换与播放的脚本，生产环境分别是 `Widget:PropertyCalc`、VoiceTable——样例页脚本只是演示这些交互在新结构上怎么接（语音记录的播放钮走的是与现网同一套 torappu.prts.wiki 音频地址）；舞台的交互就是现网 charinfo JS 本身，样例页只算一个 zoom 系数。
