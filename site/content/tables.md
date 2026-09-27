<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 表格

`base/tables.css`：`{| class="wikitable"` 是 PRTS 用得最多的结构——干员一览、属性、材料、掉落，几乎每页都有。表格是数据，不是装饰：浅底表头、1px 细线、悬停行变浅，数字列右对齐。

## wikitable

表头 `th` 浅一档的底、加粗居中；单元格 1px `--ak-border` 细线；悬停行 `--ak-bg-hover`。可排序表（`sortable` → jquery.tablesorter）的表头右侧是 `⇅`，当前排序列换成青色 `↑` / `↓`。

```html demo
<div class="ak-table-scroll"><table class="wikitable jquery-tablesorter ak-striped" style="width:100%">
<tr><th class="headerSort">干员</th><th class="headerSort headerSortDown">稀有度</th><th>职业</th><th class="headerSort">生命</th><th class="headerSort">攻击</th><th class="headerSort">防御</th><th>阵营</th></tr>
<tr><td><a class="ak-op-row" href="#"><span class="ak-avatar" data-rarity="6"><img src="assets/avatar/char_010_chen_2.png" alt=""></span><span><span class="ak-op-row__name">陈</span><span class="ak-op-row__meta">剑豪 · LM04</span></span></a></td><td><span class="ak-rarity ak-rarity--r6"><i></i><i></i><i></i><i></i><i></i><i></i></span></td><td><span class="ak-prof-label"><span class="ak-prof ak-prof--sm"><img src="assets/profession/warrior.png" alt=""></span>近卫</span></td><td class="num">2880</td><td class="num">610</td><td class="num">352</td><td>龙门近卫局</td></tr>
<tr><td><a class="ak-op-row" href="#"><span class="ak-avatar" data-rarity="6"><img src="assets/avatar/char_172_svrash_2.png" alt=""></span><span><span class="ak-op-row__name">银灰</span><span class="ak-op-row__meta">领主 · KJ01</span></span></a></td><td><span class="ak-rarity ak-rarity--r6"><i></i><i></i><i></i><i></i><i></i><i></i></span></td><td><span class="ak-prof-label"><span class="ak-prof ak-prof--sm"><img src="assets/profession/warrior.png" alt=""></span>近卫</span></td><td class="num">2880</td><td class="num">660</td><td class="num">352</td><td>喀兰贸易</td></tr>
<tr><td><a class="ak-op-row" href="#"><span class="ak-avatar" data-rarity="5"><img src="assets/avatar/char_102_texas_2.png" alt=""></span><span><span class="ak-op-row__name">德克萨斯</span><span class="ak-op-row__meta">尖兵 · PL03</span></span></a></td><td><span class="ak-rarity ak-rarity--r5"><i></i><i></i><i></i><i></i><i></i></span></td><td><span class="ak-prof-label"><span class="ak-prof ak-prof--sm"><img src="assets/profession/pioneer.png" alt=""></span>先锋</span></td><td class="num">2050</td><td class="num">545</td><td class="num">371</td><td>企鹅物流</td></tr>
<tr><td><a class="ak-op-row" href="#"><span class="ak-avatar" data-rarity="4"><img src="assets/avatar/char_151_myrtle_2.png" alt=""></span><span><span class="ak-op-row__name">桃金娘</span><span class="ak-op-row__meta">执旗手 · PL33</span></span></a></td><td><span class="ak-rarity ak-rarity--r4"><i></i><i></i><i></i><i></i></span></td><td><span class="ak-prof-label"><span class="ak-prof ak-prof--sm"><img src="assets/profession/pioneer.png" alt=""></span>先锋</span></td><td class="num">1583</td><td class="num">386</td><td class="num">223</td><td>—</td></tr>
</table></div>
```

单元格里的干员行、稀有度、职业是方舟组件（[干员行](/arknights/op-row)、[稀有度](/arknights/rarity)、[职业](/arknights/profession)），表格本身只管线与底。

## th 当行头

