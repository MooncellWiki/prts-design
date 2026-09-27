# 图标

两类图标：

- **界面线稿图标**（下面这套，24×24，`currentColor`）：页眉、动作簇、菜单、按钮里的图标。皮肤页面里是 SVG sprite `<svg><use href="#i-search"/></svg>`；Vue 里是 `<AkIcon name="search" />`，内联渲染不依赖 sprite。
- **游戏图标**（职业 / 精英 / 潜能 / 专精 / 势力 …）：torappu 解包的白色线稿 png，亮色下由 [`.ak-glyph`](/foundations/decoration#白色线稿图标-ak-glyph) 反相。

点击复制图标名。

<IconGrid />

## 用法

```vue
<AkIcon name="search" :size="18" />                <!-- 装饰性：aria-hidden -->
<AkIcon name="warn" label="注意" />                 <!-- 有含义：role="img" + aria-label -->
<AkButton icon="more" label="更多" />               <!-- 只有图标的按钮：label 必填 -->
```
