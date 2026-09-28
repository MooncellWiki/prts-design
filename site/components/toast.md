---
title: 轻提示 Toast
component: toast
---

操作之后在视口右下角弹出的一句反馈——「页面已加入监视列表」「保存失败：会话过期」——几秒后自己消失，底部 2px 进度条走完即关。白底卡片、左侧 4px 等级色条、投影，从下方滑入；多条从下往上叠。与 [消息 Message](/components/message) 同族：Message 留在页面里，Toast 是浮层、会消失。

**只放无关紧要、错过也不要紧的反馈**：需要读者处理的错误（表单校验、权限不足）用 Message 或对话框。

## 用法

同 Naive UI 的 `useMessage()` + `n-message-provider`：应用 / 小部件的最外层包一个 `AkToastProvider`，里面任意组件 `useToast()` 拿到 API：

```vue
<!-- App.vue -->
<AkToastProvider>
  <RouterView />
</AkToastProvider>
```

```ts
// 任意子组件
import { useToast } from "@mooncellwiki/prts-design-vue";

const toast = useToast();
toast.success("页面已加入监视列表", { title: "完成" });
toast.error("保存失败：会话过期");
```

`info`（主色）· `success` · `warning` · `error`（红，= `.ak-toast--danger`）四个方法，也可以 `create(内容, { variant })`；都返回 `{ destroy() }`。`destroyAll()` 全部关掉。

@demo Toast/Variants

## 选项

单条选项：`title` 标题行 · `duration` 停留毫秒（`0` 常驻）· `closable` ✕ 按钮 · `onClose` 关掉时回调；正文可以是函数（返回 vnode，放链接 / 加粗）。不写的跟 `AkToastProvider` 的 `duration`（默认 5000）/ `closable`（默认有）。`max` 限制同时显示的条数，多了先关最早的。也可以拿 provider 的 `ref` 直接调——方法和 `useToast()` 一样。

@demo Toast/Options

## 可访问性

- 提示栈是一个 `role="region"`（名字「通知」，`label` 可改）+ `aria-live="polite"` 的区域，一直在页面上：新弹出的提示读屏会念，但不打断当前朗读。
- **悬停或键盘聚焦在某条上时暂停它的倒计时**（进度条一起停，`keep-alive-on-hover`，默认开），移开后接着走——给读得慢的人留时间（WCAG 2.2.1）。
- 常驻的（`duration: 0`）一定要留 ✕。

## Vue API

<PropsTable of="AkToastProvider" />

`useToast()` 返回 `ToastApi`：`create / info / success / warning / error(内容, 选项?) => { destroy }` 与 `destroyAll()`；类型 `ToastApi` / `ToastOptions` / `ToastVariant` 从 `@mooncellwiki/prts-design-vue` 导出。

## CSS 实现

`div.ak-toasts`（fixed 右下）> `div.ak-toast(.ak-toast--success …)` > `div.ak-toast__body( .ak-toast__title + 正文 )` + 关闭按钮（借 `.ak-message__close`）+ `i.ak-toast__progress`。进度条时长读 `--_dur`（默认 5s），`.is-paused` 暂停。无 Vue 的页面由 Gadget 按这个结构插（预览站 `preview.js` 的 `akdsToast()` 就是）。

<CssClasses :files="['components/toast.css']" />