PRTS 大量表格把 `th` 竖着当行头用（属性表 / 信息表）。加粗的 2px 底线只压在「整行都是 `th`、且下一行是数据行」的真正表头行下面（多行表头只压最后一行）；行头列每格只有普通 1px 线，与右侧 `td` 对齐，不会一格一道。靠 `:has()` 判断，不支持的浏览器退化为一律 1px，只靠底色区分。

```html demo
<div class="ak-flex-col ak-gap-4">
<table class="wikitable ak-mb-0" style="width:100%">
<tr><th style="width:28%">再部署时间</th><td>70s</td><th style="width:28%">初始部署费用</th><td>16→18</td></tr>
<tr><th>阻挡数</th><td>2</td><th>攻击间隔</th><td>1.5s</td></tr>
<tr><th>所属势力</th><td colspan="3"><a href="#">罗德岛</a></td></tr>
<tr><th>隐藏势力</th><td colspan="3"><a href="#">叙拉古</a></td></tr>
</table>
<table class="wikitable ak-mb-0" style="width:100%">
<tr><th></th><th>精英0 1级</th><th>精英0 满级</th><th>精英1 满级</th><th>精英2 满级</th></tr>
<tr><th>生命上限</th><td class="num">1001</td><td class="num">1431</td><td class="num">1884</td><td class="num">2385</td></tr>
<tr><th>攻击</th><td class="num">333</td><td class="num">477</td><td class="num">628</td><td class="num">796</td></tr>
<tr><th>防御</th><td class="num">217</td><td class="num">311</td><td class="num">410</td><td class="num">520</td></tr>
<tr><th>法术抗性</th><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">0</td></tr>
</table>
</div>
```

## 数字列

`td.num`（或格子里的 `.num`）右对齐 + `tabular-nums`。**表格数字一律用正文字体**：思源的数字默认等宽，列天然对齐；Bender 的数字是比例宽度、子集不带 `tnum`，小字号又细，对不齐。HUD 数字类（`.ak-num` 等）掉进表格也会被 `arknights/table-numerals.css` 兜回正文字体（见[字体排印 · Bender 的使用边界](/foundations/typography#bender-的使用边界)）。

## 修饰类

写在 `class="wikitable …"` 里，可以叠加：

| 类 | 作用 |
|---|---|
| `ak-striped` | 斑马纹（偶数行浅底） |
| `ak-compact` | 紧凑内边距（`.25em .5em`），信息密的对照表用 |
| `ak-dense` | 12px 字号 |
| `ak-borderless` | 去掉竖线，只留横线 |
| `ak-sticky-head` | 首行表头吸顶（停在页眉下沿） |
| `th.ak-th-accent` | 表头顶部 3px 青条（画在格子里：collapse 表格里 `border-image` 无效，3px 的 `border-top` 又会和 1px 竖线斜接） |

```html demo
<table class="wikitable ak-compact ak-borderless" style="width:100%">
<tr><th class="ak-th-accent">材料</th><th class="ak-th-accent">精英 1</th><th class="ak-th-accent">精英 2</th></tr>
<tr><td>龙门币</td><td class="num">30,000</td><td class="num">180,000</td></tr>
<tr><td>近卫芯片</td><td class="num">5</td><td class="num">—</td></tr>
<tr><td>近卫双芯片</td><td class="num">—</td><td class="num">4</td></tr>
</table>
```

宽表外面包一层 `<div class="ak-table-scroll">` 横向滚动；手机（≤639）上所有 `wikitable` 都会自动变成可横滚的块（规则在[皮肤骨架 · 响应式](/chrome/responsive)）。

## 其它表格

Cargo 查询结果 `.cargoTable`、核心特殊页面的 `table.mw-datatable` 用同一套线与表头底。`.wikitable` 自己也写了 `border-collapse`：`Special:Version` 这类核心 PHP 生成的 wikitable 不在 `.mw-parser-output` 里，不写的话会退回 `separate`，每格变成一个个带 2px 缝的小框。

落进表格的裸 `<input>` / `<select>`（属性计算器、筛选栏）自动收到 30px 紧凑档，见[表单控件](/content/forms#落进表格)。

## CSS

<CssSelectors :files="['base/tables.css']" />
