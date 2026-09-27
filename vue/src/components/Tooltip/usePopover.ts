import { computed, onBeforeUnmount, watch, type Ref } from "vue";

export type PopoverPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "right";
export type PopoverTrigger = "hover" | "click" | "focus" | "manual";

export interface PopoverBaseProps {
  trigger: PopoverTrigger;
  delay: number;
  duration: number;
  disabled?: boolean;
}

/**
 * AkTooltip / AkPopover 共用的开合逻辑（同 Naive 的 NPopover）：
 * hover = 悬停（delay 后出现、离开 duration 后消失，能移进气泡里）+ 键盘聚焦 · focus = 只看聚焦 · click = 点触发元素开合、点外面关 · manual = 只听 v-model。
 * 任何方式打开的都能按 Esc 关（WAI-ARIA Tooltip）。事件挂在外层 .ak-tip-anchor 上（气泡是它的后代，移进气泡不算离开）。
 */
export function usePopover(props: PopoverBaseProps, model: Ref<boolean | undefined>, anchor: Ref<HTMLElement | null>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const open = computed(() => !!model.value && !props.disabled);

  function set(v: boolean, wait = 0) {
    clearTimeout(timer);
    if (wait > 0) timer = setTimeout(() => (model.value = v), wait);
    else model.value = v;
  }

  const hover = () => props.trigger === "hover";
  const focus = () => props.trigger === "hover" || props.trigger === "focus";

  const anchorOn = {
    mouseenter: () => hover() && set(true, props.delay),
    mouseleave: () => hover() && set(false, props.duration),
    focusin: () => focus() && set(true),
    focusout: (e: FocusEvent) => {
      if (focus() && !anchor.value?.contains(e.relatedTarget as Node | null)) set(false);
    },
    keydown: (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !open.value) return;
      e.preventDefault(); // 在对话框里时别顺带把对话框也关了
      e.stopPropagation();
      // 触发元素是 anchor 的第一个子元素，气泡在它后面：焦点在气泡里时关掉后还给触发元素
      const trigger = anchor.value?.firstElementChild as HTMLElement | null | undefined;
      const inBubble = !trigger?.contains(e.target as Node);
      set(false);
      if (inBubble) trigger?.focus();
    },
  };

  /** 给触发元素：click 模式开合 */
  const onTriggerClick = () => {
    if (props.trigger === "click" && !props.disabled) set(!model.value);
  };

  /** click 模式：点外面关（监听挂在 anchor 所在的文档上——示例在 iframe 里时不是全局 document） */
  function onOutside(e: PointerEvent) {
    if (!anchor.value?.contains(e.target as Node)) set(false);
  }
  let doc: Document | undefined;
  watch(
    () => open.value && props.trigger === "click",
    on => {
      doc?.removeEventListener("pointerdown", onOutside, true);
      doc = on ? anchor.value?.ownerDocument : undefined;
      doc?.addEventListener("pointerdown", onOutside, true);
    },
    { flush: "post" },
  );
  onBeforeUnmount(() => {
    clearTimeout(timer);
    doc?.removeEventListener("pointerdown", onOutside, true);
  });

  return { open, anchorOn, onTriggerClick };
}
