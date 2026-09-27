<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 表单控件

`base/forms.css`：wiki 里的表单来自三处，皮肤对它们的态度不同——

| 来源 | 例子 | 谁负责 |
|---|---|---|
| **裸控件**：Widget / Gadget / 模板直接吐出、身上没有任何 class 的 `<input>` `<select>` `<textarea>` `<button>` | 干员页「属性计算器」（`Widget:PropertyCalc`：wikitable 里四个 `<input type="number">`）、公招 / 材料计算器、筛选栏、edittools 字符按钮 | **皮肤兜底**（本页） |
| **设计系统组件** `.ak-input` `.ak-select` `.ak-check` `.ak-switch` … | 模板 / TemplateStyles 里显式使用 | [输入框](/components/input) · [下拉选择](/components/select) · [复选框](/components/checkbox) · [单选](/components/radio) · [开关](/components/switch) · [表单字段](/components/field) …：与裸控件同一套尺寸 / 颜色 / 状态，多了尺寸变体、开关、校验文案 |
| **核心 UI**：Codex `.cdx-*` / OOUI `.oo-ui-*` / `.mw-ui-*` | 编辑页、参数设置、特殊页面、Echo | 颜色经令牌桥接自动跟随，**尺寸不改**（它们成组出现、内部自洽） |

裸控件的正确写法就是**什么都别写**：`<input type="number">` 落进 wikitable 就该是对的。皮肤的规则全部包在 `:where()` 里（特指度 0），`.ak-input`、Codex / OOUI、模板自己的 class 都稳稳压在它上面，不必和 `input[type=…]` 较劲。

## 裸控件

