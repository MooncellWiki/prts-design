import { inject, type InjectionKey, type VNodeChild } from "vue";

/** 颜色：info 主色（默认）· success 绿 · warning 黄 · danger 红（= toast.error） */
export type ToastVariant = "info" | "success" | "warning" | "danger";

/** 正文：字符串，或返回 vnode 的函数（要放链接 / 加粗时） */
export type ToastContent = string | (() => VNodeChild);

/** 单条的选项（同 Naive 的 MessageOptions；不写的跟 AkToastProvider） */
export interface ToastOptions {
  /** 加粗的标题行 */
  title?: string;
  /** 停留时长（ms），0 = 不自动消失 */
  duration?: number;
  /** 显示 ✕ 关闭按钮 */
  closable?: boolean;
  /** 关掉时（到时 / 点 ✕ / destroy）调用 */
  onClose?: () => void;
}

/** 已弹出的一条：destroy() 提前关掉 */
export interface ToastHandle {
  destroy: () => void;
}

/** useToast() 的返回值（同 Naive 的 MessageApi） */
export interface ToastApi {
  create: (content: ToastContent, options?: ToastOptions & { variant?: ToastVariant }) => ToastHandle;
  info: (content: ToastContent, options?: ToastOptions) => ToastHandle;
  success: (content: ToastContent, options?: ToastOptions) => ToastHandle;
  warning: (content: ToastContent, options?: ToastOptions) => ToastHandle;
  error: (content: ToastContent, options?: ToastOptions) => ToastHandle;
  /** 全部关掉 */
  destroyAll: () => void;
}

export const toastKey: InjectionKey<ToastApi> = Symbol("AkToastProvider");

/**
 * 弹轻提示（同 Naive 的 useMessage）：要在 <AkToastProvider> 里面的组件的 setup 里调用。
 *   const toast = useToast();
 *   toast.success("页面已加入监视列表", { title: "完成" });
 */
export function useToast(): ToastApi {
  const api = inject(toastKey, null);
  if (!api) throw new Error("useToast() 要在 <AkToastProvider> 里面的组件中调用");
  return api;
}
