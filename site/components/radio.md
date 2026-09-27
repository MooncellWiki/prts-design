---
title: 单选 Radio
component: radio
---

几个里选一个（同 Naive UI 的 `n-radio-group` + `n-radio` / `n-radio-button`）。`AkRadioGroup` 的 `v-model` 是选中项的 `value`；里面放 `AkRadio` 是一排圆形单选，放 `AkRadioButton` 是连成一排的分段控件。

## 单选组

**圆是单选的通用语义**，也是整套系统里 UI 控件唯一的圆（选中 = 主色实底 + 圆点）。长相与裸 `<input type="radio">` 同一套（[裸控件规则](/content/forms)），组给它们同一个 `name`，方向键在组内移动并选中是浏览器自己的。`vertical` 竖排，`size="sm"` 16px。

@demo Radio/Basic

单独用的 `AkRadio` 与原生写法一样：几个 `<AkRadio v-model="picked" value="…">` 绑同一个变量、写同一个 `name`。

## 单选按钮组

`AkRadioButton` 渲染成 `.ak-btn-group` 里的 `.ak-btn`，选中 `.is-active`（主色实底）：视图切换（列表 / 网格 / 表格）、排序方式这类**立即生效**的多选一。写法同 [按钮](/components/button/)：`icon` 放图标，不写文字就是方形图标按钮（这时 `label` 必填）；`size` 写在组上（30 / 36 / 44）。

它和按钮组长得一样，但语义不同：[按钮组](/components/button/) 是一排各自独立的动作，单选按钮组是一个值。精英阶段切换另有专门的阶段选择器，不用它。

@demo Radio/Buttons

## 键盘

按 [WAI-ARIA Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)：

| 键 | 行为 |
|---|---|
| `Tab` | 进入组时落在选中项上（没有选中项时落在第一个可用项），再按一次离开整组 |
| `→` / `↓` | 下一个并选中（跳过禁用、到头回到第一个） |
| `←` / `↑` | 上一个并选中 |
| `Space` | 选中当前项 |

普通单选这些是浏览器对同名 `<input type="radio">` 的原生行为；单选按钮组由 `AkRadioGroup` 实现（`role="radiogroup"` + 每项 `role="radio"` `aria-checked`，roving tabindex：只有选中项 `tabindex="0"`）。

## Vue API

### AkRadioGroup

<PropsTable of="AkRadioGroup" />

### AkRadio

<PropsTable of="AkRadio" />

### AkRadioButton

<PropsTable of="AkRadioButton" />

## CSS 实现

```html
<div class="ak-check-group" role="radiogroup" aria-label="部署位置">
  <label class="ak-check"><input type="radio" name="pos" checked>近战位</label>
  <label class="ak-check"><input type="radio" name="pos">远程位</label>
</div>
<div class="ak-btn-group" role="radiogroup" aria-label="视图">
  <button type="button" class="ak-btn" role="radio" aria-checked="false" tabindex="-1">列表</button>
  <button type="button" class="ak-btn is-active" role="radio" aria-checked="true" tabindex="0">网格</button>
</div>
```

单选按钮组的 `.ak-btn-group` / `.ak-btn.is-active` 在 `components/button.css`；CSS 实现只有外观，方向键要皮肤脚本或 Vue 组件补。

<CssClasses :files="['components/form.css']" />
