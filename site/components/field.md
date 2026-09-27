---
title: 表单字段 Field
component: field
---

一个表单项 = 标签 + 控件 + 说明 / 校验文案（同 Naive UI 的 `n-form-item`）。表单组件（`.ak-input` `.ak-select` `.ak-check` …）与 Widget / Gadget 直接吐出的裸控件是**同一套规则**：36px 定高、2px 角、同一枚 ▾、同一张勾选框 / 圆形单选——裸控件的样子见 [MediaWiki 内容样式 · 表单控件](/content/forms)。

各控件：[输入框](/components/input) · [数字输入](/components/input-number) · [下拉选择](/components/select) · [复选框](/components/checkbox) · [单选](/components/radio) · [开关](/components/switch) · [滑杆](/components/slider) · [搜索框](/components/search) · [键帽](/components/kbd)。

## 标签 · 必填 · 说明

`label` 渲染成 `<label for>`，指向字段里的第一个控件——控件的 id 由字段生成，不用自己写。`required` 在标签后出红色 `*`（读屏不念，控件自己带 `required`）。`feedback` 是标签下面那行小字，经 `aria-describedby` 关联到控件。

@demo Field/Basic

## 校验状态

`validation-status="error"`：字段加 `.is-invalid`、控件红边 + `aria-invalid`、文案变红字；`success`：输入框绿边。原生的 `:user-invalid`（`required` 空着、`maxlength` 超了……）也是红边，只在用户改过之后才判，不会一进页面满屏红。

@demo Field/Validation

## 各种控件

一组复选框 / 单选没有单个可以 `for` 的控件：字段的标签改由组 `aria-labelledby` 指向（`role="group"` / `radiogroup`），标签不写 `for`。步进器、开关这类定宽控件在字段里不拉满一行。

@demo Field/Controls

## 可访问性

| 关系 | 输出 |
|---|---|
| 标签 → 控件 | `<label for="…-control">` + 控件 `id`（AkInput / AkSelect / AkInputNumber / AkSwitch / AkSlider / AkSearch / 单个 AkCheckbox） |
| 标签 → 组 | 组 `aria-labelledby="…-label"`（AkCheckboxGroup / AkRadioGroup），标签不写 `for` |
| 说明 / 错误 → 控件 | `aria-describedby="…-help"` |
| 出错 | 控件 `aria-invalid="true"`；文字说清楚怎么改（「应为 1-7、CE-6 这样」），不要只写「格式错误」 |
| 必填 | 文本类控件 `required`、单选组 `aria-required`；标签里的 `*` `aria-hidden` |

字段里自己写的原生控件，用默认插槽的参数拿 id：`<AkField label="…" v-slot="{ id }"><input :id="id"></AkField>`。

## Vue API

<PropsTable of="AkField" />

## CSS 实现

模板 / Lua 输出：

```html
<div class="ak-field is-invalid">
  <label class="ak-label" for="stage">关卡编号 <span class="req">*</span></label>
  <input class="ak-input" id="stage" aria-describedby="stage-help" aria-invalid="true">
  <div class="ak-help ak-help--error" id="stage-help">格式不正确</div>
</div>
```

`.ak-check-group`（一组勾选 / 单选的横排容器）、各尺寸档、禁用态等也在同一个文件里。

<CssClasses :files="['components/form.css']" />
