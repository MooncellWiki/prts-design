import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";

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

/** 气泡与触发元素的间距（components/tooltip.css 的 6px）· 离视口边缘至少留的距离（同纯 CSS 版的 [data-ak-tip]） */
const GAP = 6;
const EDGE = 8;

/**
 * 自动避开视口边缘（同 Naive 的 flip + shift）：按触发元素的位置与气泡的大小算——
 * 这一边放不下、对边放得下就换过去（上 ↔ 下、左 ↔ 右；左右都放不下改到上 / 下），上下方向的再左右平移进视口、两边各留 8px。
 * 伸出视口不只是看不全：横向溢出会把手机的布局视口撑宽、整页缩小。气泡宽度另由 CSS 封顶到视口宽减 16px。
 * 打开时、气泡尺寸变了（内容 / 字体载入）、窗口尺寸变了时重算；滚动时不跟（打开着的提示不来回翻）。
 * 触发元素不在视口里时（常显的提示在页面下方挂载）不上下翻，只管左右。平移给 transform——CSS 定位用的是 translate 属性，两者叠加
 */
export function useAutoPlace(
  open: Ref<boolean>,
  placement: () => PopoverPlacement,
  anchor: Ref<HTMLElement | null>,
  bubble: Ref<HTMLElement | null>,
) {
  const placed = ref<PopoverPlacement>(placement());
  const dx = ref(0);

  function place() {
    const a = anchor.value;
    const b = bubble.value;
    if (!open.value || !a || !b) return;
    const root = a.ownerDocument.documentElement;
    const vw = root.clientWidth;
    const vh = root.clientHeight;
    const r = a.getBoundingClientRect();
    const w = b.offsetWidth;
    const h = b.offsetHeight;
    const fits = {
      top: r.top - GAP - h >= EDGE,
      bottom: r.bottom + GAP + h <= vh - EDGE,
      left: r.left - GAP - w >= EDGE,
      right: r.right + GAP + w <= vw - EDGE,
    };
    const visible = r.bottom > 0 && r.top < vh;
    const [want, align] = placement().split("-") as [keyof typeof fits, "start" | "end" | undefined];
    let side = want;
    if (side === "left" || side === "right") {
      const other = side === "left" ? "right" : "left";
      if (!fits[side]) side = fits[other] ? other : fits.top || !fits.bottom ? "top" : "bottom";
    } else if (visible && !fits[side]) {
      const other = side === "top" ? "bottom" : "top";
      if (fits[other]) side = other;
    }

    let shift = 0;
    if (side === "top" || side === "bottom") {
      const left = align === "start" ? r.left : align === "end" ? r.right - w : r.left + r.width / 2 - w / 2;
      shift = Math.round(Math.max(EDGE - left, Math.min(0, vw - EDGE - left - w)));
    }
    placed.value = align ? (`${side}-${align}` as PopoverPlacement) : side; // 只有上 / 下带对齐，翻到对边时照旧
    dx.value = shift;
  }

  let ro: ResizeObserver | undefined;
  let win: Window | null | undefined;
  function stop() {
    ro?.disconnect();
    ro = undefined;
    win?.removeEventListener("resize", place);
    win = undefined;
  }
  function update() {
    stop();
    if (!open.value) {
      placed.value = placement();
      dx.value = 0;
      return;
    }
    place();
    if (bubble.value && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(place);
      ro.observe(bubble.value);
    }
    win = anchor.value?.ownerDocument.defaultView;
    win?.addEventListener("resize", place);
  }
  // 不用 immediate：它在 setup 里同步跑、模板 ref 还是空的；挂载时（v-model 一开始就是 true）另跑一次
  watch([open, placement], update, { flush: "post" });
  onMounted(update);
  onBeforeUnmount(stop);

  /** 给气泡：实际的方向（拼 class）与平移 */
  const bubbleStyle = computed(() => (dx.value ? { transform: `translateX(${dx.value}px)` } : undefined));
  return { placed, bubbleStyle };
}
