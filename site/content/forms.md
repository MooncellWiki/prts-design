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

- **高度确定**：`border-box` + 上下 0 内边距 + `min-height: 36px`，单行文字由浏览器在盒内垂直居中——正文（行高 1.7）和表格（1.5）里一样高，与 `.ak-btn` / `.ak-input` 同一档。不靠 padding 撑高度。
- **直角**：输入类 2px（`--ak-radius-sm`，系统里唯一允许的小圆角），按钮 0；无阴影、无辉光。
- **宽度不接管**：保留浏览器按 `size` 算的宽度，只加 `max-width: 100%`；要满宽写 `width: 100%`。
- **勾选 / 单选自绘**：18px；勾选框直角，选中 = 主色实底 + 对比色勾；单选是圆（圆是「单选」的通用语义，也是 UI 控件里唯一的圆）。下拉统一画一枚 ▾，与 `.ak-select` 成套。
- 用排除法选中文本类：不写 `type` 的 `<input>`、日期 / 时间 / 电话、未知 type 都按文本框处理。

| 状态 | 表现 |
|---|---|
| 焦点 | 青边 + 3px 淡青环；文本框用 `:focus`（鼠标点进去也亮），勾选 / 单选只在键盘 `:focus-visible` 时亮 |
| 只读 `[readonly]` | 下沉底 `--ak-bg-inset`——计算器里「只显示不编辑」的结果格用它，**不要用 disabled** |
| 禁用 | `--ak-bg-surface-3` 底 + 禁用色 + 禁用光标 |
| 校验失败 | 红边；条件是 `:user-invalid`（用户改过之后才判）或 `aria-invalid="true"`，不用 `:invalid`——那样一进页面必填空框全红 |
| 悬停 | 输入框没有悬停态，按钮才有 |

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

wikitable 一行本身只有 ~35px，36 的控件会把行顶成 50：**单元格里的裸控件自动收到 30px 紧凑档**，字号跟表格；文本类输入的**对齐跟随单元格**——下面居中的计算器里，输入的数字和结果一样居中，`td.num` 右对齐列里的输入也右对齐。一格里「输入 + 按钮」照常并排。

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

给 Widget / 模板作者：直接写 `<input>`，不要写内联样式；列头当标签 `<th><label for="elite">精英等级</label></th>`（点标签能聚焦、读屏器读得到）；结果格用 `readonly` 或纯文本。手机上 wikitable 横向滚动，按 `size` 定宽的控件不会缩，写了 `width:100%` 的随列宽缩。iPhone 上文本类控件在 ≤639 提到 16px——iOS Safari 对更小的输入框聚焦时会把整页放大且不缩回。

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
