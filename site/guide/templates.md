# 模板与 TemplateStyles

组件类全部是纯 CSS，随皮肤加载，**不需要 JS**：模板 / Lua 直接输出约定好的 HTML 结构即可，外观与明暗主题由皮肤保证。每个组件页的示例都有「HTML」页签——那是 Vue 实现实际渲染出的结构，模板照着输出，外观一模一样：

```html
<div class="ak-cbox ak-cbox--tip">
  <span class="ak-cbox__icon"><svg class="ak-icon"><use href="#i-arrow-ne"/></svg></span>
  <div class="ak-cbox__body">如需了解<b>所有干员的上线时间</b>，可查阅<a href="…">干员上线时间一览</a>页面。</div>
</div>
```

## 规则

- **最外层标 `ak-not-prose`**：子树就不受正文排版（标题色条、列表菱形符、链接色）影响——整块是链接的组件尤其需要。见[设计理念 · prose / not-prose](/foundations/principles#prose-not-prose)。
- **TemplateStyles 只写模板特有的布局**：组件 CSS 已随皮肤加载，不要在模板样式表里再抄一份。要颜色 / 尺寸时直接引令牌 `var(--ak-accent)`（css-sanitizer 5.x 支持自定义属性），不写死色值——两套主题才都成立。
- **页面级的「少做点什么」不归模板**：去标题、去目录、去白纸这类动皮肤 DOM 的事 TemplateStyles 够不到（它给所有选择器加 `.mw-parser-output` 前缀），由皮肤负责，见[首页 · 页面与皮肤的分工](/patterns/home#页面与皮肤的分工)。
- 类名、状态类、数据属性的约定见[贡献一个组件 · 命名与约定](/guide/contributing#命名与约定)。

## Lua：富文本、稀有度、职业

- gamedata 富文本 `<@ba.vup>x</>` 转成 `<span class="ak-rt-vup">x</span>`；术语 `<$ba.stun>x</>` 转成 `<span class="ak-rt-term" data-ak-tip="说明">x</span>`（也认别名 `.ba-vup` 这类，见[富文本 RichText](/arknights/rich-text)）。
- 稀有度：容器写 `data-rarity="6"`，子元素用 `.ak-r-*` 便捷类或 `var(--ak-r)`（见[稀有度](/arknights/rarity#稀有度色轨)）。职业色：`data-prof="warrior"`（见[职业](/arknights/profession#职业色)）。

## 图标

- 界面线稿图标从皮肤输出的 SVG sprite 取：`<svg class="ak-icon"><use href="#i-search"/></svg>`（图标名见[图标](/foundations/icons)）。现网模板用 MDI 图标名的（<code v-pre>{{Cbox2|mdi=true|icon=…}}</code>），MDI 名 → `i-*` 名的对照表由模板维护，缺的图标往 sprite 里补。
- 游戏图标（职业 / 精英 / 潜能 / 专精 / 稀有度 / 分支 / 势力）用 `File:` 命名空间里的现网文件，模板用 <code v-pre>{{filepath:}}</code> 拼地址；白色线稿类加 `.ak-glyph`（见[图标 · 游戏图标](/foundations/icons#游戏图标)）。

## 表单与交互

- Widget / 模板里直接写裸 `<input>` `<select>` `<button>` 即可，皮肤兜底（表格里自动紧凑、跟随单元格对齐）；要标签 / 帮助 / 错误文案、前后缀拼接、常显 − / + 步进、方舟风的勾选开关，再用 `.ak-field` / `.ak-input-group` / `.ak-number` / `.ak-check` / `.ak-switch`，见[表单控件](/content/forms)。

皮肤脚本（`skin.js`，与预览的 `preview.js` 同一套约定，document 级委托）给纯 CSS 组件补了这几种交互，模板只要写对属性（生产环境也可以挪进 Gadget）：

| 约定 | 作用 |
|---|---|
| `.ak-tabs[data-tabs]` + `.ak-tabpanel[data-tabs]` | 标签页切换 |
| `.ak-panel--collapsible` | 点标题栏折叠 / 展开 |
| `.ak-chip` | 切 `.is-active` / `aria-pressed` |
| `.ak-btn-group` / `.ak-phase-tabs` / `.ak-skill-levels` 的按钮 | 组内单选（切 `.is-active`），派发 `akds:select` 事件 |
| `data-scope` + `data-bind="phase"` + `data-bind-phase='{"e0":…,"e2":…}'` / `data-show-phase="e2"` | 阶段 / 等级切换后，同一作用域里的文字换成对应值、对应块显隐 |
| `input[data-toggle-class][data-toggle-target]` | 勾选时给最近的目标（默认 `table`）加 / 去一个类：天赋表「潜能 / 算法」、模组卡「全文阅读」 |
| `.ak-skill-matrix` | 参数矩阵的列高亮与变量位替换 |
| `[data-ak-tip]` | 补 `aria-describedby`，给不可聚焦的元素补 `tabindex` |
| `[data-dialog-open="#id"]` / `[data-dialog-close]` | 打开 / 关闭 `<dialog class="ak-dialog">` |

不想被这层委托接管的容器（状态由 Vue 管）标 `data-no-toggle`：芯片 `.ak-chip`、折叠面板标题栏、分段按钮组 `.ak-btn-group` / 精英阶段 `.ak-phase-tabs` / 技能等级 `.ak-skill-levels`、语音播放钮 `.ak-voice__play`、技能参数矩阵 `.ak-skill-matrix` 的列高亮，这几处委托都认它（`closest`，标在容器或元素上都行）；Vue 实现里对应的组件（AkChip / AkVoiceList / AkPanel / AkButtonGroup / AkRadioGroup / AkPhaseTabs / AkSkillLevels / AkVoice / AkSkillMatrix）都已自带，prts-widgets 里用不着再标。标签页只接管 `.ak-tabs[data-tabs]`、复选开关只接管 `input[data-toggle-class]`，是 opt-in，Vue 版不写这些属性就不会被碰。

## 现网模板 → 组件

| 现网模板 | 组件 | 说明 |
|---|---|---|
| `Template:Cbox2` | [正文提示框 Cbox](/components/cbox#与现网模板的对应) | `lv=0–4` → 等级；`bg` / `iconcolor` → `--_bg` / `--_c`；MDI 图标 → sprite |
| `Template:道具图标` | [道具 Item](/arknights/item) | 图还是现网的 `道具_带框_<名>.png`，外壳 `.prts-item-quantity-label` → `.ak-item` + `.ak-item__count` |
| `Template:属性` · `Widget:PropertyCalc` | [属性面板 Attrs](/arknights/attrs) + 裸表单控件 + wikitable | |
| `Template:干员攻击范围` · `Widget:Range/*` | [攻击范围 Range](/arknights/range) | |
| `Template:天赋列表3` | [天赋条件表 TalentTable](/arknights/talent-table) | 潜能 / 算法两个开关 |
| `Template:潜能提升` | [潜能提升一览 PotList](/arknights/pot-list) | |
| `Template:技能` | [技能全等级表 SkillSheet](/arknights/skill-sheet) | 或[参数矩阵](/arknights/skill-matrix) |
| `Template:精英化材料` · `Template:技能升级材料` | [材料表 Materials](/arknights/materials) | |
| `Template:模组` | [模组 Module](/arknights/module) | `类型颜色` → `data-color` |
| `Template:人员档案` | [档案 Dossier](/arknights/dossier) + 竖排[标签页](/components/tabs) | |
| `Template:干员密录` · `Template:悖论模拟` | [档案类卡片 Archive](/arknights/archive) | |
| `:干员/语音记录`（VoiceTable） | [语音 Voice](/arknights/voice) | |
| `Template:术语` · `Template:异常效果` | 宽版提示 `.ak-rt-term.ak-tip--wide`（[文字提示](/components/tooltip)） | 弹窗 → 提示 |
| `<tabber>`（TabberNeue） | 皮肤直接换肤，见 [TabberNeue](/content/tabber) | 模板里要切换内容用[标签页 Tabs](/components/tabs) |

干员页整页的逐节对照（含 <code v-pre>{{CharinfoV2}}</code> 的原样复用）见[干员页样例 · 现网模板 → 组件](/patterns/operator#现网模板-→-组件)；组件页头也列着对应的现网模板。
