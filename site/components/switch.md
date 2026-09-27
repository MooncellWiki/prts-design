---
title: 开关 Switch
component: switch
---

方形开关（同 Naive UI 的 `n-switch`）：40 × 22 的直角轨道，开 = 游戏内 `toggle_on` 蓝 `#0075A9`、白色方块滑到右边。给**立即生效**的二元设置（显示潜能加成、信赖满）；要提交后才生效的选项用[复选框](/components/checkbox)。

## 基本

`v-model` 是布尔值，默认插槽是开关的名称。`size="sm"` 是 32 × 18（标题栏旁、表头里，= 首页「演示：特别开放周」那枚）。禁用时轨道半透明、文字降到禁用色。

@demo Switch/Basic

## 状态文字

`#checked` / `#unchecked`（同 Naive）是名称后面、随开关变化的状态文字。**名称不随状态变**（它是可访问名），状态文字只给眼睛看（`aria-hidden`）——读屏已经会念「开 / 关」。没有名称文字时写 `label`，或放在[表单字段](/components/field)里用字段的标签。

@demo Switch/StateText

## 可访问性

- 原生 `<input type="checkbox" role="switch">` 包在 `<label>` 里：`Space` 切换，读屏念「名称，开关，开」。
- 焦点只在键盘操作时亮：轨道外一圈淡青环。

## Vue API

<PropsTable of="AkSwitch" />

## CSS 实现

```html
<label class="ak-switch"><input type="checkbox" role="switch" checked>显示潜能加成</label>
<label class="ak-switch ak-switch--sm"><input type="checkbox" role="switch"><span>演示：特别开放周</span></label>
```

轨道与滑块尺寸由私有变量 `--_w` / `--_h` 定，`--sm` 就是改了这两个。

<CssClasses :files="['components/form.css']" />
