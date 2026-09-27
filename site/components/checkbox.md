---
title: 复选框 Checkbox
component: checkbox
---

18px 直角勾选框，选中 = 主色实底 + 对比色勾（同 Naive UI 的 `n-checkbox`）。长相由 [裸控件规则](/content/forms) 给——裸 `<input type="checkbox">` 与这里是同一张脸，`.ak-check` 只负责「框 + 文字」的排布，点文字也能勾。

## 基本

单独用时 `v-model` 是布尔值。禁用时框变灰、文字降到禁用色；`size="sm"` 是 16px 的框（表头里的开关，如天赋表的「潜能」）。

@demo Checkbox/Basic

## 复选组

`AkCheckboxGroup`（同 Naive 的 `n-checkbox-group`）的 `v-model` 是勾上的 `value` 数组，组里的 `AkCheckbox` 各写 `value`。`max` 选满后没勾的变成禁用——公开招募一次刷 5 个标签、最多选 3 个。组是 `role="group"`，放在[表单字段](/components/field)里时字段的标签就是组名。

@demo Checkbox/Group

## 半选

「全选」框在部分子项勾上时写 `indeterminate`：框里一横，读屏念「部分选中」。它只管外观，点击照常切换 `v-model`——由你决定点了之后全选还是全不选。

@demo Checkbox/Indeterminate

## 可访问性

- 原生 `<input type="checkbox">` 包在 `<label>` 里：`Space` 切换，点文字也能勾，读屏念「文字，复选框，已勾选」。
- 没有文字的勾选框（表头里只放一枚图标）要写 `label`，否则只念「复选框」；开发时漏写会在控制台警告。
- 焦点只在键盘操作时亮（`:focus-visible`）：青边 + 淡青环。

## Vue API

### AkCheckbox

<PropsTable of="AkCheckbox" />

### AkCheckboxGroup

<PropsTable of="AkCheckboxGroup" />

## CSS 实现

```html
<div class="ak-check-group" role="group" aria-label="获得方式">
  <label class="ak-check"><input type="checkbox" checked>公开招募</label>
  <label class="ak-check is-disabled"><input type="checkbox" disabled>限定寻访</label>
</div>
```

<CssClasses :files="['components/form.css']" />
