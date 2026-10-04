import { computed, inject, onBeforeUnmount, provide, useAttrs, type InjectionKey } from "vue";

/** 校验状态（同 Naive 的 FormValidationStatus，只有 CSS 画得出来的两种） */
export type ValidationStatus = "error" | "success";

/** AkField 给字段里控件的状态（响应式对象） */
export interface FieldContext {
  /** 控件 id：<label for> 指向它 */
  readonly id: string;
  readonly labelId: string;
  readonly helpId: string;
  readonly hasLabel: boolean;
  readonly hasHelp: boolean;
  readonly status: ValidationStatus | undefined;
  readonly required: boolean;
  /** 谁占着标签：第一个挂上来的控件（label for 指向它）· 组（复选组 / 单选组：label 不写 for，组用 aria-labelledby）· null 还没有 */
  owner: "control" | "group" | null;
}

export const fieldKey: InjectionKey<FieldContext | null> = Symbol("AkField");

/**
 * 控件接入 AkField（同 Naive 表单项与控件之间的 formItem 注入）：返回要绑到原生控件上的 id / aria-labelledby / aria-describedby，
 * 以及字段的校验状态、必填。不在字段里时 attrs 为空。
 * 一个字段只有第一个控件拿 id；kind = "group" 的复选组 / 单选组改用 aria-labelledby，并把组里的选项与字段隔开（它们不再各自认字段）。
 */
export function useField(kind: "control" | "group" = "control") {
  const field = inject(fieldKey, null);
  const own = !!field && field.owner === null;
  if (own) field!.owner = kind;
  onBeforeUnmount(() => {
    if (own) field!.owner = null;
  });
  if (kind === "group") provide(fieldKey, null);

  const attrs = computed(() =>
    field
      ? {
          id: own && kind === "control" ? field.id : undefined,
          "aria-labelledby": own && kind === "group" && field.hasLabel ? field.labelId : undefined,
          "aria-describedby": field.hasHelp ? field.helpId : undefined,
        }
      : {},
  );
  return {
    attrs,
    status: computed(() => field?.status),
    required: computed(() => own && !!field?.required),
  };
}

/**
 * 外面包了一层 <label> / <div> 的控件（勾选、单选、开关、步进器、搜索框）：class / style 给外层，其余属性（name、autocomplete、@focus …）给原生控件。
 * data-ak-tip 也给外层：气泡是载体的 ::after，原生 <input> 上画不出来；挂在外层，悬停名称文字也出提示，聚焦里面的控件时由 :has(:focus-visible) 显示。
 * 这样不用为了提示再包一层 <span>——行内的 span 里控件按基线排，在 align-items: center 的一行里会比旁边没包的同类高几像素。
 * 配合 defineOptions({ inheritAttrs: false })。
 */
export function useSplitAttrs() {
  const attrs = useAttrs();
  return {
    root: computed(() => ({ class: attrs.class, style: attrs.style, "data-ak-tip": attrs["data-ak-tip"] })),
    control: computed(() => {
      const { class: _c, style: _s, "data-ak-tip": _t, ...rest } = attrs;
      return rest;
    }),
  };
}
