---
title: 数据表 Table
component: table
---

模板 / 小部件输出的数据表：1px 外框、表头 surface-2 底 + 小号大写 + 2px 粗底线、悬停行、数字列右对齐等宽。**编辑在正文里写的表格用 `.wikitable`**（皮肤另有一套，支持竖排行头），不用它。

## 基本

Vue 版是 Naive UI `n-data-table` 的精简版 `AkDataTable`：`columns` 定义列（`key` 取 `row[key]`，`title` 表头，`num` 数字列），`data` 是行，`row-key` 给行标识。`striped` 斑马纹；`row-class-name` 给行加类名，`is-selected` 是淡主色底（当前阶段 / 选中行）。

@demo Table/Basic

## 排序 · 自定义单元格

列写 `sorter: true`（按 `row[key]` 比较：数字比大小、文字按中文排序）或者给比较函数，表头就能点：升序 → 降序 → 原顺序。排序状态是 `v-model`（`{ key, order }`，`order` 取 `aria-sort` 的值 `ascending` / `descending`），当前排序列标 `aria-sort`，箭头由 CSS 画。

单元格要自定义时：SFC 里用 `#cell-<列 key>="{ row, index, value }"` 插槽；也可以给列写 `render(row, index)`（同 Naive）返回 vnode。插槽优先。

@demo Table/Sort

## 紧凑 · 空数据

`compact` 收紧格内边距（4 / 8）。没有数据时整行显示 `#empty` 插槽（默认「暂无数据」）。

@demo Table/Compact

## 可访问性

- 可排序列的表头里是一枚 `<button>`（[WAI-ARIA Sortable Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)）：Tab 可达、Enter / 空格切换；长相就是表头文字本身。`aria-sort` 只标在当前排序的列上。
- 页面上没有标题说明这张表时，用 `label` 给表格一个可访问名。

## Vue API

<PropsTable of="AkDataTable" />

列定义 `DataTableColumn<T>`：

| 字段 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 列标识，也是取值字段（`row[key]`）；`#cell-<key>` 插槽按它找 |
| `title` | `string` | 表头文字 |
| `num` | `boolean` | 数字列：右对齐 + 等宽数字（`.num`） |
| `sorter` | `boolean \| (a, b) => number` | 可排序：`true` 按 `row[key]` 比较，或给升序时的比较函数 |
| `render` | `(row, index) => VNodeChild` | 自定义单元格（同 Naive） |
| `className` | `string` | 这一列 `th` / `td` 的额外类名 |

## CSS 实现

不需要排序时直接写 `<table class="ak-table">` 就行（Vue SFC 里也可以，不必用 `AkDataTable`）：`.ak-table--striped` 斑马纹、`.ak-table--compact` 紧凑、`th` / `td` 加 `.num` 是数字列、行加 `.is-selected` 高亮。`th[aria-sort="ascending|descending"]` 画 ↑ / ↓——模板输出静态排好序的表时照样可以标。

```html demo
<table class="ak-table ak-table--striped">
  <thead>
    <tr><th aria-sort="descending">阶段</th><th>等级上限</th><th class="num">生命</th><th class="num">攻击</th><th class="num">防御</th></tr>
  </thead>
  <tbody>
    <tr><td>精英零</td><td>50</td><td class="num">1684</td><td class="num">361</td><td class="num">221</td></tr>
    <tr class="is-selected"><td>精英一</td><td>80</td><td class="num">2188</td><td class="num">469</td><td class="num">288</td></tr>
    <tr><td>精英二</td><td>90</td><td class="num">2880</td><td class="num">610</td><td class="num">352</td></tr>
  </tbody>
</table>
```

<CssClasses :files="['components/table.css']" />