- **高度三档 30 / 36 / 44**，与 `.ak-btn` / `.ak-input` 同一刻度（`--sm` / 默认 / `--lg`）。裸控件默认 **36**：裸 `<input>`、`.ak-input`、`.ak-btn`、裸 `<button>` 都是 36，一行里混排齐平；落进表格单元格自动收到 30（见[落进表格](#落进表格)）。
- **高度是确定的**：`box-sizing: border-box` + 上下 0 内边距 + `min-height` 定高，单行文字由浏览器在盒内垂直居中，所以正文（行高 1.7）和表格（1.5）里一样高。**不靠 padding 撑高度**——以前 content-box 下「`min-height` 34 + 上下 6px + 边框」= 48px，就是属性计算器那种比表头还高一截的输入框。
- **直角**：输入类 2px（`--ak-radius-sm`，系统里唯一允许的小圆角），按钮 0；边框 1px `--ak-border-strong`；无阴影、无内阴影、无辉光。
- **内边距与字**：`0 10px`（表格里 `0 8px`）；`textarea` 为 `8px 10px`、最小高 72px、只允许竖向拖拽。字 14px（`--ak-fs-sm`）正文字体、常规字重（在 `th` 里也不加粗）、行高 1.5；数字输入 `tabular-nums`，改值时不跳。iPhone 上文本类控件在 ≤639 提到 16px——iOS Safari 对更小的输入框聚焦时会把整页放大且不缩回。
- **宽度不接管**：保留浏览器按 `size` 算的宽度（约 20 字符），只加 `max-width: 100%` 保证不撑破容器——一格里常常是「输入框 + 按钮」，强制满宽会把按钮挤到下一行。要满宽写 `width: 100%`（已是 border-box，不必再 `calc(100% - .8em)`）；要窄写 `size="4"` 或 `style="width:5em"`。
- **用排除法选中文本类**：不写 `type` 的 `<input>`、日期 / 时间 / 电话等、未知 type 都按文本框处理，不留浏览器 2px inset 的默认外观。

颜色全部取语义令牌，两套主题各自成立，不写死色值：

| 状态 | 表现 |
|---|---|
| 默认 | 底 `--ak-bg-surface`、字 `--ak-fg`、边 `--ak-border-strong` |
| 占位符 | `--ak-fg-subtle`（Firefox 默认的 `opacity` 归 1）；只做提示，不承载必填等信息 |
| 悬停 | 输入框**没有**悬停态，按钮才有 |
| 焦点 | 边 `--ak-accent` + `--ak-shadow-accent`（3px 淡青环，同 `.ak-input`）；文本框用 `:focus`（鼠标点进去也亮），勾选 / 单选只在键盘 `:focus-visible` 时亮同一套；滑杆保留全局的 `:focus-visible` 2px 描边 |
| 只读 `[readonly]` | 下沉底 `--ak-bg-inset`，边框不变、仍可选中复制——计算器里「只显示不编辑」的结果格用它，**不要用 disabled 表示「只是显示」** |
| 禁用 `:disabled` | 底 `--ak-bg-surface-3`、字 `--ak-fg-disabled`（Safari 要同时写 `-webkit-text-fill-color`）、边 `--ak-border`、`cursor: not-allowed` |
| 校验失败 | 边 `--ak-danger`，聚焦时环换成 `--ak-danger-bg`。条件是 `:user-invalid`（用户改过之后才判）或 `aria-invalid="true"`；不用 `:invalid`——那样一进页面必填空框全红。设计系统组件另有 `.is-invalid` / `.is-valid` 与 `.ak-help--error` 文案（见[表单字段](/components/field)） |

各类控件：

| 控件 | 做法 |
|---|---|
| 勾选 / 单选 | **自绘，裸控件与 `.ak-check` 同一张脸**（`appearance: none`；`.ak-check` 只管「控件 + 文字」的排布）：18px、2px `--ak-border-strong` 边；勾选框直角，选中 = 主色实底 + 对比色勾（`:indeterminate` = 一横）；**单选是圆**（圆是单选的通用语义，也是表单控件里唯一的圆；不做菱形、不做圆角方），选中 = 主色实底 + 圆点。勾 / 点按百分比画，改 `width` / `height` 整体缩放（表头里的开关 16px）。禁用 = surface-3 底 / 选中灰。`accent-color` 仍写着兜底：不认 `appearance: none` 的老 WebView 退回主色的原生控件。`vertical-align: middle`，与行内文字中线对齐 |
| 下拉 `select` | 自绘箭头：裸 `<select>` 与 `.ak-select` 同一枚 ▾（`--ak-select-arrow`：两条 45° 渐变拼成，颜色随 `--ak-fg-muted`，与下拉按钮的 ▾ 成套），`appearance: none` + 右内边距 30px（表格里 26px）——各浏览器的原生箭头长得不一样。`select[multiple]` 不画箭头、上下 4px 内边距 |
| 数字 `type=number` | `tabular-nums`；保留原生 ▲▼ 步进器（Chrome 悬停 / 聚焦时才现身，Firefox 常显）；要一直看得见的 − / + 用[数字输入](/components/input-number) `.ak-number` |
| 滑杆 `type=range` | 保留原生，只上 `accent-color`；要方形滑块用[滑杆](/components/slider) `.ak-slider` |
| 按钮 `button`、`input` 的 `button` / `submit` / `reset` | 同 `.ak-btn` 默认外观（36px、直角、1px 边、悬停浅底）；不设 `min-height`——带 class 的定尺寸按钮不会被撑高 |

```html demo
<div class="ak-flex ak-gap-3 ak-wrap ak-items-center">
  <input type="text" placeholder="干员名 / 代号" size="14">
  <input type="number" value="90" min="1" max="90" style="width:6em">
  <select><option>近卫</option><option>先锋</option><option>狙击</option></select>
  <button type="button">搜索</button>
</div>
<div class="ak-flex ak-gap-3 ak-wrap ak-items-center ak-mt-3">
  <label><input type="checkbox" checked> 可公招</label>
  <label><input type="checkbox"> 限定</label>
  <label><input type="radio" name="demo-r1" checked> 精英二</label>
  <label><input type="radio" name="demo-r1"> 精英一</label>
  <input type="range" min="1" max="90" value="60">
</div>
<div class="ak-flex ak-gap-3 ak-wrap ak-items-center ak-mt-3">
  <input type="text" value="只读" readonly size="6">
  <input type="text" value="禁用" disabled size="6">
  <input type="text" value="???" aria-invalid="true" size="6">
  <button type="button" disabled>禁用按钮</button>
</div>
<textarea class="ak-mt-3" placeholder="备注…" style="width:100%"></textarea>
```

## 落进表格

wikitable 一行本身只有 ~35px，36 的控件会把行顶成 50：**单元格里的裸控件自动收到 30px 紧凑档**（裸 `<button>` 同样），字号跟表格——30 正好比表头行高一点，读得出「这一行是输入」又不抢戏；表格里想要 36 就显式用 `.ak-input`。文本类输入的**对齐跟随单元格**（`text-align: inherit`）——下面居中的计算器里，输入的数字和结果一样居中，`td.num` 右对齐列里的输入也右对齐；`select` 不跟。一格里「输入 + 按钮」照常并排。

```html demo
<div class="ak-flex-col ak-gap-4">
<table class="wikitable ak-mb-0" style="width:100%;text-align:center">
<tr><th colspan="4">属性计算器</th></tr>
<tr><th><label for="demo-elite">精英等级</label></th><th><label for="demo-level">等级</label></th><th><label for="demo-trust">信赖</label></th><th><label for="demo-potential">潜能</label></th></tr>
<tr><td><input id="demo-elite" type="number" value="2" min="0" max="2" style="width:100%"></td><td><input id="demo-level" type="number" value="90" min="1" max="90" style="width:100%"></td><td><input id="demo-trust" type="number" value="100" min="0" max="100" style="width:100%"></td><td><input id="demo-potential" type="number" value="1" min="1" max="6" style="width:100%"></td></tr>
<tr><th>生命上限</th><th>攻击</th><th>防御</th><th>法术抗性</th></tr>
<tr><td>2880</td><td>660</td><td>402</td><td>0</td></tr>
</table>
<table class="wikitable ak-mb-0" style="width:100%">
<tr><th style="width:22%">筛选</th><td><input type="text" placeholder="干员名 / 代号" size="12"> <button type="button">搜索</button></td></tr>
<tr><th>职业</th><td><select><option>全部</option><option>近卫</option><option>先锋</option></select> <label><input type="checkbox" checked> 限定</label> <label><input type="radio" name="demo-r" checked> 精二</label> <label><input type="radio" name="demo-r"> 满级</label></td></tr>
<tr><th>数值列</th><td class="num"><input type="number" value="2880" min="0" style="width:8em"> <input type="number" value="660" readonly style="width:6em"></td></tr>
<tr><th>状态</th><td><input type="text" value="disabled" disabled size="9"> <input type="text" value="???" aria-invalid="true" size="6"> <input type="date"></td></tr>
</table>
</div>
```

### 给 Widget / 模板作者

- 直接写 `<input>`，不要写内联样式——高度 / 对齐 / 颜色 / 主题都会自己对；宽度要满就 `width:100%`。
- 列头当标签：`<th><label for="elite">精英等级</label></th>` + `<td><input id="elite">`（`Widget:PropertyCalc` 已经这么写），点标签能聚焦、读屏器读得到；不方便放 label 的加 `aria-label`。
- 结果格用 `readonly` 输入或直接写文本，不用 `disabled`。
- 一行里要拼「前缀 / 输入 / 按钮」用[输入组](/components/input) `.ak-input-group`；带标签 + 帮助 + 错误文案的用[表单字段](/components/field) `.ak-field`；步进用 `.ak-number`。
- 手机（≤639）上 wikitable 横向滚动，按 `size` 定宽的控件不会缩；写了 `width:100%` 的随列宽缩（属性计算器原来写的 `calc(100% - .8em)` 就是这么活下来的，现在直接 `100%` 更好）。Widget 里针对旧皮肤的样式补丁（`.skin-minerva #calc input { border… }` 这类）可以删掉，只留 `width:100%` 这类布局意图。

## 核心按钮与编辑器

`.mw-ui-button` / `.cdx-button` 拉回皮肤的按钮配色（核心的 `.cdx-button:enabled` 取 `--ak-bg-surface-2`，会和同色的面板撞成一片，历史页的「对比选择的版本」就是这么被吞掉的）；progressive = 主色实底，destructive = 危险色实底。OOUI 的窗口 / 面板 / 弹层、WikiEditor 工具栏、CodeMirror 只换色；编辑框 `#wpTextbox1` 用等宽字、满宽（只给编辑框，不给整个表单——摘要框和版权声明不该变等宽）。

```html demo
<div class="ak-flex ak-gap-3 ak-wrap ak-items-center">
  <button type="button" class="cdx-button">预览</button>
  <button type="button" class="cdx-button cdx-button--action-progressive cdx-button--weight-primary">保存更改</button>
  <button type="button" class="mw-ui-button mw-ui-progressive">提交</button>
  <button type="button" class="mw-ui-button mw-ui-destructive">删除</button>
</div>
```

## CSS

<CssSelectors :files="['base/forms.css']" />
